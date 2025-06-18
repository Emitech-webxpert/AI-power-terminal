import * as pty from 'node-pty'
import { Client, ClientChannel } from 'ssh2'
import { Telnet } from 'telnet-client'
import { BrowserWindow } from 'electron'
import { randomUUID } from 'crypto'

interface CreateTerminalOptions {
  type?: 'local' | 'ssh' | 'telnet'
  protocol?: 'SSH2' | 'Telnet' | 'LocalTerminal'
  host?: string
  username?: string
  port?: number
}

interface Terminal {
  id: string
  type: 'local' | 'ssh' | 'telnet'
  ptyProcess?: pty.IPty
  sshClient?: Client
  sshStream?: ClientChannel
  telnetClient?: Telnet
  window: BrowserWindow
  // SSH specific properties
  sshParams?: {
    host: string
    username: string
    port: number
  }
  waitingForPassword?: boolean
  authFinishCallback?: (responses: string[]) => void
}

class TerminalManager {
  private terminals: Map<string, Terminal> = new Map()

  createTerminal(window: BrowserWindow, options?: CreateTerminalOptions): string {
    const terminalId = randomUUID()
    
    let terminalType: 'local' | 'ssh' | 'telnet' = 'local'
    if (options?.protocol === 'SSH2') terminalType = 'ssh'
    else if (options?.protocol === 'Telnet') terminalType = 'telnet'
    else if (options?.type) terminalType = options.type

    if (terminalType === 'ssh' && options) {
      return this.createSSHTerminal(window, terminalId, options)
    } else if (terminalType === 'telnet' && options) {
      return this.createTelnetTerminal(window, terminalId, options)
    } else {
      return this.createLocalTerminal(window, terminalId)
    }
  }

  private createLocalTerminal(window: BrowserWindow, terminalId: string): string {
    let shell = process.platform === 'win32' 
      ? (process.env.ComSpec || 'cmd.exe')
      : (process.env.SHELL || (process.platform === 'darwin' ? '/bin/zsh' : '/bin/bash'))

    const cwd = process.env.HOME || process.env.USERPROFILE || process.cwd()

    try {
      const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd,
        env: { ...process.env, TERM: 'xterm-256color', COLORTERM: 'truecolor' }
      })

      const terminal: Terminal = { id: terminalId, type: 'local', ptyProcess, window }
      this.terminals.set(terminalId, terminal)

      ptyProcess.onData((data: string) => {
        window.webContents.send('terminal:data', terminalId, data)
      })

      ptyProcess.onExit(({ exitCode }: { exitCode: number }) => {
        window.webContents.send('terminal:exit', terminalId, exitCode)
        this.terminals.delete(terminalId)
      })

      return terminalId
    } catch (error) {
      console.error('Failed to create local terminal:', error)
      throw error
    }
  }

  private createSSHTerminal(window: BrowserWindow, terminalId: string, options: CreateTerminalOptions): string {
    const sshClient = new Client()
    const terminal: Terminal = { id: terminalId, type: 'ssh', sshClient, window }
    this.terminals.set(terminalId, terminal)

    // Store connection params for retry
    terminal.sshParams = {
      host: options.host!,
      username: options.username!,
      port: options.port || 22
    }

    const connectionConfig = {
      host: options.host!,
      port: options.port || 22,
      username: options.username!,
      tryKeyboard: true,
      readyTimeout: 20000
    }

    sshClient.on('error', (err) => {
      console.error('SSH connection error:', err)
      
      if (err.message.includes('authentication') || err.message.includes('Authentication')) {
        terminal.waitingForPassword = true
        window.webContents.send('ssh:password-required', terminalId, {
          hostname: options.host!,
          username: options.username!
        })
        return
      }
      
      // For non-auth errors, show error but keep terminal open
      window.webContents.send('terminal:data', terminalId, `Connection failed: ${err.message}\r\n`)
    })

    sshClient.on('keyboard-interactive', (_name, _instructions, _lang, _prompts, finish) => {
      window.webContents.send('ssh:password-required', terminalId, {
        hostname: options.host!,
        username: options.username!
      })
      terminal.authFinishCallback = finish
    })

    sshClient.on('ready', () => {
      delete terminal.waitingForPassword

      sshClient.shell((err, stream) => {
        if (err) {
          window.webContents.send('terminal:data', terminalId, `Failed to create shell: ${err.message}\r\n`)
          return
        }

        terminal.sshStream = stream

        stream.on('data', (data: Buffer) => {
          window.webContents.send('terminal:data', terminalId, data.toString())
        })

        stream.on('close', () => {
          window.webContents.send('terminal:exit', terminalId, 0)
          this.terminals.delete(terminalId)
        })

        stream.on('error', (err: Error) => {
          window.webContents.send('terminal:data', terminalId, `Stream error: ${err.message}\r\n`)
        })
      })
    })

    sshClient.connect(connectionConfig)
    return terminalId
  }

  private createTelnetTerminal(window: BrowserWindow, terminalId: string, options: CreateTerminalOptions): string {
    const telnetClient = new Telnet()
    const terminal: Terminal = { id: terminalId, type: 'telnet', telnetClient, window }
    this.terminals.set(terminalId, terminal)

    const connectionParams = {
      host: options.host!,
      port: options.port || 23,
      timeout: 20000,
      negotiationMandatory: false,
      irs: '\r\n',
      ors: '\n'
    }

    window.webContents.send('terminal:data', terminalId, `Connecting to ${options.host}:${options.port || 23}...\r\n`)

    telnetClient.connect(connectionParams)
      .then(() => {
        telnetClient.on('data', (data: Buffer) => {
          window.webContents.send('terminal:data', terminalId, data.toString())
        })

        telnetClient.on('timeout', () => {
          window.webContents.send('terminal:data', terminalId, '\r\nConnection timeout\r\n')
        })

        telnetClient.on('error', (err: Error) => {
          window.webContents.send('terminal:data', terminalId, `Error: ${err.message}\r\n`)
        })
      })
      .catch((error) => {
        window.webContents.send('terminal:data', terminalId, `Connection failed: ${error.message}\r\n`)
      })

    return terminalId
  }

  writeToTerminal(terminalId: string, data: string): boolean {
    const terminal = this.terminals.get(terminalId)
    if (!terminal) return false

    try {
      if (terminal.type === 'local' && terminal.ptyProcess) {
        terminal.ptyProcess.write(data)
      } else if (terminal.type === 'ssh' && terminal.sshStream) {
        terminal.sshStream.write(data)
      } else if (terminal.type === 'telnet' && terminal.telnetClient) {
        terminal.telnetClient.send(data)
      } else {
        return false
      }
      return true
    } catch (error) {
      console.error(`Failed to write to terminal ${terminalId}:`, error)
      return false
    }
  }

  resizeTerminal(terminalId: string, cols: number, rows: number): boolean {
    const terminal = this.terminals.get(terminalId)
    if (!terminal) return false

    try {
      if (terminal.type === 'local' && terminal.ptyProcess) {
        terminal.ptyProcess.resize(cols, rows)
      } else if (terminal.type === 'ssh' && terminal.sshStream) {
        terminal.sshStream.setWindow(rows, cols, 0, 0)
      }
      return true
    } catch (error) {
      console.error(`Failed to resize terminal ${terminalId}:`, error)
      return false
    }
  }

  closeTerminal(terminalId: string): boolean {
    const terminal = this.terminals.get(terminalId)
    if (!terminal) return false

    try {
      if (terminal.type === 'local' && terminal.ptyProcess) {
        terminal.ptyProcess.kill()
      } else if (terminal.type === 'ssh') {
        terminal.sshStream?.end()
        terminal.sshClient?.end()
      } else if (terminal.type === 'telnet' && terminal.telnetClient) {
        terminal.telnetClient.end()
      }
      this.terminals.delete(terminalId)
      return true
    } catch (error) {
      console.error(`Failed to close terminal ${terminalId}:`, error)
      return false
    }
  }

  submitSSHPassword(terminalId: string, password: string): boolean {
    const terminal = this.terminals.get(terminalId)
    if (!terminal || terminal.type !== 'ssh') return false

    try {
      const authFinishCallback = terminal.authFinishCallback
      if (authFinishCallback) {
        authFinishCallback([password])
        delete terminal.authFinishCallback
        return true
      }

      if (terminal.waitingForPassword) {
        const sshParams = terminal.sshParams
        if (!sshParams) return false

        const newClient = new Client()
        terminal.sshClient = newClient
        delete terminal.waitingForPassword

        const connectionConfig = {
          host: sshParams.host,
          port: sshParams.port,
          username: sshParams.username,
          password: password,
          readyTimeout: 20000
        }

        newClient.on('ready', () => {
          newClient.shell((err, stream) => {
            if (err) {
              terminal.window.webContents.send('terminal:data', terminalId, `Failed to create shell: ${err.message}\r\n`)
              return
            }

            terminal.sshStream = stream

            stream.on('data', (data: Buffer) => {
              terminal.window.webContents.send('terminal:data', terminalId, data.toString())
            })

            stream.on('close', () => {
              terminal.window.webContents.send('terminal:exit', terminalId, 0)
              this.terminals.delete(terminalId)
            })

            stream.on('error', (err: Error) => {
              terminal.window.webContents.send('terminal:data', terminalId, `Stream error: ${err.message}\r\n`)
            })
          })
        })

        newClient.on('error', (err) => {
          if (err.message.includes('Authentication failure')) {
            terminal.window.webContents.send('terminal:data', terminalId, `Authentication failed. Please check your password.\r\n`)
            terminal.waitingForPassword = true
          } else {
            terminal.window.webContents.send('terminal:data', terminalId, `Connection failed: ${err.message}\r\n`)
          }
        })

        newClient.connect(connectionConfig)
        return true
      }

      return false
    } catch (error) {
      console.error(`Failed to submit SSH password for terminal ${terminalId}:`, error)
      return false
    }
  }

  // Handle SSH host key acceptance
  acceptSSHHostKey(terminalId: string): boolean {
    const terminal = this.terminals.get(terminalId)
    if (!terminal || terminal.type !== 'ssh') {
      console.error(`SSH terminal not found: ${terminalId}`)
      return false
    }

    try {
      console.log(`Host key accepted for terminal ${terminalId}`)
      return true
    } catch (error) {
      console.error(`Failed to accept SSH host key for terminal ${terminalId}:`, error)
      return false
    }
  }

  closeAllTerminals(): void {
    for (const [terminalId] of this.terminals) {
      this.closeTerminal(terminalId)
    }
  }

  getTerminalCount(): number {
    return this.terminals.size
  }
}

export const terminalManager = new TerminalManager()
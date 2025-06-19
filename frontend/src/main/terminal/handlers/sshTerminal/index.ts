import { Client } from 'ssh2'
import { BrowserWindow } from 'electron'
import { CreateTerminalOptions } from '@shared/type/terminal'
import { Terminal } from '@shared/index.types'

export class SSHTerminalHandler {
  create(window: BrowserWindow, terminalId: string, options: CreateTerminalOptions, terminals: Map<string, Terminal>): string {
    const sshClient = new Client()
    const terminal: Terminal = { id: terminalId, type: 'ssh', sshClient, window }
    terminals.set(terminalId, terminal)

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

    this.setupSSHEventHandlers(sshClient, terminal, options, terminals)
    sshClient.connect(connectionConfig)
    return terminalId
  }

  private setupSSHEventHandlers(sshClient: Client, terminal: Terminal, options: CreateTerminalOptions, terminals: Map<string, Terminal>) {
    const { window } = terminal
    const terminalId = terminal.id

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
      this.createShell(sshClient, terminal, terminals)
    })
  }

  private createShell(sshClient: Client, terminal: Terminal, terminals: Map<string, Terminal>) {
    const { window } = terminal
    const terminalId = terminal.id

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
        terminals.delete(terminalId)
      })

      stream.on('error', (err: Error) => {
        window.webContents.send('terminal:data', terminalId, `Stream error: ${err.message}\r\n`)
      })
    })
  }

  submitPassword(terminalId: string, password: string, terminals: Map<string, Terminal>): boolean {
    const terminal = terminals.get(terminalId)
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

        this.setupPasswordRetryHandlers(newClient, terminal, terminalId, terminals)
        newClient.connect(connectionConfig)
        return true
      }

      return false
    } catch (error) {
      console.error(`Failed to submit SSH password for terminal ${terminalId}:`, error)
      return false
    }
  }

  private setupPasswordRetryHandlers(newClient: Client, terminal: Terminal, terminalId: string, terminals: Map<string, Terminal>) {
    newClient.on('ready', () => {
      this.createShell(newClient, terminal, terminals)
    })

    newClient.on('error', (err) => {
      if (err.message.includes('Authentication failure')) {
        terminal.window.webContents.send('terminal:data', terminalId, `Authentication failed. Please check your password.\r\n`)
        terminal.waitingForPassword = true
      } else {
        terminal.window.webContents.send('terminal:data', terminalId, `Connection failed: ${err.message}\r\n`)
      }
    })
  }
}
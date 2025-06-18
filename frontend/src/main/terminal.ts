import * as pty from 'node-pty'
import { Client } from 'ssh2'
import { BrowserWindow } from 'electron'
import { randomUUID } from 'crypto'

interface SSHParams {
  host: string
  username: string
  port: number
  protocol?: string
}

interface CreateTerminalOptions {
  type?: 'local' | 'ssh'
  host?: string
  username?: string
  port?: number
  protocol?: string
}

interface Terminal {
  id: string
  type: 'local' | 'ssh'
  ptyProcess?: pty.IPty
  sshClient?: Client
  sshStream?: any
  window: BrowserWindow
}

class TerminalManager {
  private terminals: Map<string, Terminal> = new Map()

  createTerminal(window: BrowserWindow, options?: CreateTerminalOptions): string {
    const terminalId = randomUUID()
    const terminalType = options?.type || 'local'

    if (terminalType === 'ssh' && options) {
      return this.createSSHTerminal(window, terminalId, {
        host: options.host!,
        username: options.username!,
        port: options.port || 22,
        protocol: options.protocol
      })
    } else {
      return this.createLocalTerminal(window, terminalId)
    }
  }

  private createLocalTerminal(window: BrowserWindow, terminalId: string): string {
    // Cross-platform shell detection
    let shell: string
    let args: string[] = []

    if (process.platform === 'win32') {
      // Windows: Try PowerShell first, fallback to cmd
      shell = process.env.ComSpec || 'cmd.exe'
      // Check if PowerShell is available
      try {
        const pwsh = 'powershell.exe'
        shell = pwsh
      } catch {
        shell = 'cmd.exe'
      }
    } else if (process.platform === 'darwin') {
      // macOS: Use zsh (default since macOS 10.15) or bash
      shell = process.env.SHELL || '/bin/zsh'
    } else {
      // Linux: Use user's default shell or bash
      shell = process.env.SHELL || '/bin/bash'
    }

    // Set appropriate working directory
    const cwd = process.env.HOME || process.env.USERPROFILE || process.cwd()

    try {
      // Create new pty process
      const ptyProcess = pty.spawn(shell, args, {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: cwd,
        env: {
          ...process.env,
          TERM: 'xterm-256color',
          COLORTERM: 'truecolor'
        }
      })

      // Store terminal reference
      const terminal: Terminal = {
        id: terminalId,
        type: 'local',
        ptyProcess,
        window
      }

      this.terminals.set(terminalId, terminal)

      // Listen for data from pty and send to renderer
      ptyProcess.onData((data: string) => {
        window.webContents.send('terminal:data', terminalId, data)
      })

      // Listen for pty exit
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

  private createSSHTerminal(window: BrowserWindow, terminalId: string, sshParams: SSHParams): string {
    try {
      const sshClient = new Client()
      
      // Store terminal reference
      const terminal: Terminal = {
        id: terminalId,
        type: 'ssh',
        sshClient,
        window
      }

      this.terminals.set(terminalId, terminal)

      // SSH connection configuration
      const connectionConfig = {
        host: sshParams.host,
        port: sshParams.port,
        username: sshParams.username,
        // Note: For now, we'll handle authentication through the terminal
        // In production, you might want to handle key-based auth here
        tryKeyboard: true,
        readyTimeout: 20000
      }

      sshClient.on('ready', () => {
        console.log('SSH connection established')
        window.webContents.send('terminal:data', terminalId, `Connected to ${sshParams.username}@${sshParams.host}\r\n`)

        // Create shell session
        sshClient.shell((err, stream) => {
          if (err) {
            console.error('SSH shell error:', err)
            window.webContents.send('terminal:data', terminalId, `Failed to create shell: ${err.message}\r\n`)
            return
          }

          // Store stream reference
          terminal.sshStream = stream

          // Handle stream data (output from remote server)
          stream.on('data', (data: Buffer) => {
            window.webContents.send('terminal:data', terminalId, data.toString())
          })

          // Handle stream close
          stream.on('close', () => {
            console.log('SSH stream closed')
            window.webContents.send('terminal:exit', terminalId, 0)
            this.terminals.delete(terminalId)
          })

          // Handle stream errors
          stream.on('error', (err: Error) => {
            console.error('SSH stream error:', err)
            window.webContents.send('terminal:data', terminalId, `Stream error: ${err.message}\r\n`)
          })
        })
      })

      sshClient.on('error', (err) => {
        console.error('SSH connection error:', err)
        window.webContents.send('terminal:data', terminalId, `Connection failed: ${err.message}\r\n`)
        window.webContents.send('terminal:exit', terminalId, 1)
        this.terminals.delete(terminalId)
      })

      sshClient.on('end', () => {
        console.log('SSH connection ended')
        window.webContents.send('terminal:exit', terminalId, 0)
        this.terminals.delete(terminalId)
      })

      // Start the SSH connection
      sshClient.connect(connectionConfig)

      return terminalId

    } catch (error) {
      console.error('Failed to create SSH terminal:', error)
      throw error
    }
  }

  writeToTerminal(terminalId: string, data: string): boolean {
    const terminal = this.terminals.get(terminalId)
    if (!terminal) {
      console.error(`Terminal not found: ${terminalId}`)
      return false
    }

    try {
      if (terminal.type === 'local' && terminal.ptyProcess) {
        terminal.ptyProcess.write(data)
      } else if (terminal.type === 'ssh' && terminal.sshStream) {
        terminal.sshStream.write(data)
      } else {
        console.error(`Terminal ${terminalId} not properly initialized`)
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
    if (!terminal) {
      console.error(`Terminal not found: ${terminalId}`)
      return false
    }

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
    if (!terminal) {
      console.error(`Terminal not found: ${terminalId}`)
      return false
    }

    try {
      if (terminal.type === 'local' && terminal.ptyProcess) {
        terminal.ptyProcess.kill()
      } else if (terminal.type === 'ssh') {
        if (terminal.sshStream) {
          terminal.sshStream.end()
        }
        if (terminal.sshClient) {
          terminal.sshClient.end()
        }
      }
      this.terminals.delete(terminalId)
      return true
    } catch (error) {
      console.error(`Failed to close terminal ${terminalId}:`, error)
      return false
    }
  }

  // Clean up all terminals when app closes
  closeAllTerminals(): void {
    for (const [terminalId] of this.terminals) {
      this.closeTerminal(terminalId)
    }
  }

  getTerminalCount(): number {
    return this.terminals.size
  }
}

// Export singleton instance
export const terminalManager = new TerminalManager()
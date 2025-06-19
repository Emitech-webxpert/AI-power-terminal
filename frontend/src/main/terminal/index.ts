import { BrowserWindow } from 'electron'
import { randomUUID } from 'crypto'
import { CreateTerminalOptions } from '@shared/type/terminal'
import { Terminal } from '@shared/index.types'
import { LocalTerminalHandler } from '@main/terminal/handlers/localTerminal'
import { SSHTerminalHandler } from '@main/terminal/handlers/sshTerminal'
import { TelnetTerminalHandler } from '@main/terminal/handlers/telnetTerminal'

class TerminalManager {
  private terminals: Map<string, Terminal> = new Map()
  private localHandler = new LocalTerminalHandler()
  private sshHandler = new SSHTerminalHandler()
  private telnetHandler = new TelnetTerminalHandler()

  createTerminal(window: BrowserWindow, options?: CreateTerminalOptions): string {
    const terminalId = randomUUID()

    let terminalType: 'local' | 'ssh' | 'telnet' = 'local'
    if (options?.protocol === 'SSH2') terminalType = 'ssh'
    else if (options?.protocol === 'Telnet') terminalType = 'telnet'
    else if (options?.type) terminalType = options.type

    if (terminalType === 'ssh' && options) {
      return this.sshHandler.create(window, terminalId, options, this.terminals)
    } else if (terminalType === 'telnet' && options) {
      return this.telnetHandler.create(window, terminalId, options, this.terminals)
    } else {
      return this.localHandler.create(window, terminalId, this.terminals)
    }
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
    return this.sshHandler.submitPassword(terminalId, password, this.terminals)
  }

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
import * as pty from 'node-pty'
import { BrowserWindow } from 'electron'
import { randomUUID } from 'crypto'

interface Terminal {
  id: string
  ptyProcess: pty.IPty
  window: BrowserWindow
}

class TerminalManager {
  private terminals: Map<string, Terminal> = new Map()

  createTerminal(window: BrowserWindow): string {
    const terminalId = randomUUID()
    
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
      console.error('Failed to create terminal:', error)
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
      terminal.ptyProcess.write(data)
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
      terminal.ptyProcess.resize(cols, rows)
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
      terminal.ptyProcess.kill()
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
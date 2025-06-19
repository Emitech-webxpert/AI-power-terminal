import * as pty from 'node-pty'
import { BrowserWindow } from 'electron'
import { Terminal } from '@shared/index.types'

export class LocalTerminalHandler {
  create(window: BrowserWindow, terminalId: string, terminals: Map<string, Terminal>): string {
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
      terminals.set(terminalId, terminal)

      ptyProcess.onData((data: string) => {
        window.webContents.send('terminal:data', terminalId, data)
      })

      ptyProcess.onExit(({ exitCode }: { exitCode: number }) => {
        window.webContents.send('terminal:exit', terminalId, exitCode)
        terminals.delete(terminalId)
      })

      return terminalId
    } catch (error) {
      console.error('Failed to create local terminal:', error)
      throw error
    }
  }
}
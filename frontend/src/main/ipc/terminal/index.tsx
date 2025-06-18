import { ipcMain, BrowserWindow, app } from 'electron'
import { terminalManager } from '../../terminal'

interface CreateTerminalOptions {
  type?: 'local' | 'ssh' | 'telnet'
  protocol?: 'SSH2' | 'Telnet' | 'LocalTerminal'
  host?: string
  username?: string
  port?: number
}

const terminalIPc = () => {
  ipcMain.handle('terminal:create', async (_event, options?: CreateTerminalOptions) => {
    try {
      const window = BrowserWindow.fromWebContents(_event.sender)
      if (!window) {
        throw new Error('No window found')
      }

      const terminalId = terminalManager.createTerminal(window, options)
      return { success: true, terminalId }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to create terminal:', error)
      return { success: false, error: errorMessage }
    }
  })

  ipcMain.handle('terminal:write', async (_event, terminalId: string, data: string) => {
    try {
      const success = terminalManager.writeToTerminal(terminalId, data)
      return { success }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to write to terminal:', error)
      return { success: false, error: errorMessage }
    }
  })

  ipcMain.handle('terminal:resize', async (_event, terminalId: string, cols: number, rows: number) => {
    try {
      const success = terminalManager.resizeTerminal(terminalId, cols, rows)
      return { success }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to resize terminal:', error)
      return { success: false, error: errorMessage }
    }
  })

  ipcMain.handle('terminal:close', async (_event, terminalId: string) => {
    try {
      const success = terminalManager.closeTerminal(terminalId)
      return { success }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to close terminal:', error)
      return { success: false, error: errorMessage }
    }
  })

  // SSH-specific handlers (only for SSH2 protocol)
  ipcMain.handle('ssh:submit-password', async (_event, terminalId: string, password: string) => {
    try {
      const success = terminalManager.submitSSHPassword(terminalId, password)
      return { success }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to submit SSH password:', error)
      return { success: false, error: errorMessage }
    }
  })

  ipcMain.handle('ssh:accept-host-key', async (_event, terminalId: string) => {
    try {
      const success = terminalManager.acceptSSHHostKey(terminalId)
      return { success }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to accept SSH host key:', error)
      return { success: false, error: errorMessage }
    }
  })

  ipcMain.handle('get_app_version', () => {
    return app.getVersion()
  })

  ipcMain.on('restart_app', () => {
    console.log('Restart requested from renderer (handled by autoUpdater)')
  })
}

export default terminalIPc
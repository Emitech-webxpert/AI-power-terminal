import { autoUpdater } from 'electron-updater'
import { app, BrowserWindow, ipcMain } from 'electron'

export const setupAutoUpdater = (): void => {
  if (!app.isPackaged) {
    console.log('Auto-update skipped: development environment.')
    return
  }

  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'XepertWebApp',
    repo: 'ai-power-terminal'
  })

  autoUpdater.checkForUpdatesAndNotify().catch((err) => {
    console.warn('Auto-updater error:', err)
  })

  autoUpdater.on('update-available', () => {
    console.log('Update available')
    BrowserWindow.getAllWindows().forEach((win) => win.webContents.send('update_available'))
  })

  autoUpdater.on('update-not-available', (info) => {
    console.log('No updates available:', info)
  })

  autoUpdater.on('download-progress', (progress) => {
    console.log('Download progress:', progress.percent.toFixed(2) + '%')
  })

  autoUpdater.on('update-downloaded', () => {
    console.log('Update downloaded')
    BrowserWindow.getAllWindows().forEach((win) => win.webContents.send('update_downloaded'))
  })

  autoUpdater.on('error', (err) => {
    console.error('Auto-updater error:', err)
  })

  ipcMain.on('restart_app', () => {
    console.log('Restarting app to install update...')
    autoUpdater.quitAndInstall()
  })
}

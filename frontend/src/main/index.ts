import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createWindow } from './window'
import { createApplicationMenu } from './window'
import { TerminalIpc } from './ipc'
import  {setupAutoUpdater } from './autoUpdater'
import { setupAllBackgroundServices } from './spawn'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createApplicationMenu()
  createWindow()
  TerminalIpc()
  setupAutoUpdater()
  setupAllBackgroundServices()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
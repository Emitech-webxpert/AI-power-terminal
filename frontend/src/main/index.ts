// src/main/index.ts
import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createWindow, createApplicationMenu } from '@main/window'
import { TerminalIpc,GoogleAuthIpc } from '@main/ipc'
import { setupAutoUpdater } from '@main/autoUpdater'
import { setupAllBackgroundServices } from '@main/spawn'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createApplicationMenu()
  createWindow()
  TerminalIpc()
  GoogleAuthIpc() // Add this line
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
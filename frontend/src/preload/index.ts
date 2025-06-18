import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

interface CreateTerminalOptions {
  type?: 'local' | 'ssh' | 'telnet'
  host?: string
  username?: string
  port?: number
  protocol?: string
}

// Secure Terminal API - NO direct ipcRenderer exposure
const terminalAPI = {
  // Terminal lifecycle - Updated to support SSH options
  createTerminal: (options?: CreateTerminalOptions) => ipcRenderer.invoke('terminal:create', options),
  closeTerminal: (terminalId: string) => ipcRenderer.invoke('terminal:close', terminalId),
  
  // Terminal input/output
  writeToTerminal: (terminalId: string, data: string) =>
    ipcRenderer.invoke('terminal:write', terminalId, data),
  
  // Terminal sizing
  resizeTerminal: (terminalId: string, cols: number, rows: number) =>
    ipcRenderer.invoke('terminal:resize', terminalId, cols, rows),
  
  // Listen for terminal output (secure event listener)
  onTerminalData: (callback: (terminalId: string, data: string) => void) => {
    const listener = (_: any, terminalId: string, data: string) => callback(terminalId, data)
    ipcRenderer.on('terminal:data', listener)
    
    // Return cleanup function
    return () => ipcRenderer.removeListener('terminal:data', listener)
  },
  
  // Listen for terminal exit
  onTerminalExit: (callback: (terminalId: string, exitCode: number) => void) => {
    const listener = (_: any, terminalId: string, exitCode: number) => callback(terminalId, exitCode)
    ipcRenderer.on('terminal:exit', listener)
    
    // Return cleanup function  
    return () => ipcRenderer.removeListener('terminal:exit', listener)
  },

  // SSH-specific methods
  submitSSHPassword: (terminalId: string, password: string) => 
    ipcRenderer.invoke('ssh:submit-password', terminalId, password),
  
  acceptSSHHostKey: (terminalId: string) => 
    ipcRenderer.invoke('ssh:accept-host-key', terminalId),

  // SSH event listeners
  onSSHPasswordRequired: (callback: (terminalId: string, data: { hostname: string, username: string }) => void) => {
    const listener = (_: any, terminalId: string, data: any) => callback(terminalId, data)
    ipcRenderer.on('ssh:password-required', listener)
    return () => ipcRenderer.removeListener('ssh:password-required', listener)
  },

  onSSHHostVerificationRequired: (callback: (terminalId: string, data: { hostname: string, hostKey: string }) => void) => {
    const listener = (_: any, terminalId: string, data: any) => callback(terminalId, data)
    ipcRenderer.on('ssh:host-verification-required', listener)
    return () => ipcRenderer.removeListener('ssh:host-verification-required', listener)
  }
}

// Custom APIs for renderer
const api = {
  terminal: terminalAPI,  // Secure terminal API only
  NODE_SERVER_URL: process.env.NODE_SERVER_URL || '',
  AI_SERVER_URL: process.env.AI_SERVER_URL || ''
}

// Use `contextBridge` APIs to expose Electron APIs to renderer
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
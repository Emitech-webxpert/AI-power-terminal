// src/preload/index.ts
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import {CreateTerminalOptions, TerminalResponse,BasicResponse,SSHPasswordData,SSHHostKeyData,GoogleAuthResult,NotificationOptions,NotificationResponse} from '@shared/type'


const terminalAPI = {
  // Terminal lifecycle - Updated to support SSH options
  createTerminal: (options?: CreateTerminalOptions): Promise<TerminalResponse> => 
    ipcRenderer.invoke('terminal:create', options),
  
  closeTerminal: (terminalId: string): Promise<BasicResponse> => 
    ipcRenderer.invoke('terminal:close', terminalId),
  
  // Terminal input/output
  writeToTerminal: (terminalId: string, data: string): Promise<BasicResponse> =>
    ipcRenderer.invoke('terminal:write', terminalId, data),
  
  // Terminal sizing
  resizeTerminal: (terminalId: string, cols: number, rows: number): Promise<BasicResponse> =>
    ipcRenderer.invoke('terminal:resize', terminalId, cols, rows),
  
  // Listen for terminal output (secure event listener)
  onTerminalData: (callback: (terminalId: string, data: string) => void): (() => void) => {
    const listener = (_event: IpcRendererEvent, terminalId: string, data: string) => 
      callback(terminalId, data)
    
    ipcRenderer.on('terminal:data', listener)
    
    // Return cleanup function
    return () => ipcRenderer.removeListener('terminal:data', listener)
  },
  
  // Listen for terminal exit
  onTerminalExit: (callback: (terminalId: string, exitCode: number) => void): (() => void) => {
    const listener = (_event: IpcRendererEvent, terminalId: string, exitCode: number) => 
      callback(terminalId, exitCode)
    
    ipcRenderer.on('terminal:exit', listener)
    
    // Return cleanup function
    return () => ipcRenderer.removeListener('terminal:exit', listener)
  },
  
  // SSH-specific methods
  submitSSHPassword: (terminalId: string, password: string): Promise<BasicResponse> =>
    ipcRenderer.invoke('ssh:submit-password', terminalId, password),
  
  acceptSSHHostKey: (terminalId: string): Promise<BasicResponse> =>
    ipcRenderer.invoke('ssh:accept-host-key', terminalId),
  
  // SSH event listeners
  onSSHPasswordRequired: (
    callback: (terminalId: string, data: SSHPasswordData) => void
  ): (() => void) => {
    const listener = (_event: IpcRendererEvent, terminalId: string, data: SSHPasswordData) => 
      callback(terminalId, data)
    
    ipcRenderer.on('ssh:password-required', listener)
    return () => ipcRenderer.removeListener('ssh:password-required', listener)
  },
  
  onSSHHostVerificationRequired: (
    callback: (terminalId: string, data: SSHHostKeyData) => void
  ): (() => void) => {
    const listener = (_event: IpcRendererEvent, terminalId: string, data: SSHHostKeyData) => 
      callback(terminalId, data)
    
    ipcRenderer.on('ssh:host-verification-required', listener)
    return () => ipcRenderer.removeListener('ssh:host-verification-required', listener)
  }
}

const googleAuthAPI = {
  authenticate: (): Promise<GoogleAuthResult> => ipcRenderer.invoke('google:authenticate')
}

const notificationAPI = {
  show: (options: NotificationOptions): Promise<NotificationResponse> =>
    ipcRenderer.invoke('notification:show', options)
}

// Custom APIs for renderer with proper typing
const api = {
  terminal: terminalAPI,
  googleAuth: googleAuthAPI,
  notification: notificationAPI,
  NODE_SERVER_URL: process.env.NODE_SERVER_URL || '',
  AI_SERVER_URL: process.env.AI_SERVER_URL || ''
} as const

// Type the window extensions properly
declare global {
  interface Window {
    electron: typeof electronAPI
    api: typeof api
  }
}

// Use `contextBridge` APIs to expose Electron APIs to renderer
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Failed to expose APIs to main world:', error)
  }
} else {
  // Fallback for non-isolated context
  ;(window as Window & typeof globalThis).electron = electronAPI
  ;(window as Window & typeof globalThis).api = api
}

// Export types for use in other files
export type { 
  TerminalResponse, 
  BasicResponse, 
  SSHPasswordData, 
  SSHHostKeyData, 
  GoogleAuthResult,
  NotificationOptions,
  NotificationResponse
}
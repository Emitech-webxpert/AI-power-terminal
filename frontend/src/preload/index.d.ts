// src/preload/window.d.ts - Update your existing file
import { ElectronAPI } from '@electron-toolkit/preload'
import { CreateTerminalOptions } from '@shared/type'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      terminal: {
        // Terminal lifecycle
        createTerminal: (options?: CreateTerminalOptions) => Promise<{ success: boolean; terminalId?: string; error?: string }>
        closeTerminal: (terminalId: string) => Promise<{ success: boolean; error?: string }>
        
        // Terminal input/output
        writeToTerminal: (terminalId: string, data: string) => Promise<{ success: boolean; error?: string }>
        
        // Terminal sizing
        resizeTerminal: (terminalId: string, cols: number, rows: number) => Promise<{ success: boolean; error?: string }>
        
        // Event listeners
        onTerminalData: (callback: (terminalId: string, data: string) => void) => (() => void)
        onTerminalExit: (callback: (terminalId: string, exitCode: number) => void) => (() => void)
        
        // SSH-specific methods
        submitSSHPassword: (terminalId: string, password: string) => Promise<{ success: boolean; error?: string }>
        acceptSSHHostKey: (terminalId: string) => Promise<{ success: boolean; error?: string }>
        
        // SSH event listeners
        onSSHPasswordRequired: (callback: (terminalId: string, data: { hostname: string; username: string }) => void) => (() => void)
        onSSHHostVerificationRequired: (callback: (terminalId: string, data: { hostname: string; hostKey: string }) => void) => (() => void)
      }
      googleAuth: {
        authenticate: () => Promise<{
          success: boolean
          data?: {
            access_token: string
            refresh_token?: string
            userInfo: {
              id: string
              email: string
              name: string
              picture: string
              given_name: string
              family_name: string
            }
          }
          error?: string
        }>
      }
      NODE_SERVER_URL: string
      AI_SERVER_URL: string
    }
    // Terminal functions exposed by TerminalTabs component
    createLocalShell?: () => void
    createRemoteTerminal?: (connectionParams: {
      protocol: 'SSH2' | 'Telnet'
      host: string
      username?: string
      port: number
    }) => void
  }
}

export {}
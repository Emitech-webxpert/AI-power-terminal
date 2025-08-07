// src/preload/window.d.ts - Update your existing file
import { ElectronAPI } from '@electron-toolkit/preload'
import { CreateTerminalOptions, TerminalResponse, BasicResponse, SSHPasswordData, SSHHostKeyData, GoogleAuthResult, NotificationOptions, NotificationResponse } from '@shared/type'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      terminal: {
        // Terminal lifecycle
        createTerminal: (options?: CreateTerminalOptions) => Promise<TerminalResponse>
        closeTerminal: (terminalId: string) => Promise<BasicResponse>

        // Terminal input/output
        writeToTerminal: (terminalId: string, data: string) => Promise<BasicResponse>

        // Terminal sizing
        resizeTerminal: (terminalId: string, cols: number, rows: number) => Promise<BasicResponse>

        // Event listeners
        onTerminalData: (callback: (terminalId: string, data: string) => void) => (() => void)
        onTerminalExit: (callback: (terminalId: string, exitCode: number) => void) => (() => void)

        // SSH-specific methods
        submitSSHPassword: (terminalId: string, password: string) => Promise<BasicResponse>
        acceptSSHHostKey: (terminalId: string) => Promise<BasicResponse>

        // SSH event listeners
        onSSHPasswordRequired: (callback: (terminalId: string, data: SSHPasswordData) => void) => (() => void)
        onSSHHostVerificationRequired: (callback: (terminalId: string, data: SSHHostKeyData) => void) => (() => void)
      }
      googleAuth: {
        authenticate: () => Promise<GoogleAuthResult>
      }
      // ADD THIS: Notification API
      notification: {
        show: (options: NotificationOptions) => Promise<NotificationResponse>
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

export { }
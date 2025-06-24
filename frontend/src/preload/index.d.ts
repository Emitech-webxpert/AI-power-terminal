import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
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
    createSSHTerminal?: (sshParams: {
      host: string
      username: string
      port: number
      protocol?: string
    }) => void
  }
}

export { }
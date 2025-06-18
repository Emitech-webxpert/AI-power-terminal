import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
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

export {}
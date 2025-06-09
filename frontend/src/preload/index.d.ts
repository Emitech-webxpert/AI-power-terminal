import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      NODE_SERVER_URL: string
      AI_SERVER_URL: string
    }
  }
}

export {}

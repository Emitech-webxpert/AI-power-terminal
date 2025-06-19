import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
// import { getEnv } from './src/shared'

const sharedAlias = {
  '@renderer': resolve(__dirname, 'src/renderer/src'),
  '@modals': resolve(__dirname, 'src/renderer/src/components/modals'),
  '@components': resolve(__dirname, 'src/renderer/src/components'),
  '@shared': resolve(__dirname, 'src/shared'),
  '@main': resolve(__dirname, 'src/main')
}

export default defineConfig({
  main: {
    resolve: {
      alias: sharedAlias
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    resolve: {
      alias: sharedAlias
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: sharedAlias
    },
    plugins: [
      react(),
      // {
      //   name: 'inject-node-server-port',
      //   transformIndexHtml(html: string): string {
      //     return html.replace(/__NODE_SERVER_URL__/g, getEnv('NODE_SERVER_URL'))
      //   }
      // },
      // {
      //   name: 'inject-ai-server-port',
      //   transformIndexHtml(html: string): string {
      //     return html.replace(/__AI_SERVER_URL__/g, getEnv('AI_SERVER_URL'))
      //   }
      // }
    ]
  }
})
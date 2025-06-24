import { ipcMain, BrowserWindow } from 'electron'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
const REDIRECT_URI = process.env.REDIRECT_URI || ''

const googleAuthIPC = () => {
  ipcMain.handle('google:authenticate', async (_event) => {
    try {
      const authUrl = getAuthUrl()
      
      const authWindow = new BrowserWindow({
        width: 500,
        height: 600,
        show: true,
        modal: true,
        center: true,
        resizable: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          webSecurity: true
        }
      })

      const result = await new Promise((resolve) => {
        authWindow.loadURL(authUrl)

        authWindow.on('closed', () => {
          resolve({ success: false, error: 'Authentication window was closed' })
        })

        authWindow.webContents.on('will-navigate', (event, navigationUrl) => {
          if (navigationUrl.startsWith(REDIRECT_URI)) {
            event.preventDefault()
            handleCallback(navigationUrl, authWindow, resolve)
          }
        })

        authWindow.webContents.on('will-redirect', (event, navigationUrl) => {
          if (navigationUrl.startsWith(REDIRECT_URI)) {
            event.preventDefault()
            handleCallback(navigationUrl, authWindow, resolve)
          }
        })
      })

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to authenticate with Google:', error)
      return { success: false, error: errorMessage }
    }
  })
}

const getAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent'
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

const handleCallback = async (url: string, authWindow: BrowserWindow, resolve: (result: any) => void) => {
  try {
    const urlParams = new URL(url)
    const code = urlParams.searchParams.get('code')
    const error = urlParams.searchParams.get('error')

    if (error) {
      resolve({ success: false, error: `OAuth error: ${error}` })
    } else if (code) {
      const tokens = await exchangeCodeForTokens(code)
      resolve({ success: true, data: tokens })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    resolve({ success: false, error: errorMessage })
  } finally {
    if (authWindow && !authWindow.isDestroyed()) {
      authWindow.close()
    }
  }
}

const exchangeCodeForTokens = async (code: string) => {
  const tokenUrl = 'https://oauth2.googleapis.com/token'
  
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI
  })

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  })

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`)
  }

  const tokens = await response.json()
  const userInfo = await getUserInfo(tokens.access_token)
  
  return {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    userInfo
  }
}

const getUserInfo = async (accessToken: string) => {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to get user info: ${response.statusText}`)
  }

  return await response.json()
}

export default googleAuthIPC
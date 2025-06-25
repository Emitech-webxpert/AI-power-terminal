import { ipcMain, BrowserWindow } from 'electron'
import {GoogleUserInfo,GoogleTokenResponse,GoogleAuthResult,GoogleAuthError,GoogleAuthSuccess} from '@shared/type'
const GOOGLE_CLIENT_ID = '598818981031-bsh9rhfp1frj5alsr1j10kjl9onvj83n.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'
const REDIRECT_URI = 'http://localhost:3000/auth/callback'


type AuthResult = GoogleAuthSuccess | GoogleAuthError

const googleAuthIPC = (): void => {
  ipcMain.handle('google:authenticate', async (): Promise<AuthResult> => {
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

      const result = await new Promise<AuthResult>((resolve) => {
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

const handleCallback = async (
  url: string, 
  authWindow: BrowserWindow, 
  resolve: (result: AuthResult) => void
): Promise<void> => {
  try {
    const urlParams = new URL(url)
    const code = urlParams.searchParams.get('code')
    const error = urlParams.searchParams.get('error')

    if (error) {
      resolve({ success: false, error: `OAuth error: ${error}` })
    } else if (code) {
      const tokens = await exchangeCodeForTokens(code)
      resolve({ success: true, data: tokens })
    } else {
      resolve({ success: false, error: 'No authorization code received' })
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

const exchangeCodeForTokens = async (code: string): Promise<{
  access_token: string
  refresh_token?: string
  userInfo: GoogleUserInfo
}> => {
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

  const tokens: GoogleTokenResponse = await response.json()
  const userInfo = await getUserInfo(tokens.access_token)
  
  return {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    userInfo
  }
}

const getUserInfo = async (accessToken: string): Promise<GoogleUserInfo> => {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to get user info: ${response.statusText}`)
  }

  const userInfo: GoogleUserInfo = await response.json()
  return userInfo
}

export default googleAuthIPC

// Export types for use in other files
export type { GoogleAuthResult, GoogleUserInfo }
export interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale?: string
}

export interface GoogleTokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
  scope: string
}
export interface GoogleAuthData {
  access_token: string
  refresh_token?: string
  userInfo: GoogleUserInfo
}

export interface GoogleAuthResult {
  success: boolean
  data?: GoogleAuthData
  error?: string
}

export interface GoogleAuthError {
  success: false
  error: string
}

export interface GoogleAuthSuccess {
  success: true
  data: GoogleAuthData
}
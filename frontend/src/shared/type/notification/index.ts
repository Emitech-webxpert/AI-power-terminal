export interface NotificationOptions {
  title: string
  body: string
  icon?: string
  silent?: boolean
}

export interface NotificationResponse {
  success: boolean
  error?: string
}
import { NotificationOptions } from '../../../../preload'

export const showNotification = async (options: NotificationOptions): Promise<boolean> => {
  try {
    if (!window.api?.notification) {
      console.error('Notification API not available')
      return false
    }

    const result = await window.api.notification.show(options)
    return result.success
  } catch (error) {
    console.error('Notification error:', error)
    return false
  }
}

export const showSuccess = (title: string, body: string): Promise<boolean> => {
  return showNotification({
    title: `✅ ${title}`,
    body,
    silent: false
  })
}

export const showError = (title: string, body: string): Promise<boolean> => {
  return showNotification({
    title: `❌ ${title}`,
    body,
    silent: false
  })
}
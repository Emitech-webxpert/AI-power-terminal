import { ipcMain, Notification } from 'electron'

const notificationIpc =()=>{
ipcMain.handle('notification:show', async (event, options) => {
  try {
    if (!Notification.isSupported()) {
      return { success: false, error: 'Notifications not supported' }
    }

    const notification = new Notification({
      title: options.title,
      body: options.body,
      icon: options.icon,
      silent: options.silent || false
    })

    notification.show()
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
})
}
export default notificationIpc
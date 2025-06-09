import { useEffect } from 'react'

const useUpdateCheck = (): void => {
  useEffect(() => {
    const { ipcRenderer } = window.electron

    const handleUpdateAvailable = (): void => {
      alert('🚀 Update available. Downloading...')
      console.log('Starting download...')
    }

    const handleUpdateDownloaded = (): void => {
      const confirmRestart = window.confirm('✅ Update downloaded. Restart now?')
      if (confirmRestart) {
        ipcRenderer.send('restart_app')
      }
    }

    const removeUpdateAvailable = ipcRenderer.on('update_available', handleUpdateAvailable)
    const removeUpdateDownloaded = ipcRenderer.on('update_downloaded', handleUpdateDownloaded)

    ipcRenderer.invoke('get_app_version').then((version: string): void => {
      console.log('App version is:', version)
    })

    return (): void => {
      removeUpdateAvailable()
      removeUpdateDownloaded()
    }
  }, [])
}
export default useUpdateCheck

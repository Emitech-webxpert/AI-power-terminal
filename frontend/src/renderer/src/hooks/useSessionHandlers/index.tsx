import { AppDispatch } from '@renderer/store'
import { Session } from '@renderer/type/sshSession'
import {
  toggleSessionsExpanded,
  toggleSessionsExpandedInner,
  openSessionWizard,
  closeSessionWizard,
  openQuickConnect,
  closeQuickConnect,
  openDuplicate,
  closeDuplicate,
  openSessionContext,
  closeSessionContext,
  openSessionContextFile,
  closeSessionContextFile,
  openRename,
  closeRename,
  openDelete,
  closeDelete
} from '@renderer/store/slices/sessionList'
import { fetchSessions } from '@renderer/store/slices/sessionThunks'

declare global {
  interface Window {
    createRemoteTerminal?: (params: {
      protocol: string
      host: string
      username: string
      port: number
    }) => void
    createLocalShell?: () => void
  }
}

const useSessionHandlers = (dispatch: AppDispatch) => {
  const handleRenameOpen = () => dispatch(openRename())
  const handleRenameClose = () => dispatch(closeRename())
  const handleSessionWizadClick = () => dispatch(openSessionWizard())
  const handleSessionWizadClose = () => dispatch(closeSessionWizard())
  const handleQuickConnectClose = () => dispatch(closeQuickConnect())
  const handleQuickConnectClick = () => dispatch(openQuickConnect())
  const handleDuplicateClick = () => dispatch(openDuplicate())
  const handleDuplicateClose = () => dispatch(closeDuplicate())
  const handleDeleteClose = () => dispatch(closeDelete())
  const handleSessionContextOpen = () => dispatch(openSessionContext())
  const handleSessionContextClose = () => dispatch(closeSessionContext())
  const handleSessionContextOpenFile = (id: string) => dispatch(openSessionContextFile(id))
  const handleSessionContextCloseFile = () => dispatch(closeSessionContextFile())
  const handleSessionsClick = () => dispatch(toggleSessionsExpandedInner())
  const handleRefreshSessions = () => dispatch(fetchSessions())
  const handleDeleteOpen = (title: string) => dispatch(openDelete(title))
  const handleToggleExpanded = () => dispatch(toggleSessionsExpanded())

  const handleSessionsRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleSessionContextOpen()
  }

  const handleSessionsRightClickFile = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    handleSessionContextOpenFile(id)
  }

  const handleSessionDoubleClick = (session: Session) => {
    console.log('🎯 Session double clicked:', session)
    
    // Determine the connection type based on protocol
    const protocol = session.protocol || 'SSH2' // Default to SSH2 for backward compatibility
    
    if (protocol === 'LocalTerminal') {
      // Create local terminal
      if (window.createLocalShell) {
        window.createLocalShell()
      } else {
        console.warn('createLocalShell function not available on window object')
      }
    } else if (protocol === 'SSH2' || protocol === 'Telnet') {
      // Create remote terminal (SSH2 or Telnet)
      const connectionParams = {
        protocol: protocol,
        host: session.host,
        username: session.username,
        port: typeof session.port === 'string' ? parseInt(session.port, 10) : (session.port || (protocol === 'SSH2' ? 22 : 23))
      }

      // Create remote terminal using the global function exposed by TerminalTabs
      if (window.createRemoteTerminal) {
        window.createRemoteTerminal(connectionParams)
      } else {
        console.warn('createRemoteTerminal function not available on window object')
        // Fallback: try to call it after a short delay
        setTimeout(() => {
          if (window.createRemoteTerminal) {
            window.createRemoteTerminal(connectionParams)
          } else {
            console.error('createRemoteTerminal function still not available')
          }
        }, 100)
      }
    } else {
      console.error('Unknown protocol:', protocol)
    }
  }

  return {
    handleRenameOpen,
    handleRenameClose,
    handleSessionWizadClick,
    handleSessionWizadClose,
    handleQuickConnectClose,
    handleQuickConnectClick,
    handleDuplicateClick,
    handleDuplicateClose,
    handleDeleteClose,
    handleSessionContextOpen,
    handleSessionContextClose,
    handleSessionContextOpenFile,
    handleSessionContextCloseFile,
    handleSessionsClick,
    handleRefreshSessions,
    handleDeleteOpen,
    handleSessionsRightClick,
    handleSessionsRightClickFile,
    handleSessionDoubleClick,
    handleToggleExpanded
  }
}

export default useSessionHandlers
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
    
    // Extract SSH connection parameters from session
    const sshParams = {
      host: session.host,
      username: session.username,
      port: typeof session.port === 'string' ? parseInt(session.port, 10) : (session.port || 22),
      protocol: session.protocol
    }

    // Create SSH terminal using the global function exposed by TerminalTabs
    if (window.createSSHTerminal) {
      window.createSSHTerminal(sshParams)
    } else {
      console.warn('createSSHTerminal function not available on window object')
      // Fallback: try to call it after a short delay
      setTimeout(() => {
        if (window.createSSHTerminal) {
          window.createSSHTerminal(sshParams)
        } else {
          console.error('createSSHTerminal function still not available')
        }
      }, 100)
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
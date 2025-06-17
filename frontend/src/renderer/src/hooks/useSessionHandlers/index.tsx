// hooks/useSessionHandlers.ts - Fix the 'any' type
import { AppDispatch } from '@renderer/store'
import { Session } from '@renderer/type/sshSession' // ✅ Import Session type
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
    console.log('🎯 Session double clicked:',session)
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
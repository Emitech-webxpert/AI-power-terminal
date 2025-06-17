import React, { useEffect, useRef } from 'react'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import {
  SessionWizadModal,
  SessionContextModal,
  SessionContextFileModal,
  DeleteFileFolderModal,
  QuickConnectModal,
  DuplicateModal,
  RenameModal
} from '@modals/index'
import { click, file, folder, clicklight } from '@renderer/assets'
import { WorkflowManagerProps } from '@renderer/type'
import SessionToolbar from '@renderer/components/sessionToolbar'
import { useAppSelector, useAppDispatch } from '@renderer/store/hooks'
import { selectIsDark } from '@renderer/store/slices/themeSlice'
import {
  selectIsSessionsExpanded,
  selectIsSessionsExpandedInner,
  selectIsSessionWizadOpen,
  selectIsQuickConnectOpen,
  selectIsDuplicateOpen,
  selectIsSessionContextOpen,
  selectIsSessionContextOpenFile,
  selectSelectedFileId,
  selectIsRenameOpen,
  selectIsDeleteOpen,
  selectDeleteTitle,
  // NEW SELECTORS for API data
  selectSessions,
  selectSessionsLoading,
  selectSessionsError,
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
  closeDelete,
  clearError
} from '@renderer/store/slices/sessionList'
import { fetchSessions } from '@renderer/store/slices/sessionThunks'

const SessionManager: React.FC<WorkflowManagerProps> = ({ toggleWorkflowVisibility, onContextMenuToggle, sidebarOnRight }) => {
  const sessionModalRef = useRef<HTMLDivElement>(null)
  const sessionFileModalRef = useRef<HTMLDivElement>(null)

  const dispatch = useAppDispatch()
  const isDark = useAppSelector(selectIsDark)
  const isSessionsExpanded = useAppSelector(selectIsSessionsExpanded)
  const isSessionsExpandedInner = useAppSelector(selectIsSessionsExpandedInner)
  const isSessionWizadOpen = useAppSelector(selectIsSessionWizadOpen)
  const isQuickConnectOpen = useAppSelector(selectIsQuickConnectOpen)
  const isDuplicateOpen = useAppSelector(selectIsDuplicateOpen)
  const isSessionContextOpen = useAppSelector(selectIsSessionContextOpen)
  const isSessionContextOpenFile = useAppSelector(selectIsSessionContextOpenFile)
  const selectedFileId = useAppSelector(selectSelectedFileId)
  const isRenameOpen = useAppSelector(selectIsRenameOpen)
  const isDeleteOpen = useAppSelector(selectIsDeleteOpen)
  const deleteTitle = useAppSelector(selectDeleteTitle)

  // NEW SELECTORS for API data
  const sessions = useAppSelector(selectSessions)
  const sessionsLoading = useAppSelector(selectSessionsLoading)
  const sessionsError = useAppSelector(selectSessionsError)
  useEffect(() => {
    dispatch(fetchSessions())
  }, [dispatch])

  useEffect(() => {
    if (onContextMenuToggle) {
      onContextMenuToggle(isSessionContextOpen || isSessionContextOpenFile);
    }
  }, [isSessionContextOpen, isSessionContextOpenFile, onContextMenuToggle]);

  // Clear error when component unmounts or when needed
  useEffect(() => {
    return () => {
      if (sessionsError) {
        dispatch(clearError())
      }
    }
  }, [sessionsError, dispatch])

  const handleRenameOpen = () => {
    dispatch(openRename())
  }

  const handleRenameClose = () => {
    dispatch(closeRename())
  }

  const handleSessionWizadClick = () => {
    dispatch(openSessionWizard())
  }

  const handleSessionWizadClose = () => {
    dispatch(closeSessionWizard())
  }

  const handleQuickConnectClose = () => {
    dispatch(closeQuickConnect())
  }

  const handleSessionContextOpen = () => {
    dispatch(openSessionContext())
  }

  const handleSessionContextClose = () => {
    dispatch(closeSessionContext())
  }

  const handleSessionContextOpenFile = (id: string) => {
    dispatch(openSessionContextFile(id))
  }

  const handleSessionContextCloseFile = () => {
    dispatch(closeSessionContextFile())
  }

  const handleDeleteOpen = (title: string) => {
    dispatch(openDelete(title))
  }

  const handleQuickConnectClick = () => {
    dispatch(openQuickConnect())
  }

  const handleDuplicateClick = () => {
    dispatch(openDuplicate())
  }

  const handleDuplicateClose = () => {
    dispatch(closeDuplicate())
  }

  const handleDeleteClose = () => {
    dispatch(closeDelete())
  }

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

  const handleSessionsClick = () => {
    dispatch(toggleSessionsExpandedInner())
  }

  const handleRefreshSessions = () => {
    dispatch(fetchSessions())
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (sessionModalRef.current && !sessionModalRef.current.contains(target)) {
        dispatch(closeSessionContext())
      }
      if (sessionFileModalRef.current && !sessionFileModalRef.current.contains(target)) {
        dispatch(closeSessionContextFile())
      }
    }
    if (isSessionContextOpen || isSessionContextOpenFile) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSessionContextOpen, isSessionContextOpenFile, dispatch])

  return (
    <>
      <div className="border rounded border-gray-light bg-dark pb-2 relative">
        <div
          className={`absolute ${!sidebarOnRight ? '-right-5' : 'left-11-minus rotate-180'} cursor-pointer ${isSessionsExpanded ? 'top-50' : 'top-0 hidden'}`}
          onClick={toggleWorkflowVisibility}>
          {isDark ? <img src={click} className="" alt="click" /> : <img src={clicklight} className="" alt="click" />}
        </div>
        <div
          className="section-header flex items-center justify-between p-3 cursor-pointer"
          onClick={() => dispatch(toggleSessionsExpanded())}>
          <span className="text-sm font-medium text-white">Session Manager</span>
          {isSessionsExpanded ? (
            <IoMdArrowDropup size={22} className="text-white" />
          ) : (
            <IoMdArrowDropdown size={22} className="text-white" />
          )}
        </div>

        {isSessionsExpanded && (
          <div className="pb-3">
            <SessionToolbar onSessionWizadClick={handleSessionWizadClick} />
            <div className="px-3 pb-5">
              <div
                className="flex items-center mb-1 cursor-pointer gap-1 border-t border-gray-light pt-2 relative"
                onClick={handleSessionsClick}
                onContextMenu={handleSessionsRightClick}>
                {isSessionsExpandedInner ? (
                  <IoMdArrowDropup size={22} className="text-white" />
                ) : (
                  <IoMdArrowDropdown size={22} className="text-white" />
                )}
                <img src={folder} className="" alt="folder" title="folder" />
                <span className="text-xs font-medium text-white">
                  Sessions {sessionsLoading && '(Loading...)'}
                </span>
                {isSessionContextOpen && (
                  <div ref={sessionModalRef}>
                    <SessionContextModal
                      isOpen={isSessionContextOpen}
                      onClose={handleSessionContextClose}
                      onDeleteOpen={() => handleDeleteOpen('Delete this folder?')}
                      onOpenQuickConnect={handleQuickConnectClick}
                      onOpenSessionWizad={handleSessionWizadClick}
                      onRenameOpen={handleRenameOpen}
                    />
                  </div>
                )}
              </div>

              {/* Error Display */}
              {sessionsError && (
                <div className="ml-6 mb-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
                  Error: {sessionsError}
                  <button
                    onClick={handleRefreshSessions}
                    className="ml-2 underline hover:no-underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              {isSessionsExpandedInner && (
                <div className="ml-6 space-y-1 max-h-64 h-auto min-h-8 overflow-auto overflow-x-visible">
                  {sessionsLoading ? (
                    <div className="text-xs text-light">Loading sessions...</div>
                  ) : sessions?.length === 0 ? (
                    <div className="text-xs text-light">
                      {sessionsError ? 'Failed to load sessions' : 'No sessions found'}
                    </div>
                  ) : (
                    sessions.map((session, index) => (
                      <div
                        key={session?.id || `session-${index}`}
                        className="file-item flex items-center cursor-pointer px-2 py-1 rounded relative"
                        onContextMenu={(e) => session?.id && handleSessionsRightClickFile(e, session.id)}>
                        <div className="mr-1">
                          <img src={file} className="" title="file" alt="file" />
                        </div>
                        <span className="text-xs text-light truncate">{session?.sessionName || 'Unknown Session'}</span>
                        {selectedFileId === session?.id && isSessionContextOpenFile && (
                          <div ref={sessionFileModalRef}>
                            <SessionContextFileModal
                              isOpen={isSessionContextOpenFile}
                              onClose={handleSessionContextCloseFile}
                              onDeleteOpen={() => handleDeleteOpen('Delete this file?')}
                              onDuplicate={handleDuplicateClick}
                              onRenameOpen={handleRenameOpen}
                            />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <SessionWizadModal isOpen={isSessionWizadOpen} onClose={handleSessionWizadClose} />
      <DeleteFileFolderModal
        isOpen={isDeleteOpen}
        onClose={handleDeleteClose}
        title={deleteTitle}
      />
      <QuickConnectModal isOpen={isQuickConnectOpen} onClose={handleQuickConnectClose} />
      <DuplicateModal isOpen={isDuplicateOpen} onClose={handleDuplicateClose} />
      <RenameModal isOpen={isRenameOpen} onClose={handleRenameClose} />
    </>
  )
}

export default SessionManager
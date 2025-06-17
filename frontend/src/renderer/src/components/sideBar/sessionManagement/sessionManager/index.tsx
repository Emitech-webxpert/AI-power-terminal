// components/sidebar/sessionManagement/sessionManager/index.tsx
import React, { useEffect, useRef } from 'react'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import {
  SessionWizadModal,
  DeleteFileFolderModal,
  QuickConnectModal,
  DuplicateModal,
  RenameModal
} from '@modals/index'
import { click, clicklight } from '@renderer/assets'
import { WorkflowManagerProps } from '@renderer/type'
import SessionToolbar from '@renderer/components/sessionToolbar'
import SessionHeader from '../SessionHeader'
import SessionList from '../SessionList'
import { useAppSelector } from '@renderer/store/hooks'
import { selectIsDark } from '@renderer/store/slices/themeSlice'
import { useSessionManager } from '@renderer/hooks/index'
import { useSessionHandler } from '@renderer/hooks/index'

const SessionManager: React.FC<WorkflowManagerProps> = ({ 
  toggleWorkflowVisibility, 
  onContextMenuToggle, 
  sidebarOnRight 
}) => {
  const sessionModalRef = useRef<HTMLDivElement>(null)
  const sessionFileModalRef = useRef<HTMLDivElement>(null)

  const isDark = useAppSelector(selectIsDark)
  const sessionState = useSessionManager(onContextMenuToggle)
  const handlers = useSessionHandler(sessionState.dispatch)

  // Handle click outside for context menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (sessionModalRef.current && !sessionModalRef.current.contains(target) && sessionState.isSessionContextOpen) {
        handlers.handleSessionContextClose()
      }
      if (sessionFileModalRef.current && !sessionFileModalRef.current.contains(target) && sessionState.isSessionContextOpenFile) {
        handlers.handleSessionContextCloseFile()
      }
    }

    if (sessionState.isSessionContextOpen || sessionState.isSessionContextOpenFile) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [sessionState.isSessionContextOpen, sessionState.isSessionContextOpenFile, handlers])

  return (
    <>
      <div className="border rounded border-gray-light bg-dark pb-2 relative">
        {/* Toggle Button */}
        <div
          className={`absolute ${!sidebarOnRight ? '-right-5' : 'left-11-minus rotate-180'} cursor-pointer ${sessionState.isSessionsExpanded ? 'top-50' : 'top-0 hidden'}`}
          onClick={toggleWorkflowVisibility}
        >
          {isDark ? <img src={click} alt="click" /> : <img src={clicklight} alt="click" />}
        </div>

        {/* Main Header */}
        <div
          className="section-header flex items-center justify-between p-3 cursor-pointer w-52"
          onClick={handlers.handleToggleExpanded}
        >
          <span className="text-sm font-medium text-white">Session Manager</span>
          {sessionState.isSessionsExpanded ? (
            <IoMdArrowDropup size={22} className="text-white" />
          ) : (
            <IoMdArrowDropdown size={22} className="text-white" />
          )}
        </div>

        {/* Expanded Content */}
        {sessionState.isSessionsExpanded && (
          <div className="pb-3">
            <SessionToolbar onSessionWizadClick={handlers.handleSessionWizadClick} />
            
            <div className="px-3 pb-5">
              {/* Sessions Header */}
              <SessionHeader
                isSessionsExpandedInner={sessionState.isSessionsExpandedInner}
                sessionsLoading={sessionState.sessionsLoading}
                isSessionContextOpen={sessionState.isSessionContextOpen}
                onSessionsClick={handlers.handleSessionsClick}
                onSessionsRightClick={handlers.handleSessionsRightClick}
                onSessionContextClose={handlers.handleSessionContextClose}
                onDeleteOpen={handlers.handleDeleteOpen}
                onQuickConnectClick={handlers.handleQuickConnectClick}
                onSessionWizardClick={handlers.handleSessionWizadClick}
                onRenameOpen={handlers.handleRenameOpen}
              />

              {/* Error Display */}
              {sessionState.sessionsError && (
                <div className="ml-6 mb-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
                  Error: {sessionState.sessionsError}
                  <button onClick={handlers.handleRefreshSessions} className="ml-2 underline hover:no-underline">
                    Retry
                  </button>
                </div>
              )}

              {/* Sessions List */}
              <SessionList
                sessions={sessionState.sessions}
                sessionsLoading={sessionState.sessionsLoading}
                sessionsError={sessionState.sessionsError}
                isSessionsExpandedInner={sessionState.isSessionsExpandedInner}
                selectedFileId={sessionState.selectedFileId}
                isSessionContextOpenFile={sessionState.isSessionContextOpenFile}
                onSessionRightClick={handlers.handleSessionsRightClickFile}
                onSessionDoubleClick={handlers.handleSessionDoubleClick}
                onSessionContextCloseFile={handlers.handleSessionContextCloseFile}
                onDeleteOpen={handlers.handleDeleteOpen}
                onDuplicate={handlers.handleDuplicateClick}
                onRenameOpen={handlers.handleRenameOpen}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <SessionWizadModal 
        isOpen={sessionState.isSessionWizadOpen} 
        onClose={handlers.handleSessionWizadClose} 
      />
      <DeleteFileFolderModal
        isOpen={sessionState.isDeleteOpen}
        onClose={handlers.handleDeleteClose}
        title={sessionState.deleteTitle}
      />
      <QuickConnectModal 
        isOpen={sessionState.isQuickConnectOpen} 
        onClose={handlers.handleQuickConnectClose} 
      />
      <DuplicateModal 
        isOpen={sessionState.isDuplicateOpen} 
        onClose={handlers.handleDuplicateClose} 
      />
      <RenameModal 
        isOpen={sessionState.isRenameOpen} 
        onClose={handlers.handleRenameClose} 
      />
    </>
  )
}

export default SessionManager
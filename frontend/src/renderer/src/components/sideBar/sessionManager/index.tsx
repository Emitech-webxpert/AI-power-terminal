import React, { useEffect, useRef, useState } from 'react'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import { sessions } from '@renderer/constant'
import {
  SessionWizadModal,
  SessionContextModal,
  SessionContextFileModal,
  DeleteFileFolderModal,
  QuickConnectModal,
  DuplicateModal,
  RenameModal
} from '@modals/index'
import {click, file, folder, clicklight} from '@renderer/assets'
import { WorkflowManagerProps } from '@renderer/type'
import SessionToolbar from '@renderer/components/sessionToolbar'
import { useAppSelector } from '@renderer/store/hooks'
import { selectIsDark } from '@renderer/store/slices/themeSlice'

const SessionManager: React.FC<WorkflowManagerProps> = ({ toggleWorkflowVisibility, onContextMenuToggle, sidebarOnRight }) => {
  const [isSessionsExpanded, setIsSessionsExpanded] = useState(true)
  const [isSessionsExpandedInner, setIsSessionsExpandedInner] = useState(true)
  const [isSessionWizadOpen, setIsSessionWizadOpen] = useState(false)
  const [isQuickConnectOpen, setIsQuickConnectOpen] = useState(false)
  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false)
  const [isSessionContextOpen, setIsSessionContextOpen] = useState(false)
  const [isSessionContextOpenFile, setIsSessionContextOpenFile] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteTitle, setDeleteTitle] = useState('')
  const sessionModalRef = useRef<HTMLDivElement>(null)
  const sessionFileModalRef = useRef<HTMLDivElement>(null)

  const isDark = useAppSelector(selectIsDark)

  useEffect(() => {
    if (onContextMenuToggle) {
      onContextMenuToggle(isSessionContextOpen || isSessionContextOpenFile);
    }
  }, [isSessionContextOpen, isSessionContextOpenFile, onContextMenuToggle]);


  const handleRenameOpen = () => {
    setIsRenameOpen(true)
    setIsSessionContextOpen(false)
    setIsSessionContextOpenFile(false)
  }

  const handleRenameClose = () => {
    setIsRenameOpen(false)
  }

  const handleSessionWizadClick = () => {
    setIsSessionWizadOpen(true)
    setIsSessionContextOpen(false)
  }

  const handleSessionWizadClose = () => {
    setIsSessionWizadOpen(false)
  }

  const handleQuickConnectClose = () => {
    setIsQuickConnectOpen(false)
  }

  const handleSessionContextOpen = () => {
    setIsSessionContextOpen(true)
  }

  const handleSessionContextClose = () => {
    setIsSessionContextOpen(false)
  }

  const handleSessionContextOpenFile = (id: string) => {
    setIsSessionContextOpenFile(true)
    setSelectedFileId(id)
  }

  const handleSessionContextCloseFile = () => {
    setIsSessionContextOpenFile(false)
    setSelectedFileId(null)
  }

  const handleDeleteOpen = (title: string) => {
    setDeleteTitle(title)
    setIsDeleteOpen(true)
    setIsSessionContextOpen(false)
    setIsSessionContextOpenFile(false)
  }
  const handleQuickConnectClick = () => {
    setIsQuickConnectOpen(true)
    setIsSessionContextOpen(false)
  }

  const handleDuplicateClick = () => {
    setIsDuplicateOpen(true)
    setIsSessionContextOpenFile(false)
  }

  const handleDuplicateClose = () => {
    setIsDuplicateOpen(false)
  }

  const handleDeleteClose = () => {
    setIsDeleteOpen(false)
    setDeleteTitle('')
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
    setIsSessionsExpandedInner(!isSessionsExpandedInner)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (sessionModalRef.current && !sessionModalRef.current.contains(target)) {
        setIsSessionContextOpen(false)
      }
      if (sessionFileModalRef.current && !sessionFileModalRef.current.contains(target)) {
        setIsSessionContextOpenFile(false)
        setSelectedFileId(null)
      }
    }
    if (isSessionContextOpen || isSessionContextOpenFile) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSessionContextOpen, isSessionContextOpenFile])

  return (
    <>
      <div className="border rounded border-gray-light bg-dark pb-2 relative">
        <div
          className={`absolute ${!sidebarOnRight ? '-right-5' : 'left-11-minus rotate-180'} cursor-pointer ${isSessionsExpanded ? 'top-50' : 'top-0 hidden'}`}
          onClick={toggleWorkflowVisibility}>
         {isDark ?  <img src={click} className="" alt="click" /> :  <img src={clicklight} className="" alt="click" /> }
        </div>
        <div
          className="section-header flex items-center justify-between p-3 cursor-pointer w-52"
          onClick={() => setIsSessionsExpanded(!isSessionsExpanded)}>
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
                <span className="text-xs font-medium text-white">Sessions</span>
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

              {isSessionsExpandedInner && (
                <div className="ml-6 space-y-1 max-h-64 h-auto min-h-8 overflow-auto overflow-x-visible">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="file-item flex items-center cursor-pointer px-2 py-1 rounded relative"
                      onContextMenu={(e) => handleSessionsRightClickFile(e, session.id)}>
                      <div className="mr-1">
                        <img src={file} className="" title="file" alt="file" />
                      </div>
                      <span className="text-xs text-light truncate">{session.name}</span>
                      {selectedFileId === session.id && isSessionContextOpenFile && (
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
                  ))}
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

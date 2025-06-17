import React, { useEffect, useRef, useState } from 'react'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import { workflows } from '@renderer/constant'
import { click, clicklight, file, folder } from '@renderer/assets'
import { WorkflowManagerProps } from '@renderer/type'
import {
  DeleteFileFolderModal,
  RenameModal,
  WorkFlowContextFileModal,
  WorkFlowContextModal
} from '@renderer/components/modals'
import { useAppSelector } from '@renderer/store/hooks'
import { selectIsDark } from '@renderer/store/slices/themeSlice'

const WorkflowManager: React.FC<WorkflowManagerProps> = ({ toggleWorkflowVisibility, sidebarOnRight }) => {
  const [isWorkflowExpanded, setIsWorkflowExpanded] = useState(true)
  const [isWorkflowExpandedInner, setIsWorkflowExpandedInner] = useState(true)
  const [isSessionContextOpen, setIsSessionContextOpen] = useState(false)
  const [isSessionContextOpenFile, setIsSessionContextOpenFile] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const [deleteTitle, setDeleteTitle] = useState('')
  const sessionModalRef = useRef<HTMLDivElement>(null)
  const sessionFileModalRef = useRef<HTMLDivElement>(null)
  const isDark = useAppSelector(selectIsDark)
  const handleDeleteOpen = (title: string) => {
    setDeleteTitle(title)
    setIsDeleteOpen(true)
    setIsSessionContextOpen(false)
    setIsSessionContextOpenFile(false)
  }

  const handleRenameOpen = () => {
    setIsRenameOpen(true)
    setIsSessionContextOpen(false)
    setIsSessionContextOpenFile(false)
  }

  const handleDeleteClose = () => {
    setIsDeleteOpen(false)
    setDeleteTitle('')
  }

  const handleRenameClose = () => {
    setIsRenameOpen(false)
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
    <div className="bg-info flex-1 bg-dark border rounded border-gray-light pb-0 relative">
      <div className={`absolute  ${!sidebarOnRight ? '-right-5' : 'left-11-minus rotate-180'} cursor-pointer ${isWorkflowExpanded ? 'top-50' : 'top-0 hidden'}`}
        onClick={toggleWorkflowVisibility} >
        {isDark ?  <img src={click} className="" alt="click" /> :  <img src={clicklight} className="" alt="click" /> }
      </div>
      <div
        className="section-header flex items-center justify-between p-3 cursor-pointer w-52"
        onClick={() => setIsWorkflowExpanded(!isWorkflowExpanded)}>
        <span className="text-sm font-medium text-white">Workflow</span>
        {isWorkflowExpanded ? (
          <IoMdArrowDropup size={22} className="text-white" />
        ) : (
          <IoMdArrowDropdown size={22} className="text-white" />
        )}
      </div>

      {isWorkflowExpanded && (
        <div className="pb-3">
          <div className="px-3 mb-3">
            <div className="relative">
              <input
                type="search"
                className="navbar-text text-xs text-white button-dark-bg rounded border-input border w-full h-7 p-2"
                placeholder="Search..."
              />
            </div>
          </div>
          <div className="px-3 pb-5">
            <div
              className="flex items-center mb-1 cursor-pointer gap-1 border-t border-gray-light pt-2 relative"
              onClick={() => setIsWorkflowExpandedInner(!isWorkflowExpandedInner)}
              onContextMenu={handleSessionsRightClick}
            >
              {isWorkflowExpandedInner ? (
                <IoMdArrowDropup size={22} className="text-white" />
              ) : (
                <IoMdArrowDropdown size={22} className="text-white" />
              )}
              <img src={folder} className="" alt="folder" title="folder" />
              <span className="text-xs font-medium text-white">New Folder</span>
              {isSessionContextOpen && (
                <div ref={sessionModalRef}>
                  <WorkFlowContextModal
                    isOpen={isSessionContextOpen}
                    onClose={handleSessionContextClose}
                    onDeleteOpen={() => handleDeleteOpen('Delete this folder?')}
                    onRenameOpen={handleRenameOpen}
                  />
                </div>
              )}
            </div>

            {isWorkflowExpandedInner && (
              <div className="ml-6 space-y-1 max-h-64 h-auto min-h-8 overflow-auto overflow-x-visible">
                {workflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className="file-item flex items-center cursor-pointer px-2 py-1 rounded relative"
                    onContextMenu={(e) => handleSessionsRightClickFile(e, workflow.id)}>
                    <div className="mr-1">
                      <img src={file} className="" title="file" alt="file" />
                    </div>
                    <span className="text-xs text-light truncate">{workflow.name}</span>
                    {selectedFileId === workflow.id && isSessionContextOpenFile && (
                      <div ref={sessionFileModalRef}>
                        <WorkFlowContextFileModal
                          isOpen={isSessionContextOpenFile}
                          onDeleteOpen={() => handleDeleteOpen('Delete this file?')}
                          onClose={handleSessionContextCloseFile}
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

      <DeleteFileFolderModal isOpen={isDeleteOpen} onClose={handleDeleteClose} title={deleteTitle} />
      <RenameModal isOpen={isRenameOpen} onClose={handleRenameClose} />
    </div>
  )
}

export default WorkflowManager
import {
  CollapseIcon,
  ConnectIcon,
  CopyIcon,
  CutIcon,
  DeleteIcon,
  ExpandIcon,
  FolderIcon,
  MailIcon,
  NewSessionIcon,
  PasteIcon,
  RenameIcon,
  TabIcon,
  WindowIcon
} from '@renderer/assets/icons/svg'
import { SessionContextModalProps } from '@renderer/type'
import React from 'react'

const SessionContextModal: React.FC<SessionContextModalProps> = ({
  isOpen,
  onClose,
  onDeleteOpen,
  onOpenQuickConnect,
  onOpenSessionWizad,
  onRenameOpen
}) => {
  if (!isOpen) return null

  const handleRenameClick = () => {
    if (onRenameOpen) {
      onRenameOpen()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleDeleteClick = () => {
    if (onDeleteOpen) {
      onDeleteOpen() // This will call the parent's handleDeleteOpen
    }
  }

  const handleQuickConnectClick = () => {
    if (onOpenQuickConnect) {
      onOpenQuickConnect()
    }
  }

  const handleSessionWizadClick = () => {
    if (onOpenSessionWizad) {
      onOpenSessionWizad()
    }
  }

  const handleNewSession = () => {
    console.log('Create new session')
    onClose()
  }

  return (
    <div
      className="absolute left-10 top-3 text-white rounded-md shadow-lg bg-dark border border-gray-light z-10"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="shadow-lg w-68 icon-light" onClick={(e) => e.stopPropagation()}>
        {/* Modal Content */}
        <div className="p-1">
          <button
            onClick={handleNewSession}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <MailIcon />
            Connect in Tab
          </button>

          <button
            onClick={handleNewSession}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <WindowIcon />
            Connect in a New Window
          </button>

          <button
            onClick={handleNewSession}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <TabIcon />
            Connect in Tab View in the New Tab Group
          </button>

          <button
            onClick={handleQuickConnectClick}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <ConnectIcon />
            Quick Connect
          </button>

          <button
            onClick={handleSessionWizadClick}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <NewSessionIcon />
            Add New Session
          </button>

          <button
            onClick={handleNewSession}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <FolderIcon />
            New Folder
          </button>

          <span className="w-full h-1 bg-dark border-t border-input flex mt-1 pt-1"></span>

          <button
            onClick={handleNewSession}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <CopyIcon />
            Copy
          </button>

          <button
            onClick={handleNewSession}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <PasteIcon />
            Paste
          </button>

          <button
            onClick={handleNewSession}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <CutIcon />
            Cut
          </button>

          <button
            onClick={handleRenameClick}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <RenameIcon />
            Rename
          </button>

          <button
            onClick={handleDeleteClick}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <DeleteIcon />
            Delete
          </button>

          <span className="w-full h-1 bg-dark border-t border-input flex mt-1 pt-1"></span>

          <button
            onClick={handleNewSession}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <ExpandIcon />
            Expand All Folder
          </button>

          <button
            onClick={handleNewSession}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <CollapseIcon />
            Collapse All Folder
          </button>
        </div>
      </div>
    </div>
  )
}

export default SessionContextModal

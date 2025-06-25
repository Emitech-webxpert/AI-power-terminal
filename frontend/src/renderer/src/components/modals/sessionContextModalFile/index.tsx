import React from 'react'
import {
  CopyIcon,
  CutIcon,
  DeleteIcon,
  DuplicateIcon,
  MailIcon,
  PasteIcon,
  RenameIcon,
  TabIcon,
  WindowIcon
} from '@renderer/assets/icons/svg'
import {SessionContextFileModalProps} from '@renderer/type'

const SessionContextFileModal: React.FC<SessionContextFileModalProps> = ({
  isOpen,
  onClose,
  onDeleteOpen,
  onDuplicate,
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

  const handleDuplicateClick = () => {
    if (onDuplicate) {
      onDuplicate() // This will call the parent's handleDuplicateOpen
    }
  }

  const handleAction = (action: string) => {
    console.log(`${action} file`)
    onClose()
  }

  return (
    <div
      className="absolute left-10 top-3 text-white rounded-md shadow-lg bg-dark border border-gray-light z-10"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="shadow-lg w-68 icon-light">
        <div className="p-1">
          <button
            onClick={() => handleAction('Connect in Tab')}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <MailIcon />
            Connect in Tab
          </button>
          <button
            onClick={() => handleAction('Connect in a New Window')}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <WindowIcon />
            Connect in a New Window
          </button>
          <button
            onClick={() => handleAction('Connect in Tab View in the New Tab Group')}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <TabIcon />
            Connect in Tab View in the New Tab Group
          </button>
          <span className="w-full h-1 bg-dark border-t border-input flex mt-1 pt-1"></span>
          <button
            onClick={() => handleDuplicateClick()}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <DuplicateIcon />
            Duplicate
          </button>
          <button
            onClick={() => handleAction('Copy')}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <CopyIcon />
            Copy
          </button>
          <button
            onClick={() => handleAction('Paste')}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <PasteIcon />
            Paste
          </button>
          <button
            onClick={() => handleAction('Cut')}
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
        </div>
      </div>
    </div>
  )
}

export default SessionContextFileModal
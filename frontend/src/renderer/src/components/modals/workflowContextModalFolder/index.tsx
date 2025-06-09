import {
  CopyIcon,
  CutIcon,
  DeleteIcon,
  FolderIcon,
  PasteIcon,
  RenameIcon
} from '@renderer/assets/icons/svg'
import { WorkFlowContextModalProps } from '@renderer/type'
import React from 'react'

const WorkFlowContextModal: React.FC<WorkFlowContextModalProps> = ({
  isOpen,
  onClose,
  onDeleteOpen,
  onRenameOpen
}) => {
  if (!isOpen) return null

  const handleRenameClick = () => {
    if (onRenameOpen) {
      onRenameOpen()
    }
  }

  const handleDeleteClick = () => {
    if (onDeleteOpen) {
      onDeleteOpen() // This will call the parent's handleDeleteOpen
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

  const handleNewSession = () => {
    console.log('Create new session')
    onClose()
  }

  return (
    <div
      className="absolute left-0 top-5 text-white rounded-md shadow-lg bg-dark border border-gray-light z-10"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className=" shadow-lg w-56 icon-light" onClick={(e) => e.stopPropagation()}>
        {/* Modal Content */}
        <div className="p-1 h-28 overflow-auto">
          <button
            onClick={handleNewSession}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <FolderIcon />
            New Folder
          </button>
          <button
            onClick={handleNewSession}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <CutIcon />
            Cut
          </button>
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

export default WorkFlowContextModal

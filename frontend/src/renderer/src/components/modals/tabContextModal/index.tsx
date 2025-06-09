import {
  CloseTab,
  Disconnect,
  DuplicateIcon,
  LogSession,
  Reconnect,
  RenameIcon,
  SaveSession,
  WindowIcon
} from '@renderer/assets/icons/svg'
import { TabContextModalProps } from '@renderer/type'
import React from 'react'
 
const TabContextModal: React.FC<TabContextModalProps> = ({
  isOpen,
  onClose,
  onRenameOpen,
  onNameOpen,
  onDisconnectOpen,
}) => {
  if (!isOpen) return null
 
  const handleRenameClick = () => {
    if (onRenameOpen) {
      onRenameOpen()
    }
  }
 
  const handleNameClick = () => {
    if (onNameOpen) {
      onNameOpen()
    }
  }

  const handleDisconnectClick = () => {
    if (onDisconnectOpen) {
      onDisconnectOpen()
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
      className="text-white rounded-md shadow-lg bg-dark border border-gray-light"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="shadow-lg w-48 icon-light" onClick={(e) => e.stopPropagation()}>
        {/* Modal Content */}
        <div className="p-1">
 
        <button
            onClick={handleRenameClick}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <RenameIcon />
            Rename
          </button>
 
          <button
            onClick={handleNewSession}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <Reconnect />
            Reconnect
          </button>
 
          <button
            onClick={handleDisconnectClick}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <Disconnect />
            Disconnect
          </button>
 
          <button
            onClick={handleNewSession}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <LogSession />
            Log Session
          </button>
 
          <button
            onClick={handleNameClick}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <SaveSession />
            Save Session
          </button>
 
          <button
            onClick={handleNewSession}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <CloseTab />
            Close All Tabs
          </button>
 
          <button
            onClick={handleNewSession}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
            <DuplicateIcon />
            Clone Sessions
          </button>
 
          <button
            onClick={handleNewSession}
            className="cursor-pointer w-full rounded-md button-hover text-left px-1 py-1-5 text-xs text-white bg-dark border-0 transition-colors flex items-center gap-1"
          >
           <WindowIcon />
            Clone in New Window
          </button>
        </div>
      </div>
    </div>
  )
}
 
export default TabContextModal
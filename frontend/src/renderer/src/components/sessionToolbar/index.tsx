import React from 'react'
import {
  PlugsConnected,
  iconoir_window,
  XCircle,
  Scissors,
  crop,
  paste,
  FolderPlus,
  FileX
} from '@renderer/assets'
import { SessionToolbarProps } from '@renderer/type'

const SessionToolbar: React.FC<SessionToolbarProps> = ({ onSessionWizadClick }) => {
  return (
    <>

      <div className="px-3 mb-3">
        <div className="relative">
          <input
            type="search"
            className="navbar-text text-xs text-white button-dark-bg rounded border-input border w-full h-7 p-2"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="flex items-center gap-1 px-2 mb-2 justify-between">
        <button className="toolbar-button bg-transparent border-0 cursor-pointer p-0" title="PlugsConnected">
          <img src={PlugsConnected} alt="PlugsConnected" />
        </button>
        <button className="toolbar-button bg-transparent border-0 cursor-pointer p-0" title="iconoir_window">
          <img src={iconoir_window} alt="iconoir_window" />
        </button>
        <button
          className="toolbar-button bg-transparent border-0 cursor-pointer p-0"
          title="XCircle"
          onClick={onSessionWizadClick}
        >
          <img src={XCircle} alt="XCircle" />
        </button>
        <button className="toolbar-button bg-transparent border-0 cursor-pointer p-0" title="Scissors">
          <img src={Scissors} alt="Scissors" />
        </button>
        <button className="toolbar-button bg-transparent border-0 cursor-pointer p-0" title="crop">
          <img src={crop} alt="crop" />
        </button>
        <button className="toolbar-button bg-transparent border-0 cursor-pointer p-0" title="paste">
          <img src={paste} alt="paste" />
        </button>
        <button className="toolbar-button bg-transparent border-0 cursor-pointer p-0" title="FolderPlus">
          <img src={FolderPlus} alt="FolderPlus" />
        </button>
        <button className="toolbar-button bg-transparent border-0 cursor-pointer p-0" title="FileX">
          <img src={FileX} className="w-6 h-6" alt="FileX" />
        </button>
      </div>
    </>
  )
}

export default SessionToolbar

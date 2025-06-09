import React, { useState } from 'react'
import { DuplicateModalProps } from '@renderer/type'

const RenameModal: React.FC<DuplicateModalProps> = ({ isOpen, onClose }) => {
  const [newName, setNewName] = useState('')
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-modal">
        <div className="bg-dark border border-gray-light rounded-lg w-96 p-4 relative text-white border-box">
          <h2 className="text-base font-medium mb-1 mt-0">Rename Name?</h2>
          <p className="text-xs text-light pb-1">Please enter new name for current connection</p>

          <div className="mb-2 mt-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 h-11 rounded bg-dark border border-gray-light text-white"
              placeholder="xyx"
            />
          </div>

          <div className="flex gap-3 items-center justify-center mt-6">
            <button
              className="flex-1 border-0 button-dark-bg w-full h-8 rounded-md text-white font-medium text-xs cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="button-bg border-0 w-full h-8 rounded-md text-white font-medium text-xs cursor-pointer"
              onClick={onClose}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default RenameModal

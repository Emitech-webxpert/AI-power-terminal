import React, { useState } from 'react'
import { X } from 'lucide-react'
import { DuplicateModalProps } from '@renderer/type'

const DuplicateModal: React.FC<DuplicateModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('cargo_manifest')
  const [hostName, setHostName] = useState('xyzhost')

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-modal">
        <div className="bg-dark border border-gray-light rounded-lg w-96 p-4 relative text-white border-box">
          <button
            onClick={onClose}
            className="absolute top-3 right-2 text-white bg-transparent cursor-pointer border-0"
          >
            <X size={16} color="#B5B5B5" />
          </button>

          <h2 className="text-xs font-medium mb-0 mt-0  border-b border-gray-light pb-5">
            Duplicate Sessions
          </h2>

          <div className="mb-2 mt-2">
            <label className="text-xs font-medium mb-1 flex">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 h-11 rounded bg-dark border border-gray-light text-white"
            />
          </div>
          <div className="mb-3 pb-1">
            <label className="text-xs font-medium mb-1 flex">Host Name</label>
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="w-full p-2 h-11 rounded bg-dark border border-gray-light text-white"
            />
          </div>

          <div className="flex gap-3 items-center justify-center mt-6">
            <button
              className="flex-1 border-0 button-dark-bg w-full h-8 rounded-lg text-white font-medium text-xs cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-gradiant border-0 w-full h-8 rounded-lg text-white font-medium text-xs cursor-pointer"
              onClick={onClose}
            >
              Okay
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default DuplicateModal

import React from 'react'
import { DisconnectModalProps } from '@renderer/type'
import { DeleteIcon } from '@renderer/assets'

const DisconnectModal: React.FC<DisconnectModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-modal">
        <div className="bg-dark border border-gray-light rounded-lg w-80 p-4 relative text-white border-box text-center">
          <img src={DeleteIcon} alt="delete" />
          <h2 className="text-sm font-medium mb-1.5 mt-1.5">
            Do you wish to disconnect from webexpert ?
          </h2>

          <div className="flex gap-3 items-center justify-center mt-6 pt-2">
            <button
              className="flex-1 border-0 button-dark-bg w-full h-8 rounded-md text-white font-medium text-xs cursor-pointer"
              onClick={onClose}
            >
              No
            </button>
            <button
              className="button-bg border-0 w-full h-8 rounded-md text-white font-medium text-xs cursor-pointer"
              onClick={onClose}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default DisconnectModal

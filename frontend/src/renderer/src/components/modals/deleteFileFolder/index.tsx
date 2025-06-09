import React from 'react'
import { DeleteIcon } from '@renderer/assets'
import { DeleteFileFolderModalProps } from '@renderer/type'


const DeleteFileFolderModal: React.FC<DeleteFileFolderModalProps> = ({ 
  isOpen, 
  onClose, 
  title = 'Delete this item?' 
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-modal">
      <div className="bg-dark border border-gray-light rounded-lg w-80 p-3 px-2 relative text-white border-box">
        <img src={DeleteIcon} alt="delete" />
        <h2 className="text-base font-medium mb-0 pb-5">{title}</h2>
        <p className="text-xs text-light leading-relaxed mt-0 pb-1">
          Are you sure you want to delete this item? This action cannot be undone.
        </p>

        <div className="flex gap-3 items-center justify-center mt-2">
          <button
            onClick={onClose}
            className="flex-1 border-0 button-dark-bg w-full h-8 rounded-lg text-white font-medium text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            className="button-bg border-0 w-full h-8 rounded-lg text-white font-medium text-xs cursor-pointer"
            onClick={onClose}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteFileFolderModal
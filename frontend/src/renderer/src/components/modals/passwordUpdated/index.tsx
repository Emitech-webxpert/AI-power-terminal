import React from 'react'
import { PasswordUpdateModalProps } from '@renderer/type'
import { Success } from '@renderer/assets'

const PasswordUpdatedModal: React.FC<PasswordUpdateModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
      <div className="bg-dark border border-gray-light rounded-lg w-80 p-3 px-2 relative text-white border-box">
        <img src={Success} alt="Lightning" />
        <h2 className="text-base font-medium mb-0 pb-5">Password Updated Successfully</h2>
        <p className="text-xs text-light leading-relaxed mt-0 pb-1">
          You’ve successfully updated your password. Please use the new password to log in.
        </p>

        <div className="flex gap-3 items-center justify-center mt-2">
          <button
            className="button-bg border-0 w-full h-8 rounded-lg text-white font-medium text-xs cursor-pointer"
            onClick={onClose}
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  )
}

export default PasswordUpdatedModal

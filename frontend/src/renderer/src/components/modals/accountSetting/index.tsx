import React from 'react'
import { X } from 'lucide-react'
import { AccountSettingsModalProps } from '@renderer/type'

const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  userName,
  userEmail,
  isOpen,
  onClose,
  onOpenResetPassword
}) => {
  if (!isOpen) return null
  console.log(userName, "SDfdsf")
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-modal">
        <div className="bg-dark border border-gray-light rounded-lg w-96 p-4 relative text-white border-box">
          <button
            onClick={onClose}
            className="absolute top-3 right-2 text-white bg-transparent cursor-pointer border-0"
          >
            <X size={16} color='#B5B5B5' />
          </button>

          <h2 className="text-xs font-medium mb-0 mt-0  border-b border-gray-light pb-5">
            Account Settings
          </h2>

          <div className="flex justify-center mb-4">
            <div className="navbar-avatar-color w-14 h-14 my-4 bg-primary text-white font-semibold text-lg flex justify-center items-center rounded-full bg-red-600 mr-3">
              {userName.slice(0,2)}
            </div>
          </div>

          <div className="border-box">
            <input
              type="text"
              defaultValue={userName}
              className="w-full p-2 h-11 rounded bg-transparent border border-gray-light text-white mb-2"
              placeholder="Samuel Harris"
            />
          </div>

          <div className="border-box">
            <input
              type="email"
              defaultValue={userEmail}
              className="w-full p-2 h-11 rounded bg-dark border border-gray-light text-white mb-2"
              placeholder="samuelharris@gmail.com"
            />
          </div>

          <h3 className="text-sm font-medium mb-2 border-t border-gray-light pt-2 mt-1">
            Reset Password
          </h3>

          <div className="border-box">
            <input
              type="password"
              placeholder="Old Password"
              className="w-full p-2 h-11 rounded bg-dark border border-gray-light text-white mb-2"
            />
          </div>

          <div className="border-box">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 h-11 rounded bg-dark border border-gray-light text-white mb-2"
            />
          </div>

          <div className="border-box">
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-2 h-11 rounded bg-dark border border-gray-light text-white mb-2"
            />
          </div>

          <button
            className="button-bg border-0 w-full h-8 rounded-lg text-white font-medium text-xs cursor-pointer "
            onClick={onOpenResetPassword}
          >
            Change Password
          </button>
        </div>
      </div>
    </>
  )
}

export default AccountSettingsModal

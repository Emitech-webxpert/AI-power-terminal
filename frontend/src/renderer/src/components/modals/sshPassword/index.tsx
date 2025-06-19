import React, { useState, useEffect } from 'react'
import { SSHPasswordModalProps } from '@renderer/type/sshSession'

const SSHPasswordModal: React.FC<SSHPasswordModalProps> = ({
  isOpen,
  hostname,
  username,
  onSubmit,
  onCancel
}) => {
  const [password, setPassword] = useState('')
  const [savePassword, setSavePassword] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setPassword('')
      setSavePassword(false)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.trim()) {
      onSubmit(password, savePassword)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-modal">
      <div className="bg-dark border border-gray-light rounded-lg w-96 p-4 relative text-white border-box" >
        {/* Header */}
        <div className="bg-gray-600 px-4 py-3 rounded-t-md flex items-center justify-between">
          <h3 className="text-white text-sm font-medium">Enter Secure Shell Password</h3>
          <button
            onClick={onCancel}
            className="text-gray-300 hover:text-white text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-white text-sm mb-4">
            {hostname} requires a password. Please enter a password now.
          </p>

          <div className="space-y-3">
            <div>
              <span className="text-white text-sm">Username: </span>
              <span className="text-gray-300 text-sm font-mono">{username}</span>
            </div>

            <div>
              <label className="block text-white text-sm mb-1">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-2 py-1 bg-white border border-gray-400 rounded text-black text-sm focus:outline-none focus:border-blue-500"
                placeholder="Enter password"
                autoFocus
              />
            </div>

          
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-600 px-4 py-3 rounded-b-md flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
          >
            <span>✕</span> Cancel
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-400 transition-colors"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e)}
            disabled={!password.trim()}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <span>✓</span> OK
          </button>
        </div>
      </div>
    </div>
  )
}

export default SSHPasswordModal
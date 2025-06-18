import React, { useState, useEffect } from 'react'

interface SSHPasswordModalProps {
  isOpen: boolean
  hostname: string
  username: string
  onSubmit: (password: string, savePassword: boolean) => void
  onCancel: () => void
}

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Enter Secure Shell Password</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-white text-sm mb-4">
              <span className="font-mono text-gray-300">{hostname}</span> requires a password. 
              Please enter a password now.
            </p>
            
            <div className="mb-3">
              <label className="block text-white text-sm mb-1">
                Username: <span className="font-mono text-gray-300">{username}</span>
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm mb-1">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 bg-gray-700 border border-orange-500 rounded text-white focus:outline-none focus:border-orange-400"
                placeholder="Enter password"
                autoFocus
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center text-white text-sm">
                <input
                  type="checkbox"
                  checked={savePassword}
                  onChange={(e) => setSavePassword(e.target.checked)}
                  className="mr-2"
                />
                Save password
              </label>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
            >
              <span className="text-red-400">✕</span> Cancel
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={!password.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-green-300">✓</span> OK
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SSHPasswordModal
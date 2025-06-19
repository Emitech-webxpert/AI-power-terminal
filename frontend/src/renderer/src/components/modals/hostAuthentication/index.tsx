import React from 'react'
import { HostKeyModalProps } from '@renderer/type/sshSession'

const HostKeyModal: React.FC<HostKeyModalProps> = ({
  isOpen,
  hostname,
  hostKey,
  onAccept,
  onCancel,
  onViewKey
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">New Host Key</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-red-500 rounded-full p-1 mt-1">
              <span className="text-white font-bold text-sm">!</span>
            </div>
            <div className="text-white text-sm">
              <p>
                The host key database does not contain an entry for the hostname{' '}
                <span className="font-semibold">{hostname}</span>, which resolved to{' '}
                <span className="font-mono text-gray-300">{hostKey}</span>, port 22.
              </p>
              <p className="mt-2">
                It is recommended you verify your server host key before accepting.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onViewKey}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
          >
            View Host Key
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-500 transition-colors"
          >
            Accept & Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default HostKeyModal
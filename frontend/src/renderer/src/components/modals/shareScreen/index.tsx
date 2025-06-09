import React from 'react'
import { X } from 'lucide-react'
import { ShareScreenModalProps } from '@renderer/type'

const ShareScreenModal: React.FC<ShareScreenModalProps> = ({ isOpen, onClose, onOpenShareCopy }) => {
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
            Share Terminal
          </h2>

          <p className="text-white text-xs font-normal leading-relaxed">
            Share your terminal session in real-time. Anyone with the link can view your terminal
            activity.
          </p>

          <div className="flex gap-3 items-start justify-start mt-2">
            <button className="w-36 bg-gradiant border-0  h-8 rounded-lg text-white font-medium text-xs cursor-pointer"
            onClick={onOpenShareCopy}>
              Start Sharing
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShareScreenModal

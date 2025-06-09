import React from 'react'
import {  Copy,  X } from 'lucide-react'
import { ShareScreenModalProps } from '@renderer/type'

const ShareCopyModal: React.FC<ShareScreenModalProps> = ({ isOpen, onClose }) => {
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

          <div className="border-box relative">
            <input
              type="text"
              className="w-full p-2 h-8 rounded bg-transparent border border-gray-light text-white mb-0"
              placeholder="$HOME/leah/.ssh/authorized/session/cvbnmuicghbd"
            />
            <span className='absolute top-1 flex items-center justify-center rounded-lg right-1 cursor-pointer bg-dark w-7 h-6'>
            <button title="Copy" className="bg-transparent border-0 cursor-pointer">  <Copy size={16} color='#3080E0' name='Copy' /> </button>
            </span>
          </div>

          <div className="flex gap-3 items-start justify-start mt-2">
            <button className="w-36 bg-gradiant border-0  h-8 rounded-lg text-white font-medium text-xs cursor-pointer"
              onClick={onClose}
              >
              Copy Link 
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShareCopyModal

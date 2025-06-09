import React, { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { QuickConnectModalProps } from '@renderer/type'

const QuickConnectModal: React.FC<QuickConnectModalProps> = ({ isOpen, onClose }) => {
  const [isOpenSelect, setIsOpenSelect] = useState(false)
  const [selectedProtocol, setSelectedProtocol] = useState('SSH2')

  const protocols = ['SSH2', 'Telnet', 'Local Shell']

  const handleSelect = (protocol) => {
    setSelectedProtocol(protocol)
    setIsOpenSelect(false)
  }

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
            Quick Connect
          </h2>

          <div className="border-box mt-2 pt-4">
            <label className="text-xs font-medium mb-1 pb-1 flex">Protocol</label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpenSelect(!isOpenSelect)}
                className="w-full p-2 h-11 cursor-pointer rounded bg-transparent border border-gray-light text-white mb-2 flex items-center justify-between hover:border-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
              >
                <span>{selectedProtocol}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${isOpenSelect ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpenSelect && (
                <div className=" top-0 left-0 mb-2 right-0 bg-dark z-10 bg-transparent  border border-gray-light rounded-lg mt-0 shadow-lg">
                  {protocols.map((protocol) => (
                    <button
                      key={protocol}
                      type="button"
                      onClick={() => handleSelect(protocol)}
                      className="w-full button-hover cursor-pointer px-3 py-2 text-left text-white bg-dark border-0 border-gray-light rounded-lg transition-colors"
                    >
                      {protocol}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-box">
            <label className="text-xs font-medium mb-1 pb-1 flex">Host Name</label>
            <input
              type="text"
              className="w-full p-2 h-11 rounded bg-dark border border-gray-light text-white mb-2"
            />
          </div>

          <div className="border-box">
            <label className="text-xs font-medium mb-1 pb-1 flex">Port</label>
            <input
              type="text"
              className="w-full p-2 h-11 rounded bg-dark border border-gray-light text-white mb-2"
            />
          </div>

          <div className="border-box">
            <label className="text-xs font-medium mb-1 pb-1 flex">Username</label>
            <input
              type="text"
              className="w-full p-2 h-11 rounded bg-dark border border-gray-light text-white mb-2"
            />
          </div>

          <div className="flex gap-3 items-center justify-center mt-1">
            <button
              className="flex-1 border-0 button-dark-bg w-full h-8 rounded-lg text-white font-medium text-xs cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="button-bg border-0 w-full h-8 rounded-lg text-white font-medium text-xs cursor-pointer">
              Connect
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default QuickConnectModal

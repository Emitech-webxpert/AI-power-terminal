import React from 'react'
import { ChevronDown } from 'lucide-react'
import { Step1Props } from '@renderer/type'

const Step1: React.FC<Step1Props> = ({ selectedProtocol, setSelectedProtocol }) => {
  const [isOpenSelect, setIsOpenSelect] = React.useState(false)
  const protocols = ['SSH', 'RDP', 'VNC']

  const onToggleSelect = () => setIsOpenSelect(!isOpenSelect)
  const onSelect = (protocol: string) => {
    setSelectedProtocol(protocol)
    setIsOpenSelect(false)
  }

  return (
    <div className="mt-4">
      <h2 className="text-xs font-normal pt-0">
        This Wizard will help you create a new session for connecting to a remote server.
      </h2>
      <h2 className="text-xs font-medium mt-2">
        What type of connection do you want to establish?
      </h2>

      <div className="border-box mt-2 pt-4">
        <label className="text-xs font-medium mb-1 pb-1 flex">Protocol</label>

        <div className="relative">
          <button
            type="button"
            onClick={onToggleSelect}
            className="w-full p-2 h-11 cursor-pointer rounded bg-transparent border border-gray-light text-white mb-2 flex items-center justify-between hover:border-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
          >
            <span>{selectedProtocol}</span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${isOpenSelect ? 'rotate-180' : ''}`}
            />
          </button>

          {isOpenSelect && (
            <div className="top-0 left-0 mb-2 right-0 bg-dark z-10 bg-transparent border border-gray-light rounded-lg mt-0 shadow-lg">
              {protocols.map((protocol) => (
                <button
                  key={protocol}
                  type="button"
                  onClick={() => onSelect(protocol)}
                  className="w-full button-hover cursor-pointer px-3 py-2 text-left text-white bg-dark border-0 border-gray-light rounded-lg transition-colors"
                >
                  {protocol}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Step1

import React, { useState } from 'react'
import { X } from 'lucide-react'
import setting from '@renderer/assets/icons/setting.svg'
import { SessionWizadModalProps } from '@renderer/type'
import { Step1, Step2, Step3 } from '@renderer/components/sessionForms'

const SessionWizadModal: React.FC<SessionWizadModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1)
  const [selectedProtocol, setSelectedProtocol] = useState('SSH2')
  const [host, setHost] = useState('')
  const [port, setPort] = useState('')
  const [username, setUsername] = useState('')
  const [sessionname, setSessionname] = useState('')
  const [description, setDescription] = useState('')

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  const handleFinish = () => {
    console.log({ selectedProtocol, host, port, username, sessionname, description })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-modal">
      <div className="bg-dark border border-gray-light rounded-lg w-96 p-4 relative text-white">
        <button
          onClick={onClose}
          className="absolute top-3 right-2 text-white bg-transparent border-0 cursor-pointer"
        >
          <X size={16} color="#B5B5B5" />
        </button>

        <h2 className="text-xs font-medium mb-0 mt-0 border-b border-gray-light pb-5">
          New Session Wizard
        </h2>

        <div>
          <img src={setting} alt="" className="m-auto flex" />
        </div>

        {step === 1 && (
          <Step1 selectedProtocol={selectedProtocol} setSelectedProtocol={setSelectedProtocol} />
        )}
        {step === 2 && (
          <Step2
            host={host}
            setHost={setHost}
            port={port}
            setPort={setPort}
            username={username}
            setUsername={setUsername}
          />
        )}
        {step === 3 && (
          <Step3
            sessionname={sessionname}
            setSessionname={setSessionname}
            discription={description}
            setDiscription={setDescription}
          />
        )}

        <div className="flex gap-3 items-center justify-center mt-6">
          <button
            className="flex-1 bg-transparent border border-input w-full h-8 rounded-lg text-white font-medium text-xs cursor-pointer"
            onClick={prevStep}
            disabled={step === 1}
            style={{
              opacity: step === 1 ? 0.5 : 1,
              cursor: step === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Back
          </button>
          <button
            className="flex-1 border-0 button-dark-bg w-full h-8 rounded-lg text-white font-medium text-xs cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-gradiant border-0 w-full h-8 rounded-lg text-white font-medium text-xs cursor-pointer"
            onClick={step === 3 ? handleFinish : nextStep}
          >
            {step === 3 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SessionWizadModal

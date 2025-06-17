import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import setting from '@renderer/assets/icons/setting.svg'
import { SessionWizadModalProps } from '@renderer/type'
import { Step1, Step2, Step3 } from '@renderer/components/sessionForms'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateField,
  resetSessionWizard,
  selectSessionWizard
} from '@renderer/store/slices/sessionSlice'
import { createSession } from '@renderer/constants/services/sshConnection'

const SessionWizadModal: React.FC<SessionWizadModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const session = useSelector(selectSessionWizard)
  const step = session?.step
  const visible = session?.visible
  useEffect(() => {
    if (isOpen) {
      dispatch(resetSessionWizard())
      dispatch(updateField({ field: 'visible', value: true }))
    } else {
      dispatch(updateField({ field: 'visible', value: false }))
    }
  }, [isOpen, dispatch])

  const nextStep = () => dispatch(updateField({ field: 'step', value: Math.min(step + 1, 3) }))
  const prevStep = () => dispatch(updateField({ field: 'step', value: Math.max(step - 1, 1) }))

  const handleFinish = async () => {
    try {
      // return console.log(session, "sessionsession")
      await createSession(session)
      dispatch(resetSessionWizard())
      onClose()
    } catch (error) {
      console.error('Failed to create session', error)
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-modal">
      <div className="bg-dark border border-gray-light rounded-lg w-96 p-4 relative text-white">
        <button
          onClick={() => {
            dispatch(resetSessionWizard())
            onClose()
          }}
          className="absolute top-3 right-2 text-white bg-transparent border-0 cursor-pointer"
        >
          <X size={16} color="#B5B5B5" />
        </button>

        <h2 className="text-xs font-medium mb-0 mt-0 border-b border-gray-light pb-5">
          New Session Wizard
        </h2>

        <div>
          <img src={setting} alt="settings-icon" className="m-auto flex" />
        </div>

        {step === 1 && (
          <Step1
            selectedProtocol={session.protocol}
            setSelectedProtocol={(value: string) =>
              dispatch(updateField({ field: 'protocol', value }))
            }
          />
        )}

        {step === 2 && (
          <Step2
            host={session.host}
            setHost={(value: string) => dispatch(updateField({ field: 'host', value }))}
            port={session.port}
            setPort={(value: string) => dispatch(updateField({ field: 'port', value }))}
            username={session.username}
            setUsername={(value: string) => dispatch(updateField({ field: 'username', value }))}
          />
        )}

        {step === 3 && (
          <Step3
            sessionname={session.sessionName}
            setSessionname={(value: string) =>
              dispatch(updateField({ field: 'sessionName', value }))
            }
            discription={session.description}
            setDiscription={(value: string) =>
              dispatch(updateField({ field: 'description', value }))
            }
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
            onClick={() => {
              dispatch(resetSessionWizard())
              onClose()
            }}
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

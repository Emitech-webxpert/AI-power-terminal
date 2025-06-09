import { ResetPasswordModalProps } from '@renderer/type'
import React, { useState, useEffect } from 'react'

const ChangePasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  onOpenUdatePassword
}) => {
  const [otp, setOtp] = useState(['', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(100)

  useEffect(() => {
    if (!isOpen) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerify = () => {
    const otpCode = otp.join('')
    if (otpCode.length === 4) {
      onOpenUdatePassword()
      onClose()
    }
  }

  const handleCancel = () => {
    setOtp(['', '', '', ''])
    setTimeLeft(100)
    onClose()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')} min`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
      <div className="bg-dark border border-gray-light rounded-lg w-80 p-4 relative text-white border-box">
        <h2 className="text-base font-medium mb-0 mt-0  pb-5">Reset Password</h2>

        <p className="text-xs text-light leading-relaxed mt-0 mb-0">
          Please check mail a 4-digit code was sent to
          <span className="font-semibold"> Abc@yopmail.com</span>
        </p>

        <div className="flex justify-center gap-3 py-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg font-medium bg-transparent bg-dark border border-gray-light rounded text-white focus:border-blue-500 focus:outline-none"
              maxLength={1}
              placeholder="0"
            />
          ))}
        </div>

        <div className="text-center mb-3">
          <span className="text-xs font-normal text-light-gray">
            OTP valid for{' '}
            <span className="text-xs text-blue font-medium">{formatTime(timeLeft)}</span>
          </span>
        </div>

        <div className="flex gap-3 items-center justify-center mt-2">
          <button
            onClick={handleCancel}
            className="flex-1 border-0 button-dark-bg w-full h-8 rounded-lg text-white font-medium text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            disabled={otp.join('').length < 4}
            className="button-bg border-0 w-full h-8 rounded-lg text-white font-medium text-xs cursor-pointer"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordModal

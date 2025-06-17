import { OtpVerificationProps } from '@renderer/type'
import { ArrowLeft } from 'lucide-react'
import React, { useState } from 'react'

const OtpVerification: React.FC<OtpVerificationProps> = ({
  onOtpSubmitSuccess,
  onBackToForgotPassword
}) => {
  const [otp, setOtp] = useState(Array(6).fill(''))

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const updated = [...otp]
      updated[index] = value
      setOtp(updated)
      // auto focus next
      if (value && index < 5) {
        const next = document.getElementById(`otp-${index + 1}`)
        if (next) (next as HTMLInputElement).focus()
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length === 6) {
      console.log('OTP entered:', code)
      onOtpSubmitSuccess()
    }
  }

  return (
    <div className="flex flex-col items-center justify-start h-screen overflow-auto text-white py-5 mt-5">
      <div className="w-96 p-6 rounded-lg border border-dark terminal-dark-bg">
        <div
          className="inline-flex gap-1 items-center cursor-pointer text-muted-two mb-1"
          onClick={onBackToForgotPassword}
        >
          <ArrowLeft /> Back
        </div>
        <h2 className="text-4xl font-bold mb-2 text-muted-two mt-0">Enter OTP</h2>
        <p className="text-sm text-muted-two mb-4">
          Please enter the 6-digit OTP sent to your email.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col items-start">
          <div className="flex gap-2 mb-4">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                className="w-14 h-14 text-center rounded-md text-lg border border-muted bg-transparent text-white focus:outline-none focus:border-blue"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg button-bg border-0 h-12 text-white font-semibold hover:button-hover cursor-pointer"
          >
            Submit OTP
          </button>
        </form>
      </div>
    </div>
  )
}

export default OtpVerification

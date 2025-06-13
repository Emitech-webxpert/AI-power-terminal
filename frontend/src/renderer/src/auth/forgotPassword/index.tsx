import { ForgotPasswordProps } from '@renderer/type'
import { ArrowLeft } from 'lucide-react'
import React, { useState } from 'react'

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToSignIn, onOtpRequested }) => {
  const [email, setEmail] = useState('')

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    setTimeout(() => {
      console.log('Password reset requested for:', email)
      onOtpRequested()
    }, 1500)
  }

  const handleBackToSignIn = (e: React.MouseEvent) => {
    e.preventDefault()
    onBackToSignIn()
  }

  return (
    <div className="flex flex-col items-center justify-start h-screen overflow-auto text-white py-5 mt-5">
      <div className="w-96 p-6 rounded-lg border border-dark terminal-dark-bg">
        <div
          className="inline-flex gap-1 items-center cursor-pointer text-muted-two mb-1"
          onClick={handleBackToSignIn}
        >
          <ArrowLeft /> Back
        </div>
        <h2 className="text-4xl font-bold mb-0 mt-0 text-muted-two pb-1-half">Forgot Password</h2>
        <p className="text-sm text-muted-two mb-4 mt-1">
          Please enter the email address associated with your account.
        </p>

        <form onSubmit={handleForgotPassword} className="flex flex-col ">
          <div className="input-group-custom mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`input-field w-full p-3 h-14 rounded-lg terminal-dark-bg text-base text-white border border-muted  focus:border-blue focus:outline-none ${email ? 'filled' : ''}`}
              id="email"
              required
            />
            <label htmlFor="email" className="input-label-custom text-muted">
              Email
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg button-bg border-0 h-12  text-white font-semibold hover:button-hover cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword

import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'

const ResetPassword: React.FC = ({}) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="flex flex-col items-center justify-start h-screen overflow-auto text-white py-5 mt-5">
      <div className="w-96 p-6 rounded-lg border border-dark terminal-dark-bg">
        <h2 className="text-4xl font-bold mb-0 mt-0 text-muted-two pb-1-half">Reset Password</h2>
        <p className="text-sm text-muted-two mb-4 mt-1">Create your new password</p>

        <form onSubmit={handleSignIn} className="flex flex-col ">
          <div className="input-group-custom relative mb-3">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input-field w-full p-3 h-14 pr-10 rounded-lg terminal-dark-bg text-base text-white border border-muted  focus:border-blue focus:outline-none ${password ? 'filled' : ''}`}
              id="password"
              placeholder="New password"
              required
            />
            <label htmlFor="password" className="input-label-custom text-muted">
              New Password
            </label>

            <button
              type="button"
              className="absolute right-3 top-5 text-muted text-sm cursor-pointer bg-transparent border-0"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="input-group-custom relative mb-3">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`input-field w-full p-3 h-14 pr-10 rounded-lg terminal-dark-bg text-base text-white border border-muted focus:border-blue focus:outline-none ${confirmPassword ? 'filled' : ''}`}
              id="confirmPassword"
              required
            />
            <label htmlFor="confirmPassword" className="input-label-custom text-muted">
              Confirm Password
            </label>
            <button
              type="button"
              className="absolute right-3 top-5 text-muted text-sm cursor-pointer bg-transparent border-0"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
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

export default ResetPassword

import { google, line, team } from '@renderer/assets'
import { SignInProps } from '@renderer/type'
import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'

const SignUp: React.FC<SignInProps> = ({ onLoginSuccess, onSignInClick }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    onLoginSuccess()
  }
  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onSignInClick) {
      onSignInClick()
    }
  }

  return (
    <div className="flex flex-col items-center justify-start h-screen overflow-auto text-white py-5">
      <div className="w-96 p-6 rounded-lg border border-dark terminal-dark-bg">
        <h2 className="text-4xl font-bold mb-0 mt-0 text-muted-two pb-1-half">Sign Up</h2>
        <p className="text-sm text-muted-two mb-4 mt-1">Create your account</p>

        <form onSubmit={handleSignIn} className="flex flex-col ">
          <div className="input-group-custom mb-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`input-field w-full p-3 h-14 rounded-lg terminal-dark-bg text-base text-white border border-muted focus:border-blue focus:outline-none ${name ? 'filled' : ''}`}
              id="name"
              required
            />
            <label htmlFor="name" className="input-label-custom text-muted">
              Name
            </label>
          </div>

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

          <div className="input-group-custom relative mb-3">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input-field w-full p-3 h-14 pr-10 rounded-lg terminal-dark-bg text-base text-white border border-muted  focus:border-blue focus:outline-none ${password ? 'filled' : ''}`}
              id="password"
              placeholder="password"
              required
            />
            <label htmlFor="password" className="input-label-custom text-muted">
              Password
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
            Sign up
          </button>
        </form>

        <div className="flex items-center justify-center my-4">
          <div className="flex items-center justify-center rotate-180">
            <img src={line} alt="line" />
          </div>
          <span className="px-3 text-white text-sm relative">or</span>
          <div className="flex items-center justify-center ">
            <img src={line} alt="line" />
          </div>
        </div>

        <button className="w-full py-3 mb-3 rounded-lg bg-white border-0 h-12 text-black font-semibold flex items-center justify-center gap-2 cursor-pointer hover:button-hover">
          <span>Sign up with Teams</span>
          <span>
            <img src={team} alt="team" />
          </span>
        </button>

        <button className="w-full py-3 rounded-lg bg-transparent  border border-muted h-12 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer hover:button-hover">
          <span>Sign up with Google</span>
          <span>
            <img src={google} alt="team" />
          </span>
        </button>

        <p className="text-center text-sm text-white mt-4 pt-2 mb-0 font-light">
          Have an account? {' '}
          <span
            className="text-white font-medium no-underline cursor-pointer"
            onClick={handleSignInClick}
          >
            Sign in Now
          </span>
        </p>
      </div>
    </div>
  )
}

export default SignUp

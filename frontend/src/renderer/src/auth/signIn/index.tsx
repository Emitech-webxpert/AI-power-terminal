import { google, line, team } from '@renderer/assets'
import { SignInProps } from '@renderer/type'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import React from 'react'
import { useAppSelector, useAppDispatch } from '@renderer/store/hooks'
import {
  signInUser,
  setEmail,
  setPassword,
  setKeepLoggedIn,
  toggleShowPassword,
  clearError,
  selectIsLoading,
  selectError,
  selectEmail,
  selectPassword,
  selectKeepLoggedIn,
  selectShowPassword
} from '@renderer/store/slices/authSlice'

const SignIn: React.FC<SignInProps> = ({
  onLoginSuccess,
  onSignUpClick,
  onForgotPasswordClick
}) => {
  const dispatch = useAppDispatch()
  
  // Get all auth state from Redux - NO useState!
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)
  const email = useAppSelector(selectEmail)
  const password = useAppSelector(selectPassword)
  const keepLoggedIn = useAppSelector(selectKeepLoggedIn)
  const showPassword = useAppSelector(selectShowPassword)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    dispatch(clearError())
    
    try {
      const requestData = {
        email,
        password,
      }

      const result = await dispatch(signInUser(requestData))
      
      if (signInUser.fulfilled.match(result)) {
        console.log('Sign in successful:', result.payload)
        onLoginSuccess()
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setEmail(e.target.value))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPassword(e.target.value))
  }

  const handleKeepLoggedInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setKeepLoggedIn(e.target.checked))
  }

  const handleTogglePassword = () => {
    dispatch(toggleShowPassword())
  }

  const handleSignUpClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onSignUpClick) {
      onSignUpClick()
    }
  }

  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onForgotPasswordClick) {
      onForgotPasswordClick()
    }
  }

  return (
    <div className="flex flex-col items-center justify-start h-screen overflow-auto text-white py-5 mt-2">
      <div className="w-96 p-6 rounded-lg border border-dark terminal-dark-bg">
        <h2 className="text-4xl font-bold mb-0 mt-0 text-muted-two pb-1-half">Sign in</h2>
        <p className="text-sm text-muted-two mb-4 mt-1">
          Please sign in to continue to your account.
        </p>

        <form onSubmit={handleSignIn} className="flex flex-col ">
          {error && (
            <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="input-group-custom mb-3">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className={`input-field w-full p-3 h-14 rounded-lg terminal-dark-bg text-base text-white border border-muted  focus:border-blue focus:outline-none ${email ? 'filled' : ''}`}
              id="email"
              required
              disabled={isLoading}
            />
            <label htmlFor="email" className="input-label-custom text-muted">
              Email
            </label>
          </div>

          <div className="input-group-custom relative mb-3">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              className={`input-field w-full p-3 h-14 pr-10 rounded-lg terminal-dark-bg text-base text-white border border-muted  focus:border-blue focus:outline-none ${password ? 'filled' : ''}`}
              id="password"
              placeholder="password"
              required
              disabled={isLoading}
            />
            <label htmlFor="password" className="input-label-custom text-muted">
              Password
            </label>

            <button
              type="button"
              className="absolute right-3 top-5 text-muted text-sm cursor-pointer bg-transparent border-0"
              onClick={handleTogglePassword}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-between items-center text-sm mb-3">
            <label className="flex items-center gap-2 text-muted-two">
              <input
                type="checkbox"
                checked={keepLoggedIn}
                onChange={handleKeepLoggedInChange}
                className="h-4 w-4 bg-transparent"
                disabled={isLoading}
              />
              <span>Keep me logged in</span>
            </label>
            <span
              className={`hover:underline text-muted-two ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              onClick={!isLoading ? handleForgotPasswordClick : undefined}
            >
              Forgot Password?
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg button-bg border-0 h-12 text-white font-semibold hover:button-hover cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
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

        <button 
          className={`w-full py-3 mb-3 rounded-lg bg-white border-0 h-12 text-black font-semibold flex items-center justify-center gap-2 hover:button-hover ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          disabled={isLoading}
        >
          <span>Sign up with Teams</span>
          <span>
            <img src={team} alt="team" />
          </span>
        </button>

        <button 
          className={`w-full py-3 rounded-lg bg-transparent border border-muted h-12 text-white font-semibold flex items-center justify-center gap-2 hover:button-hover ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          disabled={isLoading}
        >
          <span>Sign up with Google</span>
          <span>
            <img src={google} alt="team" />
          </span>
        </button>

        <p className="text-center text-sm text-white mt-4 pt-2 mb-0 font-light">
          Don't have an account?{' '}
          <span
            className={`text-white font-medium no-underline ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            onClick={!isLoading ? handleSignUpClick : undefined}
          >
            Sign up now
          </span>
        </p>
      </div>
    </div>
  )
}

export default SignIn
import React from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import {SignInFormProps} from "@renderer/type"

const SignInForm: React.FC<SignInFormProps> = ({
  email,
  password,
  keepLoggedIn,
  showPassword,
  isLoading,
  error,
  fieldErrors,
  isFormValid,
  onEmailChange,
  onPasswordChange,
  onKeepLoggedInChange,
  onTogglePassword,
  onSubmit,
  onForgotPasswordClick,
  onFieldValidate
}) => {
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onEmailChange(e)
    onFieldValidate('email', value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onPasswordChange(e)
    onFieldValidate('password', value)
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      {/* Global Error Message */}
   

      {/* Email Input */}
      <div className="input-group-custom mb-3">
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          className={`input-field w-full p-3 h-14 rounded-lg terminal-dark-bg text-base text-white border ${
            fieldErrors.email 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-muted focus:border-blue'
          } focus:outline-none ${email ? 'filled' : ''}`}
          id="email"
          required
          disabled={isLoading}
        />
        <label htmlFor="email" className={`input-label-custom ${fieldErrors.email ? 'text-red-400' : 'text-muted'}`}>
          Email
        </label>
        {fieldErrors.email && (
          <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="input-group-custom relative mb-3">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handlePasswordChange}
          className={`input-field w-full p-3 h-14 pr-10 rounded-lg terminal-dark-bg text-base text-white border ${
            fieldErrors.password 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-muted focus:border-blue'
          } focus:outline-none ${password ? 'filled' : ''}`}
          id="password"
          placeholder="password"
          required
          disabled={isLoading}
        />
        <label htmlFor="password" className={`input-label-custom ${fieldErrors.password ? 'text-red-400' : 'text-muted'}`}>
          Password
        </label>
        <button
          type="button"
          className="absolute right-3 top-5 text-muted text-sm cursor-pointer bg-transparent border-0"
          onClick={onTogglePassword}
          disabled={isLoading}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        {fieldErrors.password && (
          <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
        )}
      </div>

      {/* Sign In Options */}
      <div className="flex justify-between items-center text-sm mb-3">
        <label className="flex items-center gap-2 text-muted-two">
          <input
            type="checkbox"
            checked={keepLoggedIn}
            onChange={onKeepLoggedInChange}
            className="h-4 w-4 bg-transparent"
            disabled={isLoading}
          />
          <span>Keep me logged in</span>
        </label>
        <span
          className={`hover:underline text-muted-two ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          onClick={!isLoading ? onForgotPasswordClick : undefined}
        >
          Forgot Password?
        </span>
      </div>

      {/* Submit Button */}
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
         {error && (
        <div className="mb-3 p-3 text-sm">
          {error}
        </div>
      )}
    </form>
  )
}

export default SignInForm

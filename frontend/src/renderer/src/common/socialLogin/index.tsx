import React from 'react'
import { google, team } from '@renderer/assets'

interface SocialLoginProps {
  mode: 'signin' | 'signup'
  onToggleClick: () => void
  disabled?: boolean
}

const SocialLogin: React.FC<SocialLoginProps> = ({ 
  mode, 
  onToggleClick, 
  disabled = false 
}) => {
  return (
    <>
      <button 
        className={`w-full py-3 mb-3 rounded-lg bg-white border-0 h-12 text-black font-semibold flex items-center justify-center gap-2 hover:button-hover ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        disabled={disabled}
      >
        <span>{mode === 'signin' ? 'Sign up with Teams' : 'Sign up with Teams'}</span>
        <span>
          <img src={team} alt="team" />
        </span>
      </button>

      <button 
        className={`w-full py-3 rounded-lg bg-transparent border border-muted h-12 text-white font-semibold flex items-center justify-center gap-2 hover:button-hover ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        disabled={disabled}
      >
        <span>{mode === 'signin' ? 'Sign up with Google' : 'Sign up with Google'}</span>
        <span>
          <img src={google} alt="google" />
        </span>
      </button>

      <p className="text-center text-sm text-white mt-4 pt-2 mb-0 font-light">
        {mode === 'signin' 
          ? "Don't have an account? "
          : "Have an account? "
        }
        <span
          className={`text-white font-medium no-underline ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          onClick={!disabled ? onToggleClick : undefined}
        >
          {mode === 'signin' ? 'Sign up now' : 'Sign in Now'}
        </span>
      </p>
    </>
  )
}

export default SocialLogin
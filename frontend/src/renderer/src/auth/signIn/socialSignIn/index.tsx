import React from 'react'
import { google, team } from '@renderer/assets'
import { SocialSignInProps } from '@renderer/type'

const SocialSignIn: React.FC<SocialSignInProps> = ({ onSignUpClick, disabled = false }) => {
  return (
    <>
      <button 
        className={`w-full py-3 mb-3 rounded-lg bg-white border-0 h-12 text-black font-semibold flex items-center justify-center gap-2 hover:button-hover ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        disabled={disabled}
      >
        <span>Sign up with Teams</span>
        <span>
          <img src={team} alt="team" />
        </span>
      </button>

      <button 
        className={`w-full py-3 rounded-lg bg-transparent border border-muted h-12 text-white font-semibold flex items-center justify-center gap-2 hover:button-hover ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        disabled={disabled}
      >
        <span>Sign up with Google</span>
        <span>
          <img src={google} alt="google" />
        </span>
      </button>

      <p className="text-center text-sm text-white mt-4 pt-2 mb-0 font-light">
        Don't have an account?{' '}
        <span 
          className={`text-white font-medium no-underline ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          onClick={!disabled ? onSignUpClick : undefined}
        >
          Sign up now
        </span>
      </p>
    </>
  )
}

export default SocialSignIn
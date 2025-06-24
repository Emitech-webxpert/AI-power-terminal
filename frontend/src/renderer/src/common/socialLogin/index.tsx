import React from 'react'
import { google, team } from '@renderer/assets'
import { Loader2 } from 'lucide-react'
import { SocialLoginProps } from '@renderer/type'
import { useAppSelector, useAppDispatch } from '@renderer/store/hooks'
import {
  setGoogleLoading,
  setTeamsLoading,
  selectIsGoogleLoading,
  selectIsTeamsLoading
} from '@renderer/store/slices/authSlice/socialLogin'

const SocialLogin: React.FC<SocialLoginProps> = ({
  mode,
  onToggleClick,
  disabled = false,
  onGoogleSuccess,
  onGoogleError
}) => {
  const dispatch = useAppDispatch()
  
  // Get loading states from Redux
  const isGoogleLoading = useAppSelector(selectIsGoogleLoading)
  const isTeamsLoading = useAppSelector(selectIsTeamsLoading)

  const handleGoogleAuth = async () => {
    if (disabled || isGoogleLoading) return

    dispatch(setGoogleLoading(true))

    try {
      const result = await window.api.googleAuth.authenticate()

      if (result.success && result.data) {
        console.log('Google auth successful:', result.data.userInfo)
        onGoogleSuccess?.(result.data)
      } else {
        const errorMessage = result.error || 'Google authentication failed'
        console.error('Google auth failed:', errorMessage)
        onGoogleError?.(errorMessage)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google authentication failed'
      console.error('Google auth error:', error)
      onGoogleError?.(errorMessage)
    } finally {
      dispatch(setGoogleLoading(false))
    }
  }

  const handleTeamsAuth = async () => {
    if (disabled || isTeamsLoading) return

    dispatch(setTeamsLoading(true))

    try {
      // TODO: Implement Teams authentication
      console.log('Teams auth not implemented yet')
    } catch (error) {
      console.error('Teams auth error:', error)
    } finally {
      dispatch(setTeamsLoading(false))
    }
  }

  return (
    <>
      <button
        className={`w-full py-3 mb-3 rounded-lg bg-white border-0 h-12 text-black font-semibold flex items-center justify-center gap-2 hover:button-hover ${
          disabled || isTeamsLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        }`}
        disabled={disabled || isTeamsLoading}
        onClick={handleTeamsAuth}
      >
        <span>
          {isTeamsLoading ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            `${mode === 'signin' ? 'Sign in' : 'Sign up'} with Teams`
          )}
        </span>
        {!isTeamsLoading && (
          <span>
            <img src={team} alt="team" />
          </span>
        )}
      </button>

      <button
        className={`w-full py-3 rounded-lg bg-transparent border border-muted h-12 text-white font-semibold flex items-center justify-center gap-2 hover:button-hover ${
          disabled || isGoogleLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        }`}
        disabled={disabled || isGoogleLoading}
        onClick={handleGoogleAuth}
      >
        <span>
          {isGoogleLoading ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            `${mode === 'signin' ? 'Sign in' : 'Sign up'} with Google`
          )}
        </span>
        {!isGoogleLoading && (
          <span>
            <img src={google} alt="google" />
          </span>
        )}
      </button>

      <p className="text-center text-sm text-white mt-4 pt-2 mb-0 font-light">
        {mode === 'signin'
          ? "Don't have an account? "
          : "Have an account? "
        }
        <span
          className={`text-white font-medium no-underline ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
          onClick={!disabled ? onToggleClick : undefined}
        >
          {mode === 'signin' ? 'Sign up now' : 'Sign in Now'}
        </span>
      </p>
    </>
  )
}

export default SocialLogin
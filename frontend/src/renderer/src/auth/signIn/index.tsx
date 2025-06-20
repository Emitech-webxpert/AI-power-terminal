import React from 'react'
import { SignInProps } from '@renderer/type'
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

import SignInForm from './signInForm'
import OrDivider from './orDivider'
import SocialSignIn from './socialSignIn'

const SignIn: React.FC<SignInProps> = ({
  onLoginSuccess,
  onSignUpClick,
  onForgotPasswordClick
}) => {
  const dispatch = useAppDispatch()
  
  // Redux state
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
      const result = await dispatch(signInUser({ email, password }))
      if (signInUser.fulfilled.match(result)) {
        console.log('Sign in successful:', result.payload)
        onLoginSuccess()
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    }
  }

  return (
    <div className="flex flex-col items-center justify-start h-screen overflow-auto text-white py-5 mt-2">
      <div className="w-96 p-6 rounded-lg border border-dark terminal-dark-bg">
        <h2 className="text-4xl font-bold mb-0 mt-0 text-muted-two pb-1-half">Sign in</h2>
        <p className="text-sm text-muted-two mb-4 mt-1">
          Please sign in to continue to your account.
        </p>

        <SignInForm
          email={email}
          password={password}
          keepLoggedIn={keepLoggedIn}
          showPassword={showPassword}
          isLoading={isLoading}
          error={error}
          onEmailChange={(e) => dispatch(setEmail(e.target.value))}
          onPasswordChange={(e) => dispatch(setPassword(e.target.value))}
          onKeepLoggedInChange={(e) => dispatch(setKeepLoggedIn(e.target.checked))}
          onTogglePassword={() => dispatch(toggleShowPassword())}
          onSubmit={handleSignIn}
          onForgotPasswordClick={onForgotPasswordClick ?? (() => {})}
        />

        <OrDivider />
        
        <SocialSignIn 
          disabled={isLoading} 
          onSignUpClick={onSignUpClick ?? (() => {})}
        />
      </div>
    </div>
  )
}

export default SignIn
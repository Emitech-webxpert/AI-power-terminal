import React, { useEffect } from 'react'
import { SignInProps } from '@renderer/type'
import { useAppSelector, useAppDispatch } from '@renderer/store/hooks'
import {
  signInUser,
  setEmail,
  setPassword,
  setKeepLoggedIn,
  toggleShowPassword,
  clearError,
  setSocialAuthError,
  clearSocialAuthError,
  clearAllErrors,
  validateField,
  validateForm,
  clearForm,
  clearAllFieldErrors,
  selectEmail,
  selectPassword,
  selectKeepLoggedIn,
  selectShowPassword,
  selectIsLoading,
  selectError,
  selectSocialAuthError,
  selectFieldErrors,
  selectIsFormValid
} from '@renderer/store/slices/authSlice/signIn'
import { signUpUser } from '@renderer/store/slices/authSlice/signUp'

import SignInForm from './signInForm'
import OrDivider from '../../common/OrDivider'
import SocialButtons from '../../common/socialLogin'

const SignIn: React.FC<SignInProps> = ({
  onLoginSuccess,
  onSignUpClick,
  onForgotPasswordClick
}) => {
  const dispatch = useAppDispatch()

  // Redux state including validation
  const email = useAppSelector(selectEmail)
  const password = useAppSelector(selectPassword)
  const keepLoggedIn = useAppSelector(selectKeepLoggedIn)
  const showPassword = useAppSelector(selectShowPassword)
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)
  const socialAuthError = useAppSelector(selectSocialAuthError)
  const fieldErrors = useAppSelector(selectFieldErrors)
  const isFormValid = useAppSelector(selectIsFormValid)

  // Clear form when component mounts (when modal opens or switches)
  useEffect(() => {
    dispatch(clearForm())
    dispatch(clearAllFieldErrors())
    dispatch(clearAllErrors())
  }, [dispatch])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()    
    dispatch(clearAllErrors())

    // Validate entire form before submission
    dispatch(validateForm())

    // Check if form is valid after validation
    if (!isFormValid) {
      return
    }

    try {
      const result = await dispatch(signInUser({ email, password }))
      if (signInUser.fulfilled.match(result)) {
        localStorage.setItem('userData', JSON.stringify(result.payload.data))
        onLoginSuccess()
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    }
  }

  // Handle Google Auth Success
  const handleGoogleSuccess = async (googleData: any) => {
    console.log('Google authentication successful:', googleData)
    dispatch(clearSocialAuthError())

    try {
      const result = await dispatch(signUpUser({
        name: googleData.userInfo.name,
        email: googleData.userInfo.email,
        password: '',
        confirmPassword: '',
        isGoogleLogin: true,
        profileUrl: googleData.userInfo.picture
      }))

      if (signUpUser.fulfilled.match(result)) {
        // Store authentication data
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('authToken', googleData.access_token)
        localStorage.setItem('userData', JSON.stringify(googleData.userInfo))

        onLoginSuccess()
      } else {
        dispatch(setSocialAuthError(result.payload as string || 'Failed to store user data'))
      }
    } catch (error) {
      console.error('Error processing Google auth:', error)
      dispatch(setSocialAuthError('Failed to process Google authentication'))
    }
  }

  // Handle Google Auth Error
  const handleGoogleError = (errorMessage: string) => {
    console.error('Google authentication error:', errorMessage)
    dispatch(setSocialAuthError(errorMessage))
    dispatch(clearError())
  }

  const handleFieldValidate = (field: string, value: string) => {
    dispatch(validateField({ field, value }))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setEmail(e.target.value))
    // Clear errors when user starts typing
    if (error) dispatch(clearError())
    if (socialAuthError) dispatch(clearSocialAuthError())
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPassword(e.target.value))
    // Clear errors when user starts typing
    if (error) dispatch(clearError())
    if (socialAuthError) dispatch(clearSocialAuthError())
  }

  const handleKeepLoggedInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setKeepLoggedIn(e.target.checked))
  }

  const handleTogglePassword = () => {
    dispatch(toggleShowPassword())
  }

  const handleSignUpClick = () => {
    dispatch(clearForm())
    dispatch(clearAllFieldErrors())
    dispatch(clearAllErrors())

    if (onSignUpClick) {
      onSignUpClick()
    }
  }

  const handleForgotPasswordClick = () => {
    if (onForgotPasswordClick) {
      onForgotPasswordClick()
    }
  }

  // Combine errors for display
  const displayError = error || socialAuthError

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
          error={displayError} // Pass the combined error here
          fieldErrors={fieldErrors}
          onEmailChange={handleEmailChange}
          onPasswordChange={handlePasswordChange}
          onKeepLoggedInChange={handleKeepLoggedInChange}
          onTogglePassword={handleTogglePassword}
          onSubmit={handleSignIn}
          onForgotPasswordClick={handleForgotPasswordClick}
          onFieldValidate={handleFieldValidate}
        />

        <OrDivider />

        <SocialButtons
          mode="signin"
          disabled={isLoading}
          onToggleClick={handleSignUpClick}
          onGoogleSuccess={handleGoogleSuccess}
          onGoogleError={handleGoogleError}
        />
      </div>
    </div>
  )
}

export default SignIn
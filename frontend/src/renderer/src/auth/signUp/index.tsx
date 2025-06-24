import React, { useEffect } from 'react'
import { SignInProps } from '@renderer/type'
import { useAppSelector, useAppDispatch } from '@renderer/store/hooks'
import {
  signUpUser,
  setSignUpName,
  setSignUpEmail,
  setSignUpPassword,
  setSignUpConfirmPassword,
  toggleSignUpShowPassword,
  toggleSignUpShowConfirmPassword,
  clearSignUpError,
  clearSignUpForm,
  clearAllSignUpFieldErrors,
  setSocialAuthError,
  clearSocialAuthError,
  clearAllErrors,
  validateSignUpField,
  validateSignUpForm,
  selectSignUpName,
  selectSignUpEmail,
  selectSignUpPassword,
  selectSignUpConfirmPassword,
  selectSignUpShowPassword,
  selectSignUpShowConfirmPassword,
  selectSignUpIsLoading,
  selectSignUpError,
  selectSocialAuthError,
  selectSignUpFieldErrors,
  selectSignUpIsFormValid
} from '@renderer/store/slices/authSlice/signUp'

import SignUpForm from './signUpForm'
import OrDivider from '../../common/OrDivider'
import SocialButtons from '../../common/socialLogin'

const SignUp: React.FC<SignInProps> = ({ onLoginSuccess, onSignInClick }) => {
  const dispatch = useAppDispatch()

  // Redux state including validation
  const name = useAppSelector(selectSignUpName)
  const email = useAppSelector(selectSignUpEmail)
  const password = useAppSelector(selectSignUpPassword)
  const confirmPassword = useAppSelector(selectSignUpConfirmPassword)
  const showPassword = useAppSelector(selectSignUpShowPassword)
  const showConfirmPassword = useAppSelector(selectSignUpShowConfirmPassword)
  const isLoading = useAppSelector(selectSignUpIsLoading)
  const error = useAppSelector(selectSignUpError)
  const socialAuthError = useAppSelector(selectSocialAuthError) // Get from Redux
  const fieldErrors = useAppSelector(selectSignUpFieldErrors)
  const isFormValid = useAppSelector(selectSignUpIsFormValid)

  useEffect(() => {
    dispatch(clearSignUpForm())
    dispatch(clearAllSignUpFieldErrors())
    dispatch(clearAllErrors()) // Clear both errors
  }, [dispatch])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear any previous errors
    dispatch(clearAllErrors())

    // Validate entire form before submission
    dispatch(validateSignUpForm())

    // Check if form is valid after validation
    if (!isFormValid) {
      return
    }

    try {
      const result = await dispatch(signUpUser({ name, email, password, confirmPassword }))

      if (signUpUser.fulfilled.match(result)) {
        console.log('Sign up successful:', result.payload)
        localStorage.setItem('isLoggedIn', 'true')
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
        console.log('Google user successfully stored in backend:', result.payload)

        // Store authentication data
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('authToken', googleData.access_token)
        localStorage.setItem('userData', JSON.stringify(googleData.userInfo))

        // Call success callback to close modal and proceed
        onLoginSuccess()
      } else {
        // Handle backend error
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
    dispatch(clearSignUpError()) // Clear any existing form errors
  }

  const handleFieldValidate = (field: string, value: string, additionalValue?: string) => {
    dispatch(validateSignUpField({ field, value, additionalValue }))
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSignUpName(e.target.value))
    // Clear API error when user starts typing
    if (error) {
      dispatch(clearSignUpError())
    }
    if (socialAuthError) {
      dispatch(clearSocialAuthError())
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSignUpEmail(e.target.value))
    // Clear API error when user starts typing
    if (error) {
      dispatch(clearSignUpError())
    }
    if (socialAuthError) {
      dispatch(clearSocialAuthError())
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSignUpPassword(e.target.value))
    // Clear API error when user starts typing
    if (error) {
      dispatch(clearSignUpError())
    }
    if (socialAuthError) {
      dispatch(clearSocialAuthError())
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSignUpConfirmPassword(e.target.value))
    // Clear API error when user starts typing
    if (error) {
      dispatch(clearSignUpError())
    }
    if (socialAuthError) {
      dispatch(clearSocialAuthError())
    }
  }

  const handleSignInClick = () => {
    // Clear form before switching to SignIn
    dispatch(clearSignUpForm())
    dispatch(clearAllSignUpFieldErrors())
    dispatch(clearAllErrors())

    if (onSignInClick) {
      onSignInClick()
    }
  }

  // Combine errors for display
  const displayError = error || socialAuthError

  return (
    <div className="flex flex-col items-center justify-start h-screen overflow-auto text-white py-5">
      <div className="w-96 p-6 rounded-lg border border-dark terminal-dark-bg">
        <h2 className="text-4xl font-bold mb-0 mt-0 text-muted-two pb-1-half">Sign Up</h2>
        <p className="text-sm text-muted-two mb-4 mt-1">Create your account</p>

        {/* Display combined error message */}
        {displayError && (
          <div className="mb-3 p-3 text-sm bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {displayError}
          </div>
        )}

        <SignUpForm
          name={name}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          isLoading={isLoading}
          error={null} // We're handling error display above
          fieldErrors={fieldErrors}
          isFormValid={isFormValid}
          onNameChange={handleNameChange}
          onEmailChange={handleEmailChange}
          onPasswordChange={handlePasswordChange}
          onConfirmPasswordChange={handleConfirmPasswordChange}
          onTogglePassword={() => dispatch(toggleSignUpShowPassword())}
          onToggleConfirmPassword={() => dispatch(toggleSignUpShowConfirmPassword())}
          onSubmit={handleSignUp}
          onFieldValidate={handleFieldValidate}
        />

        <OrDivider />

        <SocialButtons
          mode="signup"
          disabled={isLoading}
          onToggleClick={handleSignInClick}
          onGoogleSuccess={handleGoogleSuccess}
          onGoogleError={handleGoogleError}
        />
      </div>
    </div>
  )
}

export default SignUp
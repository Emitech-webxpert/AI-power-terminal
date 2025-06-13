import React, { useState } from 'react'
import {
  ForgotPassword,
  OtpVerification,
  ResetPassword,
  SignIn,
  SignUp
} from '@renderer/auth/index'
import { AuthLayoutProps } from '@renderer/type'

const AuthLayout: React.FC<AuthLayoutProps> = ({ onLoginSuccess }) => {
  const [authView, setAuthView] = useState<'signin' | 'signup' | 'forgot' | 'otp' | 'reset'>('signin')
  const handleSignUpClick = () => setAuthView('signup')
  const handleSignInClick = () => setAuthView('signin')
  const handleForgotPasswordClick = () => setAuthView('forgot')

  switch (authView) {
    case 'signup':
      return <SignUp onLoginSuccess={onLoginSuccess} onSignInClick={handleSignInClick} />
    case 'forgot':
      return (
        <ForgotPassword
          onBackToSignIn={handleSignInClick}
          onOtpRequested={() => setAuthView('otp')}
        />
      )
    case 'otp':
      return (
        <OtpVerification
          onOtpSubmitSuccess={() => setAuthView('reset')}
          onBackToForgotPassword={() => setAuthView('forgot')}
        />
      )
    case 'reset':
      return <ResetPassword />
    default:
      return (
        <SignIn
          onLoginSuccess={onLoginSuccess}
          onSignUpClick={handleSignUpClick}
          onForgotPasswordClick={handleForgotPasswordClick}
        />
      )
  }
}

export default AuthLayout

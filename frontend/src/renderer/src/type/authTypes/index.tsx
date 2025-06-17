export interface SignInProps {
    onLoginSuccess: () => void
    onSignUpClick?: () => void
    onSignInClick?: () => void
    onForgotPasswordClick?: () => void
  }

  export interface ForgotPasswordProps {
    onBackToSignIn: () => void
    onOtpRequested: () => void;
  }

  export interface OtpVerificationProps {
    onOtpSubmitSuccess: () => void
    onBackToForgotPassword: () => void
  }

  export interface AuthLayoutProps {
    onLoginSuccess: () => void
  }
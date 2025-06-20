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
export interface ISignUpRequest {
  email: string;
  password: string;
  isGoogleLogin?: boolean;
  resetOTP?: string | null;
  resetOTPExpiry?: Date | null;
  profileUrl?: string;
}
export interface ISignInRequest {
  email: string;
  password: string;
}
export interface AuthState {
  isLoggedIn: boolean
  isLoading: boolean
  isAuthLoading: boolean
  user: any | null
  token: string | null
  error: string | null
  email: string
  password: string
  keepLoggedIn: boolean
  showPassword: boolean
}

export interface SignInFormProps {
  email: string
  password: string
  keepLoggedIn: boolean
  showPassword: boolean
  isLoading: boolean
  error: string | null
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeepLoggedInChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTogglePassword: () => void
  onSubmit: (e: React.FormEvent) => void
  onForgotPasswordClick: () => void
}
export interface SocialSignInProps {
  onSignUpClick: () => void
  disabled?: boolean
}
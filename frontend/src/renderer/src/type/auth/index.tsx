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
  name: string,
  email: string;
  password: string;
  confirmPassword: string
  isGoogleLogin?: boolean;
  resetOTP?: string | null;
  resetOTPExpiry?: Date | null;
  profileUrl?: string;
}
export interface ISignInRequest {
  email: string;
  password: string;
}
export interface signInState {
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
  socialAuthError: string | null
  fieldErrors: {
    email?: string
    password?: string
  }
  isFormValid: boolean
}
export interface SignUpState {
  name: string
  email: string
  password: string
  confirmPassword: string
  showPassword: boolean
  showConfirmPassword: boolean
  isLoading: boolean
  fieldErrors: { name?: string; email?: string; password?: string; confirmPassword?: string }
  isFormValid: boolean
  error: string | null
  socialAuthError: string | null
}

export interface SignInFormProps {
  email: string
  password: string
  keepLoggedIn: boolean
  showPassword: boolean
  isLoading: boolean
  error: string | null
  fieldErrors: { email?: string; password?: string }
  isFormValid: boolean
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeepLoggedInChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTogglePassword: () => void
  onSubmit: (e: React.FormEvent) => void
  onForgotPasswordClick: () => void
  onFieldValidate: (field: string, value: string) => void
}

export interface SocialSignInProps {
  onSignUpClick: () => void
  disabled?: boolean
}
export interface SignUpFormProps {
  name: string
  email: string
  password: string
  confirmPassword: string
  showPassword: boolean
  showConfirmPassword: boolean
  isLoading: boolean
  error: string | null
  fieldErrors?: { name?: string; email?: string; password?: string; confirmPassword?: string }
  isFormValid: boolean
  onFieldValidate: (field: string, value: string, additionalValue?: string) => void
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTogglePassword: () => void
  onToggleConfirmPassword: () => void
  onSubmit: (e: React.FormEvent) => void
}
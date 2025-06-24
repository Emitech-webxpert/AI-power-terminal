export interface SocialLoginProps {
  mode: 'signin' | 'signup'
  onToggleClick: () => void
  disabled?: boolean
  onGoogleSuccess?: (result: any) => void
  onGoogleError?: (error: string) => void
}
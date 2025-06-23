export interface ValidationResult {
  isValid: boolean
  message: string
}

export interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const validation = {
  // Email validation
  email: (email: string): ValidationResult => {
    if (!email.trim()) {
      return { isValid: false, message: 'Email is required' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Please enter a valid email address' }
    }

    return { isValid: true, message: '' }
  },

  // Password validation
  password: (password: string): ValidationResult => {
    if (!password) {
      return { isValid: false, message: 'Password is required' }
    }

    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' }
    }

    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' }
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' }
    }

    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' }
    }

    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one special character' }
    }

    return { isValid: true, message: '' }
  },

  // Name validation
  name: (name: string): ValidationResult => {
    if (!name.trim()) {
      return { isValid: false, message: 'Name is required' }
    }

    if (name.trim().length < 2) {
      return { isValid: false, message: 'Name must be at least 2 characters long' }
    }

    if (name.trim().length > 50) {
      return { isValid: false, message: 'Name must be less than 50 characters' }
    }

    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return { isValid: false, message: 'Name can only contain letters and spaces' }
    }

    return { isValid: true, message: '' }
  },

  // Confirm password validation
  confirmPassword: (password: string, confirmPassword: string): ValidationResult => {
    if (!confirmPassword) {
      return { isValid: false, message: 'Please confirm your password' }
    }

    if (password !== confirmPassword) {
      return { isValid: false, message: 'Passwords do not match' }
    }

    return { isValid: true, message: '' }
  },

  // Validate entire SignIn form
  signInForm: (email: string, password: string): FormErrors => {
    const errors: FormErrors = {}

    const emailValidation = validation.email(email)
    if (!emailValidation.isValid) {
      errors.email = emailValidation.message
    }

    if (!password.trim()) {
      errors.password = 'Password is required'
    }

    return errors
  },

  // Validate entire SignUp form
  signUpForm: (name: string, email: string, password: string, confirmPassword: string): FormErrors => {
    const errors: FormErrors = {}

    const nameValidation = validation.name(name)
    if (!nameValidation.isValid) {
      errors.name = nameValidation.message
    }

    const emailValidation = validation.email(email)
    if (!emailValidation.isValid) {
      errors.email = emailValidation.message
    }

    const passwordValidation = validation.password(password)
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message
    }

    const confirmPasswordValidation = validation.confirmPassword(password, confirmPassword)
    if (!confirmPasswordValidation.isValid) {
      errors.confirmPassword = confirmPasswordValidation.message
    }

    return errors
  },

  // Check if form is valid (no errors)
  isFormValid: (errors: FormErrors): boolean => {
    return Object.keys(errors).length === 0
  }
}
export default validation
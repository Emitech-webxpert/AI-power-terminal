import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { signIn } from '@renderer/constants/services/Auth'
import { ISignInRequest, signInState } from '@renderer/type/auth'
import { validate } from '@renderer/utils'

export const signInUser = createAsyncThunk(
    'auth/signInUser',
    async (credentials: ISignInRequest, { rejectWithValue }) => {
        try {
            const response = await signIn(credentials)
            return response
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Sign in failed. Please try again.'
            return rejectWithValue(errorMessage)
        }
    }
)

const initialState: signInState = {
    isLoggedIn: false,
    isLoading: false,
    isAuthLoading: true,
    user: null,
    token: null,
    error: null,
    socialAuthError: null, // Add this field
    email: '',
    password: '',
    keepLoggedIn: false,
    showPassword: false,
    fieldErrors: {},
    isFormValid: false
}

export const checkAuthStatus = createAsyncThunk(
    'auth/checkAuthStatus',
    async (_, { rejectWithValue }) => {
        try {
            const authStatus = localStorage.getItem('isLoggedIn')
            const authToken = localStorage.getItem('authToken')
            const userData = localStorage.getItem('userData')

            if (authStatus === 'true' && authToken) {
                const parsedUserData = userData ? JSON.parse(userData) : null
                return {
                    isLoggedIn: true,
                    token: authToken,
                    user: parsedUserData
                }
            } else {
                // Clear invalid auth data
                if (authStatus === 'true' && !authToken) {
                    localStorage.removeItem('isLoggedIn')
                    localStorage.removeItem('authToken')
                    localStorage.removeItem('userData')
                }
                return {
                    isLoggedIn: false,
                    token: null,
                    user: null
                }
            }
        } catch (error) {
            console.error('Error checking auth:', error)
            return rejectWithValue('Error checking authentication status')
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Form field updates
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload
        },
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload
        },
        setKeepLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.keepLoggedIn = action.payload
        },
        toggleShowPassword: (state) => {
            state.showPassword = !state.showPassword
        },
        // Clear form
        clearForm: (state) => {
            state.email = ''
            state.password = ''
            state.keepLoggedIn = false
            state.showPassword = false
            state.error = null
            state.socialAuthError = null // Clear social auth error too
            state.fieldErrors = {}
            state.isFormValid = false
        },
        // Clear error
        clearError: (state) => {
            state.error = null
        },
        // Add social auth error actions
        setSocialAuthError: (state, action: PayloadAction<string>) => {
            state.socialAuthError = action.payload
        },
        clearSocialAuthError: (state) => {
            state.socialAuthError = null
        },
        clearAllErrors: (state) => {
            state.error = null
            state.socialAuthError = null
        },
        // Set auth loading
        setAuthLoading: (state, action: PayloadAction<boolean>) => {
            state.isAuthLoading = action.payload
        },
        // Reset auth state
        resetAuth: () => initialState,

        // NEW VALIDATION ACTIONS
        setFieldError: (state, action: PayloadAction<{ field: string; error: string }>) => {
            state.fieldErrors[action.payload.field] = action.payload.error
            // Update form validity when field errors change
            state.isFormValid = validate.isFormValid(state.fieldErrors)
        },
        clearFieldError: (state, action: PayloadAction<string>) => {
            delete state.fieldErrors[action.payload]
            // Update form validity when field errors change
            state.isFormValid = validate.isFormValid(state.fieldErrors)
        },
        clearAllFieldErrors: (state) => {
            state.fieldErrors = {}
            state.isFormValid = false
        },
        setFormValid: (state, action: PayloadAction<boolean>) => {
            state.isFormValid = action.payload
        },
        validateForm: (state) => {
            const errors = validate.signInForm(state.email, state.password)
            state.fieldErrors = errors
            state.isFormValid = validate.isFormValid(errors)
        },
        validateField: (state, action: PayloadAction<{ field: string; value: string }>) => {
            const { field, value } = action.payload
            let validationResult: { isValid: boolean; message: string } = { isValid: true, message: '' }

            if (field === 'email') {
                validationResult = validate.email(value)
            } else if (field === 'password') {
                // Only check if password exists, no complexity validation
                if (!value.trim()) {
                    validationResult = { isValid: false, message: 'Password is required' }
                } else {
                    validationResult = { isValid: true, message: '' }
                }
            }

            if (validationResult) {
                if (validationResult.isValid) {
                    delete state.fieldErrors[field]
                } else {
                    state.fieldErrors[field] = validationResult.message
                }

                // Update form validity
                state.isFormValid = validate.isFormValid(state.fieldErrors)
            }
        }
    },
    extraReducers: (builder) => {
        // Sign in user
        builder
            .addCase(signInUser.pending, (state) => {
                state.isLoading = true
                state.error = null
                state.socialAuthError = null // Clear social auth error on new request
            })
            .addCase(signInUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isLoggedIn = true
                state.user = action.payload.user || null
                state.token = action.payload.token || null
                state.error = null
                state.socialAuthError = null

                // Store in localStorage
                localStorage.setItem('isLoggedIn', 'true')
                if (action.payload.token) {
                    localStorage.setItem('authToken', action.payload.token)
                }
                if (action.payload.user) {
                    localStorage.setItem('userData', JSON.stringify(action.payload.user))
                }

                // Clear form and validation
                state.email = ''
                state.password = ''
                state.keepLoggedIn = false
                state.showPassword = false
                state.fieldErrors = {}
                state.isFormValid = false
            })
            .addCase(signInUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })

        // Check auth status
        builder
            .addCase(checkAuthStatus.pending, (state) => {
                state.isAuthLoading = true
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.isAuthLoading = false
                state.isLoggedIn = action.payload.isLoggedIn
                state.token = action.payload.token
                state.user = action.payload.user
            })
            .addCase(checkAuthStatus.rejected, (state, action) => {
                state.isAuthLoading = false
                state.isLoggedIn = false
                state.token = null
                state.user = null
                state.error = action.payload as string
            })
    }
})

// Export actions
export const {
    setEmail,
    setPassword,
    setKeepLoggedIn,
    toggleShowPassword,
    clearForm,
    clearError,
    setSocialAuthError,
    clearSocialAuthError,
    clearAllErrors,
    setAuthLoading,
    resetAuth,
    // NEW VALIDATION ACTIONS
    setFieldError,
    clearFieldError,
    clearAllFieldErrors,
    setFormValid,
    validateForm,
    validateField
} = authSlice.actions

// Selectors
export const selectAuth = (state: { auth: signInState }) => state.auth
export const selectIsLoggedIn = (state: { auth: signInState }) => state.auth.isLoggedIn
export const selectIsLoading = (state: { auth: signInState }) => state.auth.isLoading
export const selectIsAuthLoading = (state: { auth: signInState }) => state.auth.isAuthLoading
export const selectUser = (state: { auth: signInState }) => state.auth.user
export const selectToken = (state: { auth: signInState }) => state.auth.token
export const selectError = (state: { auth: signInState }) => state.auth.error
export const selectSocialAuthError = (state: { auth: signInState }) => state.auth.socialAuthError // Add this selector
export const selectEmail = (state: { auth: signInState }) => state.auth.email
export const selectPassword = (state: { auth: signInState }) => state.auth.password
export const selectKeepLoggedIn = (state: { auth: signInState }) => state.auth.keepLoggedIn
export const selectShowPassword = (state: { auth: signInState }) => state.auth.showPassword

// NEW VALIDATION SELECTORS
export const selectFieldErrors = (state: { auth: signInState }) => state.auth.fieldErrors
export const selectIsFormValid = (state: { auth: signInState }) => state.auth.isFormValid
export const selectEmailError = (state: { auth: signInState }) => state.auth.fieldErrors.email
export const selectPasswordError = (state: { auth: signInState }) => state.auth.fieldErrors.password

export default authSlice.reducer
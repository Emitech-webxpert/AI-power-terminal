import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { signUp } from '@renderer/constants/services/Auth'
import { ISignUpRequest, SignUpState } from '@renderer/type/auth'
import { validate } from '@renderer/utils'

export const signUpUser = createAsyncThunk(
    'auth/signUpUser',
    async (credentials: ISignUpRequest, { rejectWithValue }) => {
        try {
            const response = await signUp(credentials)
            return response
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Sign up failed. Please try again.'
            return rejectWithValue(errorMessage)
        }
    }
)

const initialState: SignUpState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    isLoading: false,
    error: null,
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

const signUpSlice = createSlice({
    name: 'signUp',
    initialState,
    reducers: {
        setSignUpName: (state, action: PayloadAction<string>) => {
            state.name = action.payload
        },
        setSignUpEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload
        },
        setSignUpPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload
        },
        setSignUpConfirmPassword: (state, action: PayloadAction<string>) => {
            state.confirmPassword = action.payload
        },
        toggleSignUpShowPassword: (state) => {
            state.showPassword = !state.showPassword
        },
        toggleSignUpShowConfirmPassword: (state) => {
            state.showConfirmPassword = !state.showConfirmPassword
        },
        clearSignUpForm: (state) => {
            state.name = ''
            state.email = ''
            state.password = ''
            state.confirmPassword = ''
            state.showPassword = false
            state.showConfirmPassword = false
            state.error = null
            state.fieldErrors = {}
            state.isFormValid = false
        },
        clearSignUpError: (state) => {
            state.error = null
        },
        
        // NEW VALIDATION ACTIONS
        setSignUpFieldError: (state, action: PayloadAction<{ field: string; error: string }>) => {
            state.fieldErrors[action.payload.field] = action.payload.error
            state.isFormValid = validate.isFormValid(state.fieldErrors)
        },
        clearSignUpFieldError: (state, action: PayloadAction<string>) => {
            delete state.fieldErrors[action.payload]
            state.isFormValid = validate.isFormValid(state.fieldErrors)
        },
        clearAllSignUpFieldErrors: (state) => {
            state.fieldErrors = {}
            state.isFormValid = false
        },
        setSignUpFormValid: (state, action: PayloadAction<boolean>) => {
            state.isFormValid = action.payload
        },
        validateSignUpForm: (state) => {
            const errors = validate.signUpForm(state.name, state.email, state.password, state.confirmPassword)
            state.fieldErrors = errors
            state.isFormValid = validate.isFormValid(errors)
        },
        validateSignUpField: (state, action: PayloadAction<{ field: string; value: string; additionalValue?: string }>) => {
            const { field, value, additionalValue } = action.payload
            let validationResult
            
            if (field === 'name') {
                validationResult = validate.name(value)
            } else if (field === 'email') {
                validationResult = validate.email(value)
            } else if (field === 'password') {
                validationResult = validate.password(value)
            } else if (field === 'confirmPassword') {
                validationResult = validate.confirmPassword(additionalValue || state.password, value)
            }
            
            if (validationResult) {
                if (validationResult.isValid) {
                    delete state.fieldErrors[field]
                } else {
                    state.fieldErrors[field] = validationResult.message
                }
                
                state.isFormValid = validate.isFormValid(state.fieldErrors)
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signUpUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.error = null
                // Clear form and validation on success
                state.name = ''
                state.email = ''
                state.password = ''
                state.confirmPassword = ''
                state.showPassword = false
                state.showConfirmPassword = false
                state.fieldErrors = {}
                state.isFormValid = false
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    }
})

export const {
    setSignUpName,
    setSignUpEmail,
    setSignUpPassword,
    setSignUpConfirmPassword,
    toggleSignUpShowPassword,
    toggleSignUpShowConfirmPassword,
    clearSignUpForm,
    clearSignUpError,
    // NEW VALIDATION ACTIONS
    setSignUpFieldError,
    clearSignUpFieldError,
    clearAllSignUpFieldErrors,
    setSignUpFormValid,
    validateSignUpForm,
    validateSignUpField
} = signUpSlice.actions

// Selectors
export const selectSignUpState = (state: { signUp: SignUpState }) => state.signUp
export const selectSignUpName = (state: { signUp: SignUpState }) => state.signUp.name
export const selectSignUpEmail = (state: { signUp: SignUpState }) => state.signUp.email
export const selectSignUpPassword = (state: { signUp: SignUpState }) => state.signUp.password
export const selectSignUpConfirmPassword = (state: { signUp: SignUpState }) => state.signUp.confirmPassword
export const selectSignUpShowPassword = (state: { signUp: SignUpState }) => state.signUp.showPassword
export const selectSignUpShowConfirmPassword = (state: { signUp: SignUpState }) => state.signUp.showConfirmPassword
export const selectSignUpIsLoading = (state: { signUp: SignUpState }) => state.signUp.isLoading
export const selectSignUpError = (state: { signUp: SignUpState }) => state.signUp.error

// NEW VALIDATION SELECTORS
export const selectSignUpFieldErrors = (state: { signUp: SignUpState }) => state.signUp.fieldErrors
export const selectSignUpIsFormValid = (state: { signUp: SignUpState }) => state.signUp.isFormValid
export const selectSignUpNameError = (state: { signUp: SignUpState }) => state.signUp.fieldErrors.name
export const selectSignUpEmailError = (state: { signUp: SignUpState }) => state.signUp.fieldErrors.email
export const selectSignUpPasswordError = (state: { signUp: SignUpState }) => state.signUp.fieldErrors.password
export const selectSignUpConfirmPasswordError = (state: { signUp: SignUpState }) => state.signUp.fieldErrors.confirmPassword

export default signUpSlice.reducer
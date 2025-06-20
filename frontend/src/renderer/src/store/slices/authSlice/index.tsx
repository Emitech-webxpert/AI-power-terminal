import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { signIn } from '@renderer/constants/services/Auth'
import { ISignInRequest, AuthState } from '@renderer/type/authTypes'


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
const initialState: AuthState = {
    isLoggedIn: false,
    isLoading: false,
    isAuthLoading: true,
    user: null,
    token: null,
    error: null,
    email: '',
    password: '',
    keepLoggedIn: false,
    showPassword: false
}



// Async thunk for checking auth status - INSIDE THE SLICE FILE
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
        },
        // Clear error
        clearError: (state) => {
            state.error = null
        },
        // Set auth loading
        setAuthLoading: (state, action: PayloadAction<boolean>) => {
            state.isAuthLoading = action.payload
        },
        // Reset auth state
        resetAuth: () => initialState
    },
    extraReducers: (builder) => {
        // Sign in user
        builder
            .addCase(signInUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(signInUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isLoggedIn = true
                state.user = action.payload.user || null
                state.token = action.payload.token || null
                state.error = null

                // Store in localStorage
                localStorage.setItem('isLoggedIn', 'true')
                if (action.payload.token) {
                    localStorage.setItem('authToken', action.payload.token)
                }
                if (action.payload.user) {
                    localStorage.setItem('userData', JSON.stringify(action.payload.user))
                }

                // Clear form
                state.email = ''
                state.password = ''
                state.keepLoggedIn = false
                state.showPassword = false
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
    setAuthLoading,
    resetAuth
} = authSlice.actions

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth
export const selectIsLoggedIn = (state: { auth: AuthState }) => state.auth.isLoggedIn
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading
export const selectIsAuthLoading = (state: { auth: AuthState }) => state.auth.isAuthLoading
export const selectUser = (state: { auth: AuthState }) => state.auth.user
export const selectToken = (state: { auth: AuthState }) => state.auth.token
export const selectError = (state: { auth: AuthState }) => state.auth.error
export const selectEmail = (state: { auth: AuthState }) => state.auth.email
export const selectPassword = (state: { auth: AuthState }) => state.auth.password
export const selectKeepLoggedIn = (state: { auth: AuthState }) => state.auth.keepLoggedIn
export const selectShowPassword = (state: { auth: AuthState }) => state.auth.showPassword

export default authSlice.reducer
// src/renderer/store/slices/socialLoginSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Export the interface so TypeScript can find it
export interface SocialLoginState {
  isGoogleLoading: boolean
  isTeamsLoading: boolean
}

const initialState: SocialLoginState = {
  isGoogleLoading: false,
  isTeamsLoading: false
}

const socialLoginSlice = createSlice({
  name: 'socialLogin',
  initialState,
  reducers: {
    // Google loading states
    setGoogleLoading: (state, action: PayloadAction<boolean>) => {
      state.isGoogleLoading = action.payload
    },
    // Teams loading states
    setTeamsLoading: (state, action: PayloadAction<boolean>) => {
      state.isTeamsLoading = action.payload
    },
    // Reset all loading states
    resetLoadingStates: (state) => {
      state.isGoogleLoading = false
      state.isTeamsLoading = false
    }
  }
})

export const {
  setGoogleLoading,
  setTeamsLoading,
  resetLoadingStates
} = socialLoginSlice.actions

// Selectors
export const selectIsGoogleLoading = (state: { socialLogin: SocialLoginState }) => state.socialLogin.isGoogleLoading
export const selectIsTeamsLoading = (state: { socialLogin: SocialLoginState }) => state.socialLogin.isTeamsLoading
export const selectSocialLoginState = (state: { socialLogin: SocialLoginState }) => state.socialLogin

export default socialLoginSlice.reducer
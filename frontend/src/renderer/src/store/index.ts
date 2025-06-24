import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './slices/themeSlice'
import terminalReducer from './slices/terminalSlice'
import sessionWizardReducer from './slices/sessionwizardSlice'
import sessionListReducer from './slices/sessionList'
import AuthReducer from './slices/authSlice/signIn'
import signUpReducer from "./slices/authSlice/signUp"
import socialLoginReducer from './slices/authSlice/socialLogin'


export const store = configureStore({
  reducer: {
    theme: themeReducer,
    terminal: terminalReducer,
    sessionWizard: sessionWizardReducer,
    sessionList: sessionListReducer,
    auth: AuthReducer,
    signUp: signUpReducer,
    socialLogin: socialLoginReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
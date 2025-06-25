import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './slices/theme'
import terminalReducer from './slices/terminal'
import sessionWizardReducer from './slices/sessionwizard'
import sessionListReducer from './slices/sessionList'
import AuthReducer from './slices/auth/signIn'
import signUpReducer from "./slices/auth/signUp"
import socialLoginReducer from './slices/auth/socialLogin'
import navbarReducer from './slices/navbarSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    terminal: terminalReducer,
    sessionWizard: sessionWizardReducer,
    sessionList: sessionListReducer,
    auth: AuthReducer,
    signUp: signUpReducer,
    socialLogin: socialLoginReducer,
    navBar: navbarReducer
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
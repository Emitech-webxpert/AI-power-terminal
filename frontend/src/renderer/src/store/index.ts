import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './slices/themeSlice'
import terminalReducer from './slices/terminalSlice'
import sessionWizardReducer from './slices/sessionwizardSlice'
import sessionListReducer from './slices/sessionList' 

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    terminal: terminalReducer,
    sessionWizard: sessionWizardReducer,
    sessionList: sessionListReducer 
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
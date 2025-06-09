import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './slices/themeSlice'  
import terminalReducer from './slices/terminalSlice' 

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    terminal: terminalReducer,
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
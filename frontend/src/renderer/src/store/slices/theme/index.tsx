import { createSlice } from '@reduxjs/toolkit'
import type { ThemeState } from '@renderer/type/terminal'
const initialState: ThemeState = {
  isDark: true
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark
    }
  }
})

export const { toggleTheme } = themeSlice.actions
export const selectIsDark = (state: { theme: ThemeState }) => state.theme.isDark
export default themeSlice.reducer
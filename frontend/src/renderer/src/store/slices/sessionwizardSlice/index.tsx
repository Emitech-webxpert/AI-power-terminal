import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SessionData } from '@renderer/type/sshSession'


const initialState: SessionData = {
    userId: '4c1ebc55-77a1-4014-af43-eac5915bc567',
    protocol: '',
    host: '',
    port: '',
    username: '',
    sessionName: '',
    description: '',
    step: 1,
    visible: false

}

const sessionWizardSlice = createSlice({
  name: 'sessionWizard',
  initialState,
  reducers: {
    updateField: (
      state,
      action: PayloadAction<{ field: keyof SessionData; value: string | number | boolean }>
    ) => {
      const { field, value } = action.payload
      state[field] = value as never
    },
    resetSessionWizard: () => initialState
  }
})

export const { updateField, resetSessionWizard } = sessionWizardSlice.actions

// Selectors (match your pattern)
export const selectSessionWizard = (state: { sessionWizard: SessionData }) => state?.sessionWizard

export default sessionWizardSlice.reducer

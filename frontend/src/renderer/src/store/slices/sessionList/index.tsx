import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { SessionList } from '@renderer/type/sshSession'
import { getAllSessions } from '@renderer/constants/services/sshConnection'

export const fetchSessions = createAsyncThunk(
  'sessionList/fetchSessions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllSessions()
      const sessionsData = response.data || []
      return sessionsData
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sessions')
    }
  }
)

const initialState: SessionList = {
  isSessionsExpanded: true,
  isSessionsExpandedInner: true,
  isSessionWizadOpen: false,
  isQuickConnectOpen: false,
  isDuplicateOpen: false,
  isSessionContextOpen: false,
  isSessionContextOpenFile: false,
  selectedFileId: null,
  isRenameOpen: false,
  isDeleteOpen: false,
  deleteTitle: '',
  sessions: [],
  loading: false,
  error: null
}

const sessionListSlice = createSlice({
  name: 'sessionList',
  initialState,
  reducers: {
    updateField: (
      state,
      action: PayloadAction<{ field: keyof SessionList; value: string | boolean | null }>
    ) => {
      const { field, value } = action.payload
      state[field] = value as never
    },
    // Helper actions for complex operations
    toggleSessionsExpanded: (state) => {
      state.isSessionsExpanded = !state.isSessionsExpanded
    },
    toggleSessionsExpandedInner: (state) => {
      state.isSessionsExpandedInner = !state.isSessionsExpandedInner
    },
    openSessionWizard: (state) => {
      state.isSessionWizadOpen = true
      state.isSessionContextOpen = false
    },
    closeSessionWizard: (state) => {
      state.isSessionWizadOpen = false
    },
    openQuickConnect: (state) => {
      state.isQuickConnectOpen = true
      state.isSessionContextOpen = false
    },
    closeQuickConnect: (state) => {
      state.isQuickConnectOpen = false
    },
    openDuplicate: (state) => {
      state.isDuplicateOpen = true
      state.isSessionContextOpenFile = false
    },
    closeDuplicate: (state) => {
      state.isDuplicateOpen = false
    },
    openSessionContext: (state) => {
      state.isSessionContextOpen = true
    },
    closeSessionContext: (state) => {
      state.isSessionContextOpen = false
    },
    openSessionContextFile: (state, action: PayloadAction<string>) => {
      state.isSessionContextOpenFile = true
      state.selectedFileId = action.payload
    },
    closeSessionContextFile: (state) => {
      state.isSessionContextOpenFile = false
      state.selectedFileId = null
    },
    openRename: (state) => {
      state.isRenameOpen = true
      state.isSessionContextOpen = false
      state.isSessionContextOpenFile = false
    },
    closeRename: (state) => {
      state.isRenameOpen = false
    },
    openDelete: (state, action: PayloadAction<string>) => {
      state.deleteTitle = action.payload
      state.isDeleteOpen = true
      state.isSessionContextOpen = false
      state.isSessionContextOpenFile = false
    },
    closeDelete: (state) => {
      state.isDeleteOpen = false
      state.deleteTitle = ''
    },
    clearError: (state) => {
      state.error = null
    },
    resetSessionList: () => initialState
  },
  // Handle fetchSessions async thunk
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false
        state.sessions = action.payload
        state.error = null
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const {
  updateField,
  toggleSessionsExpanded,
  toggleSessionsExpandedInner,
  openSessionWizard,
  closeSessionWizard,
  openQuickConnect,
  closeQuickConnect,
  openDuplicate,
  closeDuplicate,
  openSessionContext,
  closeSessionContext,
  openSessionContextFile,
  closeSessionContextFile,
  openRename,
  closeRename,
  openDelete,
  closeDelete,
  clearError,
  resetSessionList
} = sessionListSlice.actions

// Root selector
export const selectSessionList = (state: { sessionList: SessionList }) => state?.sessionList

// Individual property selectors
export const selectIsSessionsExpanded = (state: { sessionList: SessionList }) =>
  state.sessionList.isSessionsExpanded

export const selectIsSessionsExpandedInner = (state: { sessionList: SessionList }) =>
  state.sessionList.isSessionsExpandedInner

export const selectIsSessionWizadOpen = (state: { sessionList: SessionList }) =>
  state.sessionList.isSessionWizadOpen

export const selectIsQuickConnectOpen = (state: { sessionList: SessionList }) =>
  state.sessionList.isQuickConnectOpen

export const selectIsDuplicateOpen = (state: { sessionList: SessionList }) =>
  state.sessionList.isDuplicateOpen

export const selectIsSessionContextOpen = (state: { sessionList: SessionList }) =>
  state.sessionList.isSessionContextOpen

export const selectIsSessionContextOpenFile = (state: { sessionList: SessionList }) =>
  state.sessionList.isSessionContextOpenFile

export const selectSelectedFileId = (state: { sessionList: SessionList }) =>
  state.sessionList.selectedFileId

export const selectIsRenameOpen = (state: { sessionList: SessionList }) =>
  state.sessionList.isRenameOpen

export const selectIsDeleteOpen = (state: { sessionList: SessionList }) =>
  state.sessionList.isDeleteOpen

export const selectDeleteTitle = (state: { sessionList: SessionList }) =>
  state.sessionList.deleteTitle

export const selectSessions = (state: { sessionList: SessionList }) => 
  state.sessionList.sessions

export const selectSessionsLoading = (state: { sessionList: SessionList }) => 
  state.sessionList.loading

export const selectSessionsError = (state: { sessionList: SessionList }) => 
  state.sessionList.error

export default sessionListSlice.reducer
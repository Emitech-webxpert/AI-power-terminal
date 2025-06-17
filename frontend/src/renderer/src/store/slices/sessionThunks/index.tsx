import { createAsyncThunk } from '@reduxjs/toolkit'
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
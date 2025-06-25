import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Terminal, TerminalState } from '@renderer/type/terminal'


const initialState: TerminalState = {
    terminals: [],
    activeTerminalId: null
}

const terminalSlice = createSlice({
    name: 'terminal',
    initialState,

    reducers: {
        addTerminal: (state, action: PayloadAction<Terminal>) => {
            state.terminals.push(action.payload)
            state.activeTerminalId = action.payload.id
        },

        removeTerminal: (state, action: PayloadAction<string>) => {
            const terminalId = action.payload

            state.terminals = state.terminals.filter(t => t.id !== terminalId)

            if (state.activeTerminalId === terminalId) {
                state.activeTerminalId = state.terminals.length > 0 ? state.terminals[0].id : null
            }
        },

        setActiveTerminal: (state, action: PayloadAction<string>) => {
            state.activeTerminalId = action.payload
        },

        updateTerminalTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
            const { id, title } = action.payload

            const terminal = state.terminals.find(t => t.id === id)
            if (terminal) {
                terminal.title = title
            }
        },

        // New action to add SSH terminal
        addSSHTerminal: (state, action: PayloadAction<{
            id: string
            title: string
            sshParams: {
                host: string
                username: string
                port: number
                protocol?: string
            }
        }>) => {
            const { id, title, sshParams } = action.payload
            const newTerminal: Terminal = {
                id,
                title,
                type: 'ssh',
                sshParams
            }
            state.terminals.push(newTerminal)
            state.activeTerminalId = id
        }
    }
})

export const {
    addTerminal,
    removeTerminal,
    setActiveTerminal,
    updateTerminalTitle,
    addSSHTerminal
} = terminalSlice.actions

export const selectTerminals = (state: { terminal: TerminalState }) => state.terminal.terminals
export const selectActiveTerminalId = (state: { terminal: TerminalState }) => state.terminal.activeTerminalId
export const selectActiveTerminal = (state: { terminal: TerminalState }) => {
    const { terminals, activeTerminalId } = state.terminal
    return terminals.find(t => t.id === activeTerminalId) || null
}

export const selectTerminalById = (state: { terminal: TerminalState }, terminalId: string) => {
    return state.terminal.terminals.find(t => t.id === terminalId) || null
}

export default terminalSlice.reducer
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
        }
    }
})

export const {
    addTerminal,
    removeTerminal,
    setActiveTerminal,
    updateTerminalTitle
} = terminalSlice.actions

export const selectTerminals = (state: { terminal: TerminalState }) => state.terminal.terminals
export const selectActiveTerminalId = (state: { terminal: TerminalState }) => state.terminal.activeTerminalId
export const selectActiveTerminal = (state: { terminal: TerminalState }) => {
    const { terminals, activeTerminalId } = state.terminal
    return terminals.find(t => t.id === activeTerminalId) || null
}

export default terminalSlice.reducer
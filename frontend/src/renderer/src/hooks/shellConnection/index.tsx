import { useEffect, useRef } from 'react'
import { Terminal } from 'xterm'
import { useTitleExtractor } from '@renderer/hooks'
import type { TerminalAPI } from '@renderer/type/terminal'

const useShellOutput = (
    terminal: Terminal | null,
    onTitleChange?: (title: string) => void,
    onClose?: () => void
) => {
    const terminalIdRef = useRef<string | null>(null)
    const cleanupFunctionsRef = useRef<(() => void)[]>([])
    const extractTitle = useTitleExtractor(onTitleChange)

    // Get terminal API with proper typing using the interface
    const terminalAPI: TerminalAPI = ((window as unknown) as { api: { terminal: TerminalAPI } }).api.terminal

    useEffect(() => {
        if (!terminal) return

        // Handle user input
        const inputHandler = terminal.onData((data) => {
            if (terminalIdRef.current) {
                terminalAPI.writeToTerminal(terminalIdRef.current, data)
            }
        })

        // Connect to shell
        connectToShell(terminal)

        return () => {
            cleanupFunctionsRef.current.forEach(cleanup => cleanup())
            inputHandler.dispose()

            if (terminalIdRef.current) {
                terminalAPI.closeTerminal(terminalIdRef.current)
            }
        }
    }, [terminal])

    const connectToShell = async (term: Terminal) => {
        try {
            if (onTitleChange) onTitleChange('Connecting...')

            const result = await terminalAPI.createTerminal()

            if (result.success && result.terminalId) {
                terminalIdRef.current = result.terminalId
                if (onTitleChange) onTitleChange('Connected')

                // Initial size notification
                setTimeout(() => {
                    if (term && terminalIdRef.current) {
                        terminalAPI.resizeTerminal(terminalIdRef.current, term.cols, term.rows)
                    }
                }, 200)

                // Listen for shell output
                const dataCleanup = terminalAPI.onTerminalData((id: string, data: string) => {
                    if (id === result.terminalId) {
                        term.write(data)
                        extractTitle(data) // Extract title from output
                    }
                })

                // Listen for shell exit
                const exitCleanup = terminalAPI.onTerminalExit((id: string, exitCode: number) => {
                    if (id === result.terminalId) {
                        term.writeln(`\r\n💀 Shell exited with code: ${exitCode}`)
                        terminalIdRef.current = null

                        if (onTitleChange) onTitleChange('Disconnected')
                        if (onClose) setTimeout(onClose, 1000)
                    }
                })

                cleanupFunctionsRef.current.push(dataCleanup, exitCleanup)

            } else {
                term.writeln('❌ Failed to connect to shell')
                term.writeln('🐛 Error: ' + (result.error || 'Unknown error'))
                if (onTitleChange) onTitleChange('Connection Failed')
            }
        } catch (error) {
            term.writeln('💥 Connection error occurred')
            console.error('Shell connection error:', error)
            if (onTitleChange) onTitleChange('Connection Error')
        }
    }

    return { terminalId: terminalIdRef.current }
}

export default useShellOutput
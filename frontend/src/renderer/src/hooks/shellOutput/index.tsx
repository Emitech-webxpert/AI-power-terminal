import { useEffect, useRef } from 'react'
import { Terminal } from 'xterm'
import { useTitleExtractor } from '@renderer/hooks'
import type { TerminalAPI, SSHParams } from '@renderer/type/terminal'


const useShellOutput = (
    terminal: Terminal | null,
    terminalType: 'local' | 'ssh',
    sshParams?: SSHParams,
    onTitleChange?: (title: string) => void,
    onClose?: () => void
) => {
    const terminalIdRef = useRef<string | null>(null)
    const cleanupFunctionsRef = useRef<(() => void)[]>([])

    // Only use title extractor for local terminals
    const extractTitle = useTitleExtractor(
        terminalType === 'local' ? onTitleChange : undefined,
        terminalType
    )

    // Get terminal API with proper typing
    const terminalAPI: TerminalAPI = ((window as unknown) as { api: { terminal: TerminalAPI } }).api.terminal

    useEffect(() => {
        if (!terminal) return

        // Handle user input
        const inputHandler = terminal.onData((data) => {
            if (terminalIdRef.current) {
                terminalAPI.writeToTerminal(terminalIdRef.current, data)
            }
        })

        // Connect based on terminal type
        if (terminalType === 'ssh' && sshParams) {
            connectToSSH(terminal, sshParams)
        } else {
            connectToShell(terminal)
        }

        return () => {
            cleanupFunctionsRef.current.forEach(cleanup => cleanup())
            inputHandler.dispose()

            if (terminalIdRef.current) {
                terminalAPI.closeTerminal(terminalIdRef.current)
            }
        }
    }, [terminal, terminalType, sshParams])

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
                        extractTitle(data) // Extract title from output for local terminals only
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

    const connectToSSH = async (term: Terminal, params: SSHParams) => {
        try {
            // For SSH, we don't set "Connecting..." title - let server handle it naturally

            const result = await terminalAPI.createTerminal({
                type: 'ssh',
                host: params.host,
                username: params.username,
                port: params.port,
                protocol: params.protocol
            })

            if (result.success && result.terminalId) {
                terminalIdRef.current = result.terminalId

                // Initial size notification
                setTimeout(() => {
                    if (term && terminalIdRef.current) {
                        terminalAPI.resizeTerminal(terminalIdRef.current, term.cols, term.rows)
                    }
                }, 200)

                // Listen for SSH output
                const dataCleanup = terminalAPI.onTerminalData((id: string, data: string) => {
                    if (id === result.terminalId) {
                        term.write(data)

                        // Handle SSH authentication prompts
                        if (data.includes('password:') || data.includes('Password:')) {
                            // TODO: Show password modal
                            console.log('SSH Password required')
                        }

                        if (data.includes('(yes/no)') || data.includes('fingerprint')) {
                            // TODO: Show host verification modal
                            console.log('SSH Host verification required')
                        }

                        // No title extraction for SSH - let server handle naturally
                    }
                })

                // Listen for SSH exit
                const exitCleanup = terminalAPI.onTerminalExit((id: string, exitCode: number) => {
                    if (id === result.terminalId) {
                        term.writeln(`\r\n💀 SSH connection closed with code: ${exitCode}`)
                        terminalIdRef.current = null

                        if (onTitleChange) onTitleChange('SSH Disconnected')
                        if (onClose) setTimeout(onClose, 1000)
                    }
                })

                cleanupFunctionsRef.current.push(dataCleanup, exitCleanup)

            } else {
                term.writeln('❌ Failed to establish SSH connection')
                term.writeln('🐛 Error: ' + (result.error || 'Unknown error'))
                if (onTitleChange) onTitleChange('SSH Connection Failed')
            }
        } catch (error) {
            term.writeln('💥 SSH connection error occurred')
            console.error('SSH connection error:', error)
            if (onTitleChange) onTitleChange('SSH Connection Error')
        }
    }

    return { terminalId: terminalIdRef.current }
}

export default useShellOutput
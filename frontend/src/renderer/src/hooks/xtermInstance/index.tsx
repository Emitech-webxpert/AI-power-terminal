import { useEffect, useRef, useState } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from '@xterm/addon-fit'
import { getTerminalConfig } from '@renderer/utils/index'

const useXtermInstance = (terminalRef: React.RefObject<HTMLDivElement | null>) => {
    const [terminal, setTerminal] = useState<Terminal | null>(null)
    const fitAddonRef = useRef<FitAddon | null>(null)

    useEffect(() => {
        if (!terminalRef.current) return

        // Create terminal with config
        const term = new Terminal(getTerminalConfig())

        // Create and add FitAddon
        const fitAddon = new FitAddon()
        term.loadAddon(fitAddon)
        fitAddonRef.current = fitAddon

        // Open terminal
        term.open(terminalRef.current)

        // Initial fit with delay
        setTimeout(() => {
            try {
                fitAddon.fit()
            } catch (error) {
                console.warn('Initial fit failed:', error)
            }
        }, 100)

        term.focus()
        setTerminal(term)

        // Handle window resize
        let resizeTimeout: NodeJS.Timeout
        const handleResize = () => {
            clearTimeout(resizeTimeout)
            resizeTimeout = setTimeout(() => {
                try {
                    if (fitAddon && terminalRef.current) {
                        fitAddon.fit()
                        // Notify backend about resize if connected
                        // This will be handled by useShellOutput hook
                    }
                } catch (error) {
                    console.warn('Resize handling failed:', error)
                }
            }, 150)
        }

        window.addEventListener('resize', handleResize)

        // Click to focus
        const handleClick = () => {
            term.focus()
        }

        if (terminalRef.current) {
            terminalRef.current.addEventListener('click', handleClick)
        }

        // Cleanup
        return () => {
            clearTimeout(resizeTimeout)
            window.removeEventListener('resize', handleResize)
            
            if (terminalRef.current) {
                terminalRef.current.removeEventListener('click', handleClick)
            }
            
            term.dispose()
        }
    }, [])

    return {
        terminal,
        fitAddon: fitAddonRef.current
    }
}

export default useXtermInstance
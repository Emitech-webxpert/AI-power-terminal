const getTerminalConfig = () => ({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: 'Consolas, "Courier New", monospace',
    theme: {
        background: '#1e1e1e',
        foreground: '#ffffff',
        cursor: '#ffffff'
    },
    convertEol: true
})

export default getTerminalConfig
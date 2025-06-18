export interface TerminalAPI {
  createTerminal: (connectionParams?: {
    type: 'ssh'
    host: string
    username: string
    port: number
    protocol?: string
  }) => Promise<{
    success: boolean
    terminalId?: string
    error?: string
  }>
  writeToTerminal: (terminalId: string, data: string) => void
  resizeTerminal: (terminalId: string, cols: number, rows: number) => void
  closeTerminal: (terminalId: string) => void
  onTerminalData: (callback: (id: string, data: string) => void) => () => void
  onTerminalExit: (callback: (id: string, exitCode: number) => void) => () => void
}

export interface SSHParams {
  host: string
  username: string
  port: number
  protocol?: string
}

export interface Terminal {
  id: string
  title: string
  type: 'local' | 'ssh'
  sshParams?: {
    host: string
    username: string
    port: number
    protocol?: string
  }
}

export interface TerminalState {
  terminals: Terminal[]
  activeTerminalId: string | null
}

export interface ThemeState {
  isDark: boolean
}

export interface TerminalComponentProps {
  terminalId: string
  terminalType: 'local' | 'ssh'
  sshParams?: {
    host: string
    username: string
    port: number
    protocol?: string
  }
  onClose?: () => void
  onTitleChange?: (title: string) => void
}
export interface TerminalTabsProps {
  className?: string
  style?: React.CSSProperties
}
export interface TerminalProps {
  className?: string
  style?: React.CSSProperties

}

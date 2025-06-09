export interface TerminalAPI {
  createTerminal: () => Promise<{ success: boolean; terminalId?: string; error?: string }>
  writeToTerminal: (terminalId: string, data: string) => Promise<{ success: boolean }>
  resizeTerminal: (terminalId: string, cols: number, rows: number) => Promise<{ success: boolean }>
  closeTerminal: (terminalId: string) => Promise<{ success: boolean }>
  onTerminalData: (callback: (terminalId: string, data: string) => void) => () => void
  onTerminalExit: (callback: (terminalId: string, exitCode: number) => void) => () => void
}

export interface Terminal {
  id: string
  title: string
}

export interface TerminalState {
  terminals: Terminal[]
  activeTerminalId: string | null
}

export interface ThemeState {
  isDark: boolean
}

export interface TerminalComponentProps {
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

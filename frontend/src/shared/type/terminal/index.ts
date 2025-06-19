export interface CreateTerminalOptions {
  type?: 'local' | 'ssh' | 'telnet'
  protocol?: 'SSH2' | 'Telnet' | 'LocalTerminal'
  host?: string
  username?: string
  port?: number
}

export interface TerminalResponse {
  success: boolean
  terminalId?: string
  error?: string
}
export interface SSHParams {
  host: string
  username: string
  port: number
}
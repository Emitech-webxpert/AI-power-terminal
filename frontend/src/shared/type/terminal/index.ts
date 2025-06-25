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

export interface BasicResponse {
  success: boolean
  error?: string
}

export interface SSHPasswordData {
  hostname: string
  username: string
}

export interface SSHHostKeyData {
  hostname: string
  hostKey: string
}

// ADD ONLY THESE NEW ONES:

// Modal state interfaces (extend existing data structures)
export interface SSHPasswordModalState {
  isOpen: boolean
  terminalId: string
  hostname: string
  username: string
}

export interface HostKeyModalState {
  isOpen: boolean
  terminalId: string
  hostname: string
  hostKey: string
}

// Connection params (reuse your existing structure)
export interface ConnectionParams {
  protocol: 'SSH2' | 'Telnet'
  host: string
  username?: string
  port: number
}

// Initial states (use your existing interfaces)
export const initialSSHPasswordModalState: SSHPasswordModalState = {
  isOpen: false,
  terminalId: '',
  hostname: '',
  username: ''
}

export const initialHostKeyModalState: HostKeyModalState = {
  isOpen: false,
  terminalId: '',
  hostname: '',
  hostKey: ''
}
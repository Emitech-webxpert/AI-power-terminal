export interface SSHParams {
  host: string
  username: string
  port: number
}

export interface PtyProcess {
  onData(callback: (data: string) => void): void
  onExit(callback: (data: { exitCode: number }) => void): void
  write(data: string): void
  resize(cols: number, rows: number): void
  kill(): void
}

export interface SSHClient {
  connect(config: object): void
  shell(callback: (err: Error | null, stream?: SSHStream) => void): void
  on(event: string, callback: (...args: unknown[]) => void): void
  end(): void
}

export interface SSHStream {
  on(event: string, callback: (...args: unknown[]) => void): void
  write(data: string): void
  end(): void
  setWindow(rows: number, cols: number, height: number, width: number): void
}

export interface TelnetConnection {
  connect(params: object): Promise<void>
  on(event: string, callback: (...args: unknown[]) => void): void
  send(data: string): void
  end(): void
}

export interface WindowWebContents {
  send(channel: string, ...args: unknown[]): void
}

export interface ElectronWindow {
  webContents: WindowWebContents
}

export interface Terminal {
  id: string
  type: 'local' | 'ssh' | 'telnet'
  ptyProcess?: PtyProcess
  sshClient?: SSHClient
  sshStream?: SSHStream
  telnetClient?: TelnetConnection
  window: ElectronWindow
  sshParams?: SSHParams
  waitingForPassword?: boolean
  authFinishCallback?: (responses: string[]) => void
}
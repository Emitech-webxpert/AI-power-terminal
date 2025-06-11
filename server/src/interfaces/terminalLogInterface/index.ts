export interface ITerminalLog {
  id: string;
  userId: string;
  command: string;
  time: Date;
  status: 'success' | 'error' | 'running';
  output: string;
  severity: 'low' | 'medium' | 'high';

}

export interface ICreateTerminalLog {
  userId: string;
  command: string;
  time: Date;
  status: 'success' | 'error' | 'running';
  output: string;
  severity: 'low' | 'medium' | 'high';
}

export interface IUpdateTerminalLog {
  sessionName?: string;
  commands?: string;
  isActive?: boolean;
  totalCommands?: number;
  lastCommandAt?: Date;
}

export interface ITerminalLogResponse {
  id: string;
  userId: string;
  sessionName: string;
  commands: string;
  startedAt: Date;
  isActive: boolean;
  totalCommands: number;
  lastCommandAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}




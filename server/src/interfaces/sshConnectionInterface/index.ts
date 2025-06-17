
export interface IConnection {
  id?: string;
  userId: string
  protocol: string;
  host: string;
  port: number;
  username: string;
  sessionName: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateConnection {
  userId : string
  protocol: string;
  host: string;
  port: number;
  username: string;
  sessionName: string;
  description?: string;
}
export interface IUpdateConnection {
  protocol?: string;
  host?: string;
  port?: number;
  username?: string;
  sessionName?: string;
  description?: string;
}
export interface IConnectionQuery {
  id?: string;
  protocol?: string;
  host?: string;
  sessionName?: string;
  limit?: number;
  offset?: number;
}
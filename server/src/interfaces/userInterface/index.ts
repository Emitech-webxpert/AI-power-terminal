export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  isGoogleLogin: boolean;
  resetOTP?: string;
  resetOTPExpiry?: Date;
  profileUrl?: string;
  terminalLogId?: string; // Reference to terminal log table
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUser {
  name: string;
  email: string;
  password?: string;
  isGoogleLogin?: boolean;
  profileUrl?: string;
  terminalLogId?: string;
}

export interface IUpdateUser {
  name?: string;
  email?: string;
  password?: string;
  isGoogleLogin?: boolean;
  resetOTP?: string;
  resetOTPExpiry?: Date;
  profileUrl?: string;
  terminalLogId?: string;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  isGoogleLogin: boolean;
  profileUrl?: string;
  terminalLogId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IResetPassword {
  email: string;
  resetOTP: string;
  newPassword: string;
}
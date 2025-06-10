export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  isGoogleLogin: boolean;
  resetOTP?: string;
  resetOTPExpiry?: Date;
  profileUrl?: string;
}

export interface ICreateUser {
  name: string;
  email: string;
  password?: string;
  isGoogleLogin: boolean;
  resetOTP?: string;
  resetOTPExpiry?: Date;
  profileUrl?: string;
  // terminalLogId?: string;
}

export interface IUserCreationAttributes {
  id?: string;
  name: string;
  email: string;
  password?: string;
  isGoogleLogin: boolean;
  resetOTP?: string;
  resetOTPExpiry?: Date;
  profileUrl?: string;
  // terminalLogId?: string;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  isGoogleLogin: boolean;
  profileUrl?: string;
  // terminalLogId?: string;
}

export interface IUpdateUser {
  name?: string;
  email?: string;
  password?: string;
  isGoogleLogin?: boolean;
  resetOTP?: string;
  resetOTPExpiry?: Date;
  profileUrl?: string;
  // terminalLogId?: string;
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
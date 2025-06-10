import User from '@models/userModel';
import { ICreateUser, IUserResponse } from '@interfaces/userInterface';

const createUser = async (userData: ICreateUser): Promise<IUserResponse> => {
  try {
    if (!userData.name || !userData.email) {
      throw new Error('Name and email are required');
    }

    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const user = await User.create(userData);
    const userJson = user.toJSON();

    // Return user without sensitive data
    const { password, resetOTP, resetOTPExpiry, ...userResponse } = userJson;
    return userResponse;
  } catch (error: any) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

export default createUser;
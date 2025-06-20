import User from '@models/user';
import { ISignUpUser, IUserResponse } from '@interfaces/user';
import bcrypt from 'bcryptjs';

const createUser = async (userData: ISignUpUser): Promise<IUserResponse> => {
  try {
    // Validate required fields
    if (!userData.name || !userData.email) {
      throw new Error('Name and email are required');
    }

    // Validate password for non-Google users
    if (!userData.isGoogleLogin && !userData.password) {
      throw new Error('Password is required for regular signup');
    }

    const existingUser = await User.findOne({ 
      where: { email: userData.email.toLowerCase() } 
    });
    
    if (existingUser) {
      throw new Error('Email already exists');
    }

    let hashedPassword = undefined;
    if (userData.password && !userData.isGoogleLogin) {
      const saltRounds = 12;
      hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    }

    const userToCreate = {
      ...userData,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      isGoogleLogin: userData.isGoogleLogin || false
    };

    // Create user
    const user = await User.create(userToCreate);
    const userJson = user.toJSON();

    // Return user without sensitive data
    const { password, resetOTP, resetOTPExpiry, ...userResponse } = userJson;
    return userResponse;
  } catch (error: any) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

export default createUser;
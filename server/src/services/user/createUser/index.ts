import User from '@models/user';
import { ISignUpUser, IUserResponse } from '@interfaces/user';
import bcrypt from 'bcryptjs';

const createUser = async (userData: ISignUpUser): Promise<IUserResponse> => {
  try {
    // Validate required fields
    if (!userData.name || !userData.email) {
      throw new Error('Name and email are required');
    }

    // For non-Google signups, password is required
    if (!userData.isGoogleLogin && !userData.password) {
      throw new Error('Password is required for regular signup');
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: userData.email.toLowerCase() }
    });

    // Google login logic
    if (existingUser) {
      if (userData.isGoogleLogin) {
        // Return existing user (login scenario)
        const { password, resetOTP, resetOTPExpiry, ...userResponse } = existingUser.toJSON();
        return userResponse;
      } else {
        // Normal signup trying to reuse existing email → throw error
        throw new Error('Email already exists');
      }
    }

    // Hash password for normal signup
    let hashedPassword: string | undefined = undefined;
    if (userData.password && !userData.isGoogleLogin) {
      const saltRounds = 12;
      hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    }

    // Create new user
    const userToCreate = {
      ...userData,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      isGoogleLogin: userData.isGoogleLogin || false,
    };

    const user = await User.create(userToCreate);
    const { password, resetOTP, resetOTPExpiry, ...userResponse } = user.toJSON();
    return userResponse;
  } catch (error: any) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};


export default createUser;
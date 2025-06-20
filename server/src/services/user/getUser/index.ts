import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@models/user';
import { getEnv } from '@config/index';
import { IAuthResult } from '@interfaces/user';

const authenticateUser = async (email: string, password: string): Promise<IAuthResult> => {
  try {
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Find user by email (case insensitive)
    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase() 
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user has a password (not Google login only)
    if (!user.password) {
      throw new Error('Please sign in with Google or reset your password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        name: user.name
      },
      getEnv('JWT_SECRET')
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileUrl: user.profileUrl || undefined,
        isGoogleLogin: user.isGoogleLogin
      },
      token
    };
  } catch (error: any) {
    throw new Error(`Failed to authenticate user: ${error.message}`);
  }
};

export default authenticateUser;
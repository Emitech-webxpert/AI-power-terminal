import User from '@models/userModel';
import { IUserResponse } from '@interfaces/userInterface';

const getUserById = async (id: string): Promise<IUserResponse | null> => {
  try {
    if (!id) {
      throw new Error('User ID is required');
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password', 'resetOTP', 'resetOTPExpiry'] }
    });
    
    return user ? user.toJSON() : null;
  } catch (error: any) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
};

export default getUserById;
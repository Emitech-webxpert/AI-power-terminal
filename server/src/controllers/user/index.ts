import { Request, Response } from 'express';
import { UserService } from '@services/index';
import { ISignUpUser,ILoginUser } from '@interfaces/user';

export const SignUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData: ISignUpUser = req.body;
    const user = await UserService.createUser(userData);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
export const SignIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: ILoginUser = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
      return;
    }

    // Authenticate user through service
    const result = await UserService.authenticateUser(email, password);

    res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data: result
    });
  } catch (error: any) {
    // Handle specific authentication errors
    if (error.message === 'Invalid credentials' || error.message === 'User not found') {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Handle other errors
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
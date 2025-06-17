import { Request, Response } from 'express';
import { UserService } from '@services/index';
import { ICreateUser } from '@interfaces/userInterface';

export const createUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData: ICreateUser = req.body;
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

export const getUserByIdController = async (req: Request, res: Response): Promise<void> => {
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
import { Request, Response } from 'express';
import {
    TerminalLogService,

} from '@services/index';
import { ICreateTerminalLog } from '@interfaces/terminalLogInterface';

export const createTerminalLogController = async (req: Request, res: Response): Promise<void> => {
    try {
        const sessionData: ICreateTerminalLog = req.body;
        const session = await TerminalLogService.createTerminalLog(sessionData);

        res.status(201).json({
            success: true,
            message: 'Terminal session created successfully',
            data: session
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get terminal session by ID
export const getTerminalLogController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const session = await TerminalLogService.getTerminalLogById(id);

        if (!session) {
            res.status(404).json({
                success: false,
                message: 'Terminal session not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Terminal session retrieved successfully',
            data: session
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

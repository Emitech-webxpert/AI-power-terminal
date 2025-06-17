import { Request, Response } from 'express';
import { SSHConnectionService } from '@services/index';
import { ICreateConnection, IConnectionQuery } from '@interfaces/sshConnectionInterface';

// CREATE - POST /connections
export const createConnection = async (req: Request, res: Response): Promise<void> => {
    try {
        const connectionData: ICreateConnection = req.body;
        const connection = await SSHConnectionService.createSSHConnection(connectionData);
        if (connection) {
            res.status(201).json({
                success: true,
                message: 'Connection created successfully',
                data: connection
            });
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// READ - GET /connections
export const getAllConnections = async (req: Request, res: Response): Promise<void> => {
    try {
        const connections = await SSHConnectionService.getSSHConnection();

        res.status(200).json({
            success: true,
            message: 'Connections fetched successfully',
            data: connections,
            total: connections.length
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// READ - GET /connections/:id
export const getConnectionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const connection = await SSHConnectionService.getSSHConnectionById(id);

        if (!connection) {
            res.status(404).json({
                success: false,
                message: 'Connection not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Connection fetched successfully',
            data: connection
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// READ - GET /connections/search
export const searchConnections = async (req: Request, res: Response): Promise<void> => {
    try {
        const query: IConnectionQuery = req.query as any;

        // Convert string numbers to integers
        if (query.limit) query.limit = parseInt(query.limit as any);
        if (query.offset) query.offset = parseInt(query.offset as any);

        const result = await SSHConnectionService.searchConnections(query);

        res.status(200).json({
            success: true,
            message: 'Connections searched successfully',
            data: result.connections,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit)
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE - DELETE /connections/:id
export const deleteConnection = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await SSHConnectionService.deleteSSHConnection(id);

        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Connection not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Connection deleted successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
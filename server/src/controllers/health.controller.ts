import { Request, Response } from 'express';
import { getHealthStatus } from '@services/health.service';

export const healthCheck = (_: Request, res: Response) => {
  const status = getHealthStatus();
  res.status(200).json(status);
};

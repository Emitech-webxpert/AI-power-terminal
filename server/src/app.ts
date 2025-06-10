import express from 'express';
import cors from 'cors';
import routes from '@routes/index';
import { getEnv } from '@config/index';
import './db/database';

export const startApp = () => {
  const app = express();
  const port = getEnv('NODE_SERVER_PORT');
  
  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  
  // Routes
  app.use('/', routes);
  
  
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
      path: req.originalUrl
    });
  });
  
  // Global error handler
  app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  });
  
  app.listen(port, () => {
    console.log(`Server running on ${getEnv('NODE_SERVER_URL')}`);
  });
};
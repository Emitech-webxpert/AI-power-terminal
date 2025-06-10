import express from 'express';
import cors from 'cors';
import routes from '@routes/index';
import { getEnv } from '@config/index';
import './db/database'; 

export const startApp = () => {
  const app = express();
  const port = getEnv('NODE_SERVER_PORT');
  
  app.use(cors());
  app.use(express.json());
  app.use('/api', routes);
  
  app.listen(port, () => {
    console.log(`Server running on ${getEnv('NODE_SERVER_URL')}`);
  });
};
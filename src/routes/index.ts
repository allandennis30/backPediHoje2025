import { Router } from 'express';
import apiRoutes from './api.routes';
import { LoginController } from '../controllers/login.controller';
import ApiLog from '../models/ApiLog';

const routes = Router();

routes.get('/', async (req, res) => {
    res.json({
        status: 'ok',
        ping: `${Date.now()}ms`,
        timestamp: new Date().toISOString(),
    });
});

routes.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

routes.use('/api/v1', apiRoutes);

export default routes
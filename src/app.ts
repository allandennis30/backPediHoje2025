import express from 'express';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { applySecurityMiddlewares } from './middlewares/security';
import { connectToDatabase } from './database/mongoose';
import { logRouteAccess } from './middlewares/log';
import morgan from 'morgan';
import logger from './utils/logger';

export const app = express();

const stream = {
  write: (message: string) => logger.http(message.trim()),
};

app.use(morgan('combined', { stream }));
app.use(express.json());

applySecurityMiddlewares(app);
connectToDatabase();

app.use(routes);
app.use(logRouteAccess);
app.use(errorHandler);
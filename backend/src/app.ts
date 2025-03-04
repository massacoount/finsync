import 'express-async-errors';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import config from './config';
import logger from './config/logger';
import authRoutes from './routes/auth';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(bodyParser.json());

// Standardized endpoints with versioning (e.g., /api/v1)
app.use('/api/v1/auth', authRoutes);

// Additional endpoints can be added here using the same standard format

// Catch-all for 404 Not Found
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;

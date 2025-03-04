import app from './app';
import config from './config';
import logger from './config/logger';

const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port} in ${config.env} mode`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Closing server.');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

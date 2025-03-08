import "reflect-metadata";
import { createConnection } from "typeorm";
import app from './App';
import config from './config';
import logger from './config/logger';
//createConnection().then(() => {
  const server = app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port} in ${config.env} mode`, 'bootstrap');
  });
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received. Closing server.', 'shutdown');
    server.close(() => {
      logger.info('Server closed', 'shutdown');
      process.exit(0);
    });
  });
//}).catch(error => console.log("TypeORM connection error: ", error));
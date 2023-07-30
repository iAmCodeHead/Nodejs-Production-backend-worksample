import mongoose from 'mongoose';
import app from './app';
import config from './src/config/config';
import logger from './src/modules/logger/logger';
// import runSeeds from './database/seeders/run-seeder';

let server: any;
mongoose
  .connect(config.mongoose.url)
  .then(() => {
    logger.info('Connected to MongoDB');

    // runSeeds();
  })
  .then(() => {
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: string) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

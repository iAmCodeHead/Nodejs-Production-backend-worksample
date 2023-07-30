import express, { Express } from 'express';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import httpStatus from 'http-status';
import config from './src/config';
import { ApiError, errorConverter, errorHandler } from './src/utils/error-utils';
import v1Routes from './src/routes/v1';
import { rateLimiter } from './src/utils';
import { morgan } from './src/utils';

const app: Express = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// enable cors
app.use(cors());
app.options('*', cors());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(ExpressMongoSanitize());

// limit repeated failed requests on all endpoints
app.use('/v1', rateLimiter);

// v1 api routes
app.use('/v1', v1Routes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;

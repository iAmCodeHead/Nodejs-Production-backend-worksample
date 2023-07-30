/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import config from '../../config';
import logger from '../logger';
import ApiError from './api-error';

export const errorConverter = (err: any, _req: Request, _res: Response, next: NextFunction) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    // mongoose dup key error
    if (error.code && error.code.toString() === '11000') {
      const statusCode = httpStatus.BAD_REQUEST;
      const regex = /dup key: {\s*([^:]+)\s*:\s*"[^"]+"\s*}/;
      const match = error.message.match(regex);
      const duplicatedFieldKey = match ? match[1] : null;
      const message: string = `${duplicatedFieldKey} already exists`;
      error = new ApiError(statusCode, message, false, err.stack);
      next(error);
    }

    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message: string = error.message || `${httpStatus[statusCode]}`;
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = 'Internal Server Error';
  }

  res.locals['errorMessage'] = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

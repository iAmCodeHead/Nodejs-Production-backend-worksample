import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import pick from '../../utils/pick';
import { IOptions } from '../../utils/db-utils/pagination';
import * as userService from './user.service';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(httpStatus.CREATED).send(user);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = pick(req.query, ['created', 'email']);
    const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await userService.queryUsers(filter, options);
    res.status(httpStatus.OK).send(result);
  } catch (error) {
    next(error);
  }
};

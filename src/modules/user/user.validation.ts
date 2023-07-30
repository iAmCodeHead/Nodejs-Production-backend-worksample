import Joi from 'joi';
import { IUser } from './user.interfaces';

const createUserBody: Record<keyof IUser, any> = {
  email: Joi.string().required().email(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  age: Joi.number().integer().min(15).max(100).required(),
  created: Joi.date().optional(),
};

export const createUser = {
  body: Joi.object().keys(createUserBody),
};

export const getUsers = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
  }),
};

import httpStatus from 'http-status';
import { ApiError } from '../../utils/error-utils';
import User from './user.model';
import { IOptions, QueryResult } from '../../utils/db-utils/pagination';
import { IUser } from './user.interfaces';

/**
 * Create a user
 * @param {IUser} userBody
 * @returns {Promise<IUser>}
 */
export const createUser = async (userBody: IUser): Promise<IUser> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryUsers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const users = await User.paginate(filter, options);
  return users;
};

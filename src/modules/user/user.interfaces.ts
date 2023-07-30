import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../../utils/db-utils/pagination';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  created?: Date;
}

export interface IUserDoc extends IUser, Document {}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

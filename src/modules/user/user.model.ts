import mongoose from 'mongoose';
import validator from 'validator';
import httpStatus from 'http-status';
import toJSON from '../../utils/db-utils/to-json/to-json';
import paginate from '../../utils/db-utils/pagination';
import { IUserDoc, IUserModel } from './user.interfaces';
import ApiError from '../../utils/error-utils/api-error';

const userSchema = new mongoose.Schema<IUserDoc, IUserModel>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
      },
    },
    age: {
      type: Number,
      required: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema);

export default User;

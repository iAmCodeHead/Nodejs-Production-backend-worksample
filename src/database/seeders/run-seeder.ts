import mongoose from 'mongoose';
import { logger } from 'src/utils';
import config from '../../config';
import usersDataSeed from './user.seed';
import User from '@/modules/user/user.model';

const runSeeds = async () => {
  mongoose
    .connect(config.mongoose.url)
    .then(() => {
      logger.info('Connected to MongoDB');
    })
    .catch((err) => {
      logger.info('connection error from seeder', err);
    });

  await User.deleteMany({});
  await User.insertMany(usersDataSeed);
};

runSeeds().then(() => {
  mongoose.connection.close();
});

export default runSeeds;

// import { User } from '../../modules/user';
// import usersDataSeed from './user.seed';

// const runSeeds = async () => {
//   await User.deleteMany({});
//   await User.insertMany(usersDataSeed);
// };

// export default runSeeds;

import { logger } from '../../utils';
import usersDataSeed from './user.seed';
import User from '../../modules/user/user.model';

const runSeeds = async () => {
  const count = await User.count({});
  logger.info(`Users collection has ${count} datasets`);
  if (count === 0) {
    logger.info('running users seed...');
    await User.deleteMany({});
    await User.insertMany(usersDataSeed);
    logger.info('users seeding completed!');
  }
};

export default runSeeds;

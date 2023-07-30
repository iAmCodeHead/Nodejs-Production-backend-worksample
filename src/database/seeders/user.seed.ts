import { faker } from '@faker-js/faker';
import { NewCreatedUser } from '@/modules/user/user.interfaces';

const usersDataSeed: NewCreatedUser[] = [
  {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email().toLowerCase(),
    age: faker.datatype.number({ min: 15, max: 100 }),
  },
  {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email().toLowerCase(),
    age: faker.datatype.number({ min: 15, max: 100 }),
  },
];

export default usersDataSeed;

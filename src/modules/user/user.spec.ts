import request from 'supertest';
import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import app from '../../../app';
import setupTestDB from '../../utils/test-utils/setup-test-db';
import User from './user.model';
import { IUser } from './user.interfaces';

setupTestDB();

const userOne: IUser = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: `a${faker.internet.email().toLowerCase()}`,
  age: faker.datatype.number({ min: 15, max: 100 }),
};

const userTwo: IUser = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: `b${faker.internet.email().toLowerCase()}`,
  age: faker.datatype.number({ min: 15, max: 100 }),
};

const insertUsers = async (users: Record<string, any>[]) => {
  await User.insertMany(users.map((user) => ({ ...user })));
};

describe('User routes', () => {
  describe('POST /v1/users', () => {
    let newUser: IUser;

    beforeEach(() => {
      newUser = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email().toLowerCase(),
        age: faker.datatype.number({ min: 15, max: 100 }),
      };
    });

    test('should return 201 and successfully create new user if data is ok', async () => {
      const res = await request(app).post('/v1/users').send(newUser).expect(httpStatus.CREATED);

      expect(res.body.firstName).toEqual(newUser.firstName);
      expect(res.body.lastName).toEqual(newUser.lastName);
      expect(res.body.email).toEqual(newUser.email);
      expect(res.body.age).toBeGreaterThanOrEqual(15);
      expect(res.body.age).toBeLessThanOrEqual(100);
      expect(res.body.age).toEqual(newUser.age);

      const dbUser = await User.findById(res.body.id);
      expect(dbUser).toBeDefined();
      if (!dbUser) return;

      expect(dbUser.firstName).toEqual(newUser.firstName);
      expect(dbUser.lastName).toEqual(newUser.lastName);
      expect(dbUser.email).toEqual(newUser.email);
      expect(dbUser.age).toBeGreaterThanOrEqual(15);
      expect(dbUser.age).toBeLessThanOrEqual(100);
      expect(dbUser.age).toEqual(newUser.age);
    });

    test('should return 400 error if email is invalid', async () => {
      newUser.email = 'invalidEmail';

      await request(app).post('/v1/users').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if email is already used', async () => {
      await insertUsers([userOne]);
      newUser.email = userOne.email;

      await request(app).post('/v1/users').send(newUser).expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/users', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne, userTwo]);

      const res = await request(app).get('/v1/users').send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });

      expect(res.body.results).toHaveLength(2);

      expect(res.body.results[0].firstName).toEqual(userOne.firstName);
      expect(res.body.results[0].lastName).toEqual(userOne.lastName);
      expect(res.body.results[0].email).toEqual(userOne.email);
      expect(res.body.results[0].age).toBeGreaterThanOrEqual(15);
      expect(res.body.results[0].age).toBeLessThanOrEqual(100);
      expect(res.body.results[0].age).toEqual(userOne.age);
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertUsers([userOne, userTwo]);

      const res = await request(app).get('/v1/users').query({ sortBy: 'email:desc' }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].email).toBe(userTwo.email);
      expect(res.body.results[1].email).toBe(userOne.email);
    });

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      await insertUsers([userOne, userTwo]);

      const res = await request(app).get('/v1/users').query({ sortBy: 'email:asc' }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[1].email).toBe(userTwo.email);
      expect(res.body.results[0].email).toBe(userOne.email);
    });
  });
});

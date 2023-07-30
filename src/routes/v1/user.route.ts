import express, { Router } from 'express';
import { userController, userValidation } from '../../modules/user';
import validate from '../../middleware/validate.middleware';

const router: Router = express.Router();

router
  .route('/')
  .post(validate(userValidation.createUser), userController.createUser)
  .get(validate(userValidation.getUsers), userController.getUsers);

export default router;

/*
 * @swagger
 * tags:
 *   name: Users
 *   description: User storage and retrieval
 */

/*
 * @swagger
 * /users:
 *   post:
 *     summary: Submit a user
 *     description: Add valid data set of s new user to the database.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - age
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               age:
 *                 type: number
 *                 minValue: 15
 *                 maxValue: 100
 *                 description: Age cannot be less than 15 or greater than 100
 *             example:
 *               firstName: Samson
 *               lastName: Akande
 *               email: fake@example.com
 *               age: 29
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "422":
 *         $ref: '#/components/responses/UnprocessableEntity'
 *
 *   get:
 *     summary: Get all users
 *     description: Endpoint to retrieve all users.
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. created:asc)
 *       - in: query
 *         name: projectBy
 *         schema:
 *           type: string
 *         description: project by query in the form of field:hide/include (ex. name:hide)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

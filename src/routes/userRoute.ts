import { Router } from 'express';
import {
    createUser,
    getUsers,
    updateUserByAPIKey,
    getUserByAPIKey
} from '../controllers/userController';
import {createApiKey} from "../controllers/keyController";
import {verifyApiKey} from "../middlewares/auth";

const router = Router();
const protectedRouter = Router();

protectedRouter.use(verifyApiKey);

/**
 * @swagger
 * /user/subscription:
 *   post:
 *     tags: [Public]
 *     description: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user
 *               name:
 *                 type: string
 *                 description: Name of the user
 *               password:
 *                 type: string
 *                 description: Password of the user
 *     responses:
 *       201:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   description: ID of the user
 *                 email:
 *                   type: string
 *                   description: Email of the user
 *                 name:
 *                   type: string
 *                   description: Name of the user
 *                 createdAt:
 *                   type: string
 *                   description: Date of creation of the user
 *                 updatedAt:
 *                   type: string
 *                   description: Date of last update of the user
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.post('/subscription', createUser);
/**
 * @swagger
 * /user/apiKey/{userId}:
 *   post:
 *     tags: [Protected]
 *     description: Create a new API key for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the user
 *       - in: path
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *         description: Password of the user
 *     responses:
 *       201:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                   description: API key
 *                 expiresAt:
 *                   type: string
 *                   description: Date of expiration of the API key
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.post("/apiKey/:userId", createApiKey);
/**
 * @swagger
 * /user/all:
 *   get:
 *     description: Get all users
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         description: ID of the user
 *                       email:
 *                         type: string
 *                         description: Email of the user
 *                       name:
 *                         type: string
 *                         description: Name of the user
 *                       createdAt:
 *                         type: string
 *                         description: Date of creation of the user
 *                       updatedAt:
 *                         type: string
 *                         description: Date of last update of the user
 *                 numberOfUsers:
 *                   type: number
 *                   description: Number of users
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.get('/all', getUsers);
/**
 * @swagger
 * /user:
 *   get:
 *     tags: [Protected]
 *     description: Get user by API key
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: API key
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       description: ID of the user
 *                     email:
 *                       type: string
 *                       description: Email of the user
 *                     name:
 *                       type: string
 *                       description: Name of the user
 *                     createdAt:
 *                       type: string
 *                       description: Date of creation of the user
 *                     updatedAt:
 *                       type: string
 *                       description: Date of last update of the user
 *                 apiKey:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       apiKey:
 *                         type: string
 *                         description: API key
 *                       expiresAt:
 *                         type: string
 *                         description: Date of expiration of the API key
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
protectedRouter.get('/', getUserByAPIKey);
/**
 * @swagger
 * /user:
 *   put:
 *     tags: [Protected]
 *     description: Update user by API key
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: API key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   description: ID of the user
 *                 email:
 *                   type: string
 *                   description: Email of the user
 *                 name:
 *                   type: string
 *                   description: Name of the user
 *                 createdAt:
 *                   type: string
 *                   description: Date of creation of the user
 *                 updatedAt:
 *                   type: string
 *                   description: Date of last update of the user
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
protectedRouter.put('/', updateUserByAPIKey);

router.use("/", protectedRouter);

export default router;
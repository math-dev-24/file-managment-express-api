import { Router } from 'express';
import {
    createFile,
    deleteFile,
    downloadFile,
    getAllFilesUrl,
    getFileById
} from "../controllers/fileController";
import {verifyApiKey} from "../middlewares/auth";


const router = Router();

const protectedRouter = Router();

protectedRouter.use(verifyApiKey);
/**
 * @swagger
 * /file:
 *   post:
 *     tags: [Protected]
 *     description: Upload a new file
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *             required:
 *               - file
 *     responses:
 *       201:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message about the file
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
protectedRouter.post('/', createFile);
/**
 * @swagger
 * /file/all:
 *   get:
 *     tags: [Protected]
 *     description: Get all files
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
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         description: ID of the file
 *                       name:
 *                         type: string
 *                         description: Name of the file
 *                       path:
 *                         type: string
 *                         description: Path of the file
 *                       size:
 *                         type: number
 *                         description: Size of the file
 *                       mime_type:
 *                         type: string
 *                         description: Mime type of the file
 *                       userId:
 *                         type: number
 *                         description: ID of the user
 *                       createdAt:
 *                         type: string
 *                         description: Date of creation of the file
 *                       updatedAt:
 *                         type: string
 *                         description: Date of last update of the file
 *                 numberOfFiles:
 *                   type: number
 *                   description: Number of files
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
protectedRouter.get('/', getAllFilesUrl);
/**
 * @swagger
 * /file/{fileId}:
 *   get:
 *     tags: [Protected]
 *     description: Get file by ID
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: API key
 *       - in: path
 *         name: fileId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the file
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 file:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       description: ID of the file
 *                     name:
 *                       type: string
 *                       description: Name of the file
 *                     path:
 *                       type: string
 *                       description: Path of the file
 *                     size:
 *                       type: number
 *                       description: Size of the file
 *                     mime_type:
 *                       type: string
 *                       description: Mime type of the file
 *                     userId:
 *                       type: number
 *                       description: ID of the user
 *                     createdAt:
 *                       type: string
 *                       description: Date of creation of the file
 *                     updatedAt:
 *                       type: string
 *                       description: Date of last update of the file
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
protectedRouter.get('/:fileId', getFileById);
/**
 * @swagger
 * /file/{fileId}/download:
 *   get:
 *     tags: [Protected]
 *     description: Download file by ID
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: API key
 *       - in: path
 *         name: fileId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the file
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message about the file
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
protectedRouter.get('/:fileId/download', downloadFile);
/**
 * @swagger
 * /file/{fileId}:
 *   delete:
 *     tags: [Protected]
 *     description: Delete file by ID
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: API key
 *       - in: path
 *         name: fileId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the file
 *     responses:
 *       204:
 *         description: Successful response
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
protectedRouter.delete('/:fileId', deleteFile);


router.use("/", protectedRouter);

export default router;
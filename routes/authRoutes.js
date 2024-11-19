import express from 'express';
import * as authController from '../controllers/authController.js';
import { uploadProfileImg } from '../middleware/uploadMiddleware.js';

const authRouter = express.Router();

//POST
authRouter.post('/login', uploadProfileImg.none(), authController.login);
authRouter.post(
    '/signup',
    uploadProfileImg.single('profilePhoto'),
    authController.signup,
);

export default authRouter;

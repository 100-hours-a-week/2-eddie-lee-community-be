import express from 'express';
import * as authController from '../controllers/authController.js';
import { uploadProfileImg } from '../middleware/uploadMiddleware.js';

let authRouter = express.Router();

//GET
authRouter.get('/login', authController.viewLogin);
authRouter.get('/signup', authController.viewSignup);

//POST
authRouter.post('/login', uploadProfileImg.none(), authController.login);
authRouter.post(
    '/signup',
    uploadProfileImg.single('profilePhoto'),
    authController.signup,
);

export default authRouter;

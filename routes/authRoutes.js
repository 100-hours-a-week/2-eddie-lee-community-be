import express from 'express';
import * as authController from '../controllers/authController.js';
import {
    uploadProfileImg,
    handleProfileImgUpload,
} from '../middleware/uploadMiddleware.js';

const authRouter = express.Router();

//GET
authRouter.get('/duplicate', authController.isDuplicate);

//POST
authRouter.post('/login', uploadProfileImg.none(), authController.login);
authRouter.post(
    '/signup',
    uploadProfileImg.single('profileImg'),
    handleProfileImgUpload,
    authController.signup,
);

export default authRouter;

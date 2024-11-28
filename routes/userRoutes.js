import express from 'express';
import * as userController from '../controllers/userController.js';
import * as userModel from '../models/userModel.js';
import * as postModel from '../models/postModel.js';
import { uploadProfileImg } from '../middleware/uploadMiddleware.js';

const userRouter = express.Router();

//GET
userRouter.get('/session', userModel.getUserSession);

//PATCH
userRouter.patch(
    '/',
    uploadProfileImg.single('profileImg'),
    userController.modifyUser,
);
userRouter.patch(
    '/passwd',
    uploadProfileImg.none(),
    userController.modifyUserPasswd,
    userModel.modifyUserPasswd,
);

//DELETE
userRouter.delete('/', userController.deleteUser, userModel.deleteUser);
userRouter.delete('/session', userController.deleteSession);

export default userRouter;

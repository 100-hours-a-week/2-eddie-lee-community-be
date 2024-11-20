import express from 'express';
import * as userController from '../controllers/userController.js';
import * as userModel from '../models/userModel.js';
import * as postModel from '../models/postModel.js';
import { uploadProfileImg } from '../middleware/uploadMiddleware.js';

const userRouter = express.Router();

//GET
userRouter.get('/data', userController.getUserData);

//PATCH
userRouter.patch(
    '/',
    uploadProfileImg.single('profileImg'),
    userController.modifyUser,
    postModel.modifyUserData,
    userModel.modifyUser,
);
userRouter.patch(
    '/passwd',
    uploadProfileImg.none(),
    userController.modifyUserPasswd,
    userModel.modifyUserPasswd,
);

//DELETE
userRouter.delete(
    '/',
    userController.deleteUser,
    postModel.deleteUserWrites,
    userModel.deleteUser,
);
userRouter.delete('/:userId/session', userController.deleteSession);

export default userRouter;

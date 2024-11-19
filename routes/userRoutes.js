import express from 'express';
import * as userController from '../controllers/userController.js';
import { uploadProfileImg } from '../middleware/uploadMiddleware.js';

const userRouter = express.Router();

//GET
userRouter.get('/data', userController.getUserData);

//PATCH
userRouter.patch(
    '/:userId/user',
    uploadProfileImg.single('profileImg'),
    userController.modifyUser,
);
userRouter.patch(
    '/:userId/passwd',
    uploadProfileImg.none(),
    userController.modifyUserPasswd,
);

//DELETE
userRouter.delete('/:userId/user', userController.deleteUser);
userRouter.delete('/:userId/session', userController.deleteSession);

export default userRouter;

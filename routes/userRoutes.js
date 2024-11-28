import express from 'express';
import * as userController from '../controllers/userController.js';
import { uploadProfileImg } from '../middleware/uploadMiddleware.js';

const userRouter = express.Router();

//GET
userRouter.get('/session', userController.getUserSession);

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
);

//DELETE
userRouter.delete('/', userController.deleteUser);
userRouter.delete('/session', userController.deleteSession);

export default userRouter;

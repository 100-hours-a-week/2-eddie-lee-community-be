import express from 'express';
import * as userController from '../controllers/userController.js';
import { uploadProfileImg } from '../middleware/uploadMiddleware.js';

const userRouter = express.Router();

//GET
userRouter.get('/:userId/user', userController.viewModifyUser);
userRouter.get('/:userId/passwd', userController.viewUserPasswd);
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

export default userRouter;

import express from 'express';
import * as postModel from '../models/postModel.js';
import * as userModel from '../models/userModel.js';

const dataRouter = express.Router();

//GET
dataRouter.get('/posts', postModel.sendPosts);
dataRouter.get('/posts/:postId', postModel.sendSpecificPostData);
dataRouter.get('/comments', postModel.sendComments);
dataRouter.get('/signup/', userModel.isDuplicate);

//POST
dataRouter.post('/posts', postModel.addPost);
dataRouter.post('/auth/signup', userModel.signup);
dataRouter.post('/user', userModel.sendUser);

//PATCH
dataRouter.patch('/posts', postModel.updatePosts);
dataRouter.patch('/comments', postModel.updateComments);
dataRouter.patch('/posts/:postId/view', postModel.updateView);

//DELETE

export default dataRouter;

import express from 'express';
import * as postModel from '../models/postModel.js';
import * as userModel from '../models/userModel.js';

const dataRouter = express.Router();

dataRouter.get('/posts', postModel.getAllPostData);
dataRouter.get('/posts/:postId', postModel.getSpecificPostData);
dataRouter.get('/posts/:postId/comments/:commentId', postModel.getComment);
dataRouter.get('/comments', postModel.getComments);
dataRouter.get('/users', userModel.getUsers);

export default dataRouter;

import express from 'express';
import * as postModel from '../models/postModel.js';
import * as userModel from '../models/userModel.js';

const dataRouter = express.Router();

//GET
dataRouter.get('/posts', postModel.sendPosts);
dataRouter.get('/posts/:postId', postModel.sendSpecificPostData);
dataRouter.get('/posts/:postId/comments', postModel.sendPostComments);
dataRouter.get('/posts/:postId/comments/:commentId', postModel.sendComment);
dataRouter.get('/comments', postModel.sendComments);

//POST
dataRouter.post('/posts', postModel.addPost);
dataRouter.post('/comments', postModel.addComment);
dataRouter.post('/auth/signup', userModel.signup);
dataRouter.post('/user', userModel.sendUser);

//PATCH
dataRouter.patch('/posts', postModel.updatePosts);
dataRouter.patch('/comments', postModel.updateComments);
dataRouter.patch('/posts/:postId/view', postModel.updateView);
dataRouter.patch('/posts/:postId/like', postModel.updateLike);

//DELETE
dataRouter.delete('/posts/:postId', postModel.deletePost);
dataRouter.delete(
    '/posts/:postId/comments/:commentId',
    postModel.deleteComment,
);

export default dataRouter;

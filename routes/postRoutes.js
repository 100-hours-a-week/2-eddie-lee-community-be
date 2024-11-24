import express from 'express';
import * as postController from '../controllers/postController.js';
import * as postModel from '../models/postModel.js';
import { uploadPostImg } from '../middleware/uploadMiddleware.js';

const postRouter = express.Router();

//GET
postRouter.get('/:postId/data', postController.resPostData);
postRouter.get(
    '/:postId/comments',
    postController.getPostComments,
    postModel.sendPostComments,
);
postRouter.get(
    '/:postId/comments/:commentId',
    postController.getCommentData,
    postModel.sendComment,
);

//POST

postRouter.post('/', postController.getPostList, postModel.sendPosts);
postRouter.post(
    '/edit',
    uploadPostImg.single('inputImg'),
    postController.editPost,
);
postRouter.post(
    '/:postId/comment',
    postController.editComment,
    postModel.addComment,
);

//PATCH
postRouter.patch(
    '/:postId',
    uploadPostImg.single('inputImg'),
    postController.modifyPost,
    postModel.updatePosts,
);
postRouter.patch(
    '/:postId/comments/:commentId',
    postController.modifyComment,
    postModel.updateComments,
);
postRouter.patch('/:postId/view', postController.updateView);
postRouter.patch(
    '/:postId/like',
    postController.updateLike,
    postModel.updateLike,
);

//DELETE
postRouter.delete('/:postId', postController.deletePost, postModel.deletePost);
postRouter.delete(
    '/:postId/comments/:commentId',
    postController.deleteComment,
    postModel.deleteComment,
);

export default postRouter;

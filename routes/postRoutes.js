import express from 'express';
import * as postController from '../controllers/postController.js';
import { uploadPostImg } from '../middleware/uploadMiddleware.js';

const postRouter = express.Router();

//GET
postRouter.get('/:postId/data', postController.resPostData);
postRouter.get('/', postController.getPostList);
postRouter.get('/:postId/comments', postController.getPostComments);
postRouter.get('/:postId/comments/:commentId', postController.getCommentData);
postRouter.get('/:postId/like', postController.editPostLike);

//POST
postRouter.post(
    '/edit',
    uploadPostImg.single('inputImg'),
    postController.editPost,
);
postRouter.post('/:postId/comment', postController.editComment);

//PATCH
postRouter.patch(
    '/:postId',
    uploadPostImg.single('inputImg'),
    postController.modifyPost,
);
postRouter.patch('/:postId/comments/:commentId', postController.modifyComment);
postRouter.patch('/:postId/view', postController.updateView);

//DELETE
postRouter.delete('/:postId', postController.deletePost);
postRouter.delete('/comments/:commentId', postController.deleteComment);
postRouter.delete('/:postId/like', postController.deleteLike);

export default postRouter;

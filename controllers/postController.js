import env from '../config/dotenv.js';
import * as postDAO from '../DAO/postDAO.js';
import * as commentDAO from '../DAO/commentDAO.js';

const baseUrl = env.API_BASE_URL;
const rootDir = env.ROOT_DIR;
const postFilePath = `${baseUrl}/data/posts`;

//GET
export const resPostData = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const postData = await postDAO.findSelectedPost(postId);
        res.status(200).json(postData);
    } catch (err) {
        next(err);
    }
};

export const getPostComments = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const result = await commentDAO.findComments(postId);
        if (!result) {
            throw new Error('get comment failed');
        }
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const getCommentData = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const commentData = await commentDAO.findSelectedComment(
            postId,
            commentId,
        );
        if (!commentData) {
            throw new Error('comment data does not exist');
        }
        res.status(200).json(commentData);
    } catch (err) {
        res.status(404).json({
            message: 'get comment data failed',
            data: err.message,
        });
    }
};

export const editPostLike = async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.session.user.user_id;
    try {
        (await postDAO.addPostLike(postId, userId))
            ? res
                  .status(200)
                  .json({ message: 'Update like complete', data: null })
            : res.status(404).json({ message: 'update like fail', data: null });
    } catch (err) {
        next(err);
    }
};

//POST
export const getPostList = async (req, res) => {
    try {
        const { page } = req.query;
        const getPostData = await postDAO.findPosts(page);
        res.status(200).json(getPostData);
    } catch (err) {
        res.status(404).json({
            message: 'Get post list Failed...',
            data: err.message,
        });
    }
};

export const editPost = async (req, res, next) => {
    try {
        const getPostData = req.body;
        const user = req.session.user;
        const fileData = req.file
            ? `/public/images/postImages/${req.file.filename}`
            : null;

        const postData = {
            user_id: user.user_id,
            title: getPostData.title,
            content: getPostData.content,
            image: fileData,
        };
        if (!(await postDAO.addPost(postData))) {
            throw new Error('edit post failed..');
        }
        res.status(201).json({ message: 'edit post success', data: null });
    } catch (error) {
        next(error);
    }
};

export const editComment = async (req, res, next) => {
    try {
        const comment = req.body.content;
        const postId = req.params.postId;
        const userData = req.session.user;
        const commentData = {
            user_id: userData.user_id,
            comment_content: comment,
            post_id: postId,
        };

        if (!(await commentDAO.addComment(commentData))) {
            throw new Error('edit comment fail');
        }
        res.status(201).json({ message: 'edit comment success', data: null });
    } catch (error) {
        next(error);
    }
};

//PATCH
export const modifyPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const reqPostData = req.body;
        const postImg = req.file
            ? `/public/images/postImages/${req.file.filename}`
            : null;
        const postData = {
            postId: postId,
            title: reqPostData.title,
            content: reqPostData.content,
            image: postImg,
        };
        if (!(await postDAO.updatePost(postData))) {
            throw new Error('update post failed');
        }
        res.status(200).json({ message: 'update post success', data: null });
    } catch (err) {
        next(err);
    }
};

export const modifyComment = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const commentData = {
            postId: postId,
            commentId: commentId,
            content: req.body.content,
        };
        (await commentDAO.updateComment(commentData))
            ? res
                  .status(200)
                  .json({ message: 'modify comment success', data: null })
            : res.status(404).json({
                  message: 'modify comment fail',
                  data: null,
              });
    } catch (error) {
        next(error);
    }
};

export const updateView = async (req, res) => {
    const postId = req.params.postId;
    try {
        (await postDAO.updatePostView(postId))
            ? res
                  .status(200)
                  .json({ message: 'Update view complete', data: null })
            : res.status(404).json({ message: 'update view fail', data: null });
    } catch (err) {
        res.status(404).json({
            message: 'Update view failed..',
            data: err.message,
        });
    }
};

//DELETE
export const deleteLike = async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.session.user.user_id;
    try {
        (await postDAO.deletePostLike(postId, userId))
            ? res
                  .status(200)
                  .json({ message: 'Update like complete', data: null })
            : res.status(404).json({ message: 'update like fail', data: null });
    } catch (err) {
        next(err);
    }
};

export const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        (await postDAO.deletePost(postId))
            ? res.json({ message: 'delete post success', data: null })
            : res.status(404).json({ message: 'delete post fail', data: null });
    } catch (err) {
        next(err);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const commentInfo = {
            commentId: commentId,
        };
        (await commentDAO.deleteComment(commentInfo))
            ? res.json({ message: 'delete comment success', data: null })
            : res
                  .status(404)
                  .json({ message: 'delete comment fail', data: null });
    } catch (error) {
        next(error);
    }
};

import env from '../config/dotenv.js';
import fs from 'fs';

const baseUrl = env.API_BASE_URL;
const rootDir = env.ROOT_DIR;
const postFilePath = `${baseUrl}/data/posts`;

//timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

//GET
export const resPostData = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const getPostData = await fetch(`${baseUrl}/data/posts/${postId}`);
        const postData = await getPostData.json();

        next();
    } catch (err) {
        next(err);
    }
};

export const getPostComments = async (req, res, next) => {
    try {
        req.postId = req.params.postId;
        const getPostCommentsData = await fetch(
            `${baseUrl}/data/posts/${postId}/comments`,
        );
        const postComments = await getPostCommentsData.json();
        res.status(200).json(postComments);
    } catch {
        res.status(500).json({ message: 'internal_server_error', data: null });
    }
};

export const getCommentData = async (req, res, next) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    req.commentInfo = {
        postId: postId,
        commentId: commentId,
    };
    next();
};

//POST
export const getPostList = async (req, res) => {
    try {
        const offset = req.body.offset;
        let postArr = [];
        const getPostData = await fetch(
            `${baseUrl}/data/posts?offset=${offset}`,
        );
        const getResult = await getPostData.json();
        const getOffset = getResult.offset;
        const postList = getResult.data;
        res.status(201).json({ offset: getOffset, data: postList });
    } catch (err) {
        res.status(404).json({
            message: 'Get post list Failed...',
            data: err.message,
        });
    }
};

export const editPost = async (req, res) => {
    try {
        const postData = req.body;
        const time = Date.now();
        const timestamp = formatTimestamp(time);
        const fileData = req.file
            ? `/public/images/postImages/${req.file.filename}`
            : '/public/assets/images/defaultPostImg.png';

        const getUserData = await fetch(
            `${baseUrl}/data/users/${postData.userId}`,
        );
        const user = await getUserData.json();

        const postObj = {
            user_id: postData.userId,
            post_id: Date.now().toString(),
            profile_img: user.profile_img,
            nickname: user.nickname,
            title: postData.title,
            content: postData.content,
            image: fileData,
            timestamp: timestamp,
            like: 0,
            view: 0,
            comment_count: 0,
        };
        const result = await fetch(`${baseUrl}/data/posts`, {
            method: 'POST',
            body: JSON.stringify(postObj),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error(`Add post err`);
                }
            })
            .then(data => console.log(data));
        res.status(200).json({
            message: 'update posts success',
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: 'update posts failed..',
            data: error.message,
        });
    }
};

export const editComment = async (req, res, next) => {
    try {
        const comment = req.body.comment;
        const postId = req.params.postId;
        const userData = req.session.user;
        req.commentInfo = {
            user_id: userData.userId,
            profile_img: userData.profileImg,
            nickname: userData.nickname,
            comment_content: comment,
            postId: postId,
            timestamp: formatTimestamp(Date.now()),
            comment_id: Date.now().toString(),
        };
        next();
    } catch (error) {
        next(error);
    }
};

//PATCH
export const modifyPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const reqPostData = req.body;
        const postImg = req.file
            ? `/public/images/postImages/${req.file.filename}`
            : '/public/assets/images/defaultPostImg.png';

        const modifyPostData = {
            postId: postId,
            title: reqPostData.title,
            content: reqPostData.content,
            image: postImg,
        };
        const reqData = await fetch(`${baseUrl}/data/posts`, {
            method: 'PATCH',
            body: JSON.stringify(modifyPostData),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        res.status(200).json({
            message: 'update post success',
            data: null,
        });
    } catch (err) {
        console.error(err);
        res.status(404).json({
            message: 'update post failed..',
            data: err.message,
        });
    }
};

export const modifyComment = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        req.commentInfo = {
            postId: postId,
            commentId: commentId,
            comment_content: req.body.comment_content,
        };
        next();
    } catch (error) {
        next(error);
    }
};

export const updateView = async (req, res) => {
    const postId = req.params.postId;
    try {
        const updatePosts = await fetch(
            `${baseUrl}/data/posts/${postId}/view`,
            {
                method: 'PATCH',
            },
        )
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error(`update view fail`);
                }
            })
            .then(data => console.log(data));
        res.status(200).json({ message: 'Update view complete', data: null });
    } catch (err) {
        res.status(404).json({
            message: 'Update view failed..',
            data: err.message,
        });
    }
};

export const updateLike = async (req, res, next) => {
    try {
        req.postId = req.params.postId;
    } catch (err) {
        next(err);
    }
};

//DELETE
export const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        req.postId = postId;
        next();
    } catch (err) {
        next(err);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        req.commentInfo = {
            postId: postId,
            commentId: commentId,
        };
    } catch (error) {
        next(error);
    }
};

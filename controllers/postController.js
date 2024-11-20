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
export const resPostData = async (req, res) => {
    const postId = req.params.postId;
    try {
        const getPostData = await fetch(`${baseUrl}/data/posts/${postId}`);
        const postData = await getPostData.json();

        res.status(200).json(postData);
    } catch (err) {
        res.status(404).json({
            message: 'Get post data failed..',
            data: err.message,
        });
    }
};

export const getPostComments = async (req, res) => {
    try {
        const postId = req.params.postId;
        const getPostCommentsData = await fetch(
            `${baseUrl}/data/posts/${postId}/comments`,
        );
        const postComments = await getPostCommentsData.json();
        res.status(200).json(postComments);
    } catch {
        res.status(500).json({ message: 'internal_server_error', data: null });
    }
};

export const getCommentData = async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const response = await fetch(
        `${baseUrl}/data/posts/${postId}/comments/${commentId}`,
    ).catch(error => res.json({ result: 'error occurred' }));
    const commentData = await response.json();

    res.json(commentData);
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

export const editComment = async (req, res) => {
    try {
        const userId = req.body.userId;
        const comment = req.body.comment;
        const postId = req.params.postId;
        const user = await fetch(`${baseUrl}/data/users/${userId}`)
            .then(res => res.json())
            .catch(error => console.error(`데이터 가져오기 에러${error}`));
        const newComment = {
            user_id: userId,
            profile_img: user.profile_img,
            nickname: user.nickname,
            post_id: postId,
            comment_id: Date.now().toString(),
            timestamp: formatTimestamp(Date.now()),
            comment_content: comment,
        };
        const result = await fetch(`${baseUrl}/data/comments`, {
            method: 'POST',
            body: JSON.stringify(newComment),
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
            message: 'update comments success',
            data: null,
        });
    } catch (error) {
        res.status(404).json({
            message: 'update comments failed..',
            data: error.message,
        });
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

export const modifyComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const commentData = await fetch(`${baseUrl}/data/comments`, {
            method: 'PATCH',
            body: JSON.stringify({
                postId: postId,
                commentId: commentId,
                comment_content: req.body.comment_content,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        res.status(200).json({
            message: 'Data modify complete',
            data: null,
        });
    } catch (error) {
        res.status(500).json({
            message: 'data modify Failed...',
            data: error.message,
        });
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

export const updateLike = async (req, res) => {
    const postId = req.params.postId;
    try {
        const updatePosts = await fetch(
            `${baseUrl}/data/posts/${postId}/like`,
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
        res.status(200).json({
            message: 'like increase success',
            data: null,
        });
    } catch (err) {
        res.status(404).json({
            message: 'like increase failed..',
            data: err.message,
        });
    }
};

//DELETE
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        await fetch(`${baseUrl}/data/posts/${postId}`, {
            method: 'DELETE',
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error(`delete post fail`);
                }
            })
            .then(data => console.log(data));
        res.status(200).json({
            message: 'delete post success',
            data: null,
        });
    } catch (error) {
        res.status(404).json({
            message: 'delete post failed',
            data: error.message,
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        await fetch(`${baseUrl}/data/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error(`delete comment fail`);
                }
            })
            .then(data => console.log(data));
        res.status(200).json({
            message: 'delete comment success',
            data: null,
        });
    } catch (error) {
        res.status(500).json({
            message: 'delete comment failed...',
            data: null,
        });
    }
};

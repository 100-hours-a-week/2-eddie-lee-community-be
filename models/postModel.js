import env from '../config/dotenv.js';
import fs, { writeFile } from 'fs';

const baseUrl = env.API_BASE_URL;
const rootDir = env.ROOT_DIR;

function getData(dataType) {
    try {
        if (dataType !== 'comment' && dataType !== 'post') {
            throw new Error('invalid type');
        }
        const data = fs.readFileSync(
            `${rootDir}/data/${dataType}DummyData.json`,
        );
        return JSON.parse(data);
    } catch (err) {
        console.error(`Data get failed... : ${err.message}`);
    }
}

function writeData(dataType, data) {
    try {
        fs.copyFileSync(
            `${rootDir}/data/${dataType}DummyData.json`,
            `${rootDir}/data/${dataType}DummyData_bu.json`,
        );
        fs.writeFileSync(
            `${rootDir}/data/${dataType}DummyData.json`,
            JSON.stringify(data),
            'utf8',
        );
        return true;
    } catch (err) {
        console.log(err.message);
    }
}

//GET
export const sendPosts = async (req, res) => {
    try {
        const getOffset = req.query.offset;
        let offset = parseInt(getOffset);
        const getPosts = getData('post');
        console.log(`${getPosts[0]}`);
        console.log(getPosts[0]);
        const result = [];
        for (let i = 0; i < 10; i++) {
            if (offset !== getPosts.length) {
                console.log(offset);
                console.log(`${getPosts[offset]}`);
                result.push(getPosts[offset++]);
            } else {
                break;
            }
        }
        res.status(200).json({ offset: offset, data: result });
    } catch (e) {
        res.status(404).json({
            result: 'Get post list Failed...',
            message: e.message,
        });
    }
};

export const sendSpecificPostData = async (req, res) => {
    try {
        const postId = req.params.postId;
        const postData = getData('post');
        const specificPost = postData.find(post => post.post_id === postId);
        if (specificPost) {
            res.status(200).json(specificPost);
        } else {
            res.status(404).json({
                result: 'Not Found',
                message: "Can't get post",
            });
        }
    } catch (e) {
        res.status(404).json({
            result: '게시물 정보 가져오기 실패',
            message: e.message,
        });
    }
};

export const sendPostComments = async (req, res) => {
    try {
        const postId = req.params.postId;
        const getCommentsData = getData('comment');
        const comments = getCommentsData.filter(
            comment => comment.post_id === postId,
        );
        res.status(200).json(comments);
    } catch (err) {
        res.status(404).json({
            message: 'get comments failed',
            data: null,
        });
    }
};

export const sendComment = async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const comments = getData('comment');
    const comment = comments.find(
        comment => comment.comment_id == commentId && comment.post_id == postId,
    );
    if (comment) {
        res.json(comment);
    } else {
        res.status(404).json({
            result: 'Not Found',
            message: 'Comment not found',
        });
    }
};

export const sendComments = async (req, res) => {
    const comments = getData('comment');

    if (comments) {
        res.status(200).json(comments);
    } else {
        res.status(404).json({
            message: 'get_comments_failed',
            data: null,
        });
    }
};

//POST
export const addPost = async (req, res) => {
    try {
        const posts = getData('post');
        const newPost = req.body;
        posts.push(newPost);
        writeData('post', posts);
        res.status(201).json({
            message: 'update posts success',
            data: null,
        });
    } catch (err) {
        res.status(404).json({
            message: 'update posts failed...',
            data: null,
        });
    }
};

export const addComment = async (req, res) => {
    try {
        const comments = getData('comment');
        const newComment = req.body;
        comments.push(newComment);
        writeData('comment', comments);
        //댓글 개수 증가
        const posts = getData('post');
        const updatePosts = posts.map(post =>
            post.post_id === newComment.post_id
                ? { ...post, comment_count: ++post.comment_count }
                : post,
        );
        writeData('post', updatePosts);
        res.status(201).json({
            message: 'update comments success',
            data: null,
        });
    } catch (err) {
        res.status(404).json({
            message: 'update comments failed...',
            data: err.message,
        });
    }
};

//PATCH
export const updatePosts = async (req, res) => {
    try {
        const newPostData = req.body;
        const getPostData = getData('post');
        const posts = getPostData.map(post =>
            post.post_id === newPostData.postId
                ? {
                      ...post,
                      title: newPostData.title,
                      content: newPostData.content,
                      image: newPostData.postImg,
                  }
                : post,
        );
        writeData('post', posts);
        res.status(200).json({
            message: 'update post success',
            data: null,
        });
    } catch (err) {
        res.status(404).json({
            message: 'update post failed..',
            data: err.message,
        });
    }
};

export const updateComments = async (req, res) => {
    try {
        const newCommentData = req.body;
        const getCommentData = getData('comment');
        const comments = getCommentData.map(comment =>
            comment.post_id === newCommentData.postId &&
            comment.comment_id === newCommentData.commentId
                ? {
                      ...comment,
                      comment_content: newCommentData.comment_content,
                  }
                : comment,
        );
        writeData('comment', comments);
        res.status(200).json({
            message: 'update comment success',
            data: null,
        });
    } catch (err) {
        res.status(404).json({
            message: 'update post failed..',
            data: err.message,
        });
    }
};

export const updateView = async (req, res) => {
    try {
        const postId = req.params.postId;
        const getPostData = getData('post');
        const posts = getPostData.map(post =>
            post.post_id === postId ? { ...post, view: ++post.view } : post,
        );
        writeData('post', posts);
        res.status(200).json({
            message: 'update view success',
            data: null,
        });
    } catch (err) {
        res.status(404).json({
            message: 'update view failed..',
            data: err.message,
        });
    }
};

export const updateLike = async (req, res) => {
    try {
        const postId = req.params.postId;
        const getPostData = getData('post');
        const posts = getPostData.map(post =>
            post.post_id === postId ? { ...post, like: ++post.like } : post,
        );
        writeData('post', posts);
        res.status(200).json({
            message: 'update like success',
            data: null,
        });
    } catch (err) {
        res.status(404).json({
            message: 'update like failed..',
            data: err.message,
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const getCommentData = getData('comment');
        const comments = getCommentData.filter(
            comment => comment.post_id !== postId,
        );
        writeData('comment', comments);
        const getPostData = getData('post');
        const posts = getPostData.filter(post => post.post_id !== postId);
        writeData('post', posts);
        res.status(200).json({
            message: 'delete post success',
            data: null,
        });
    } catch (err) {
        res.status(404).json({
            message: 'delete post failed..',
            data: err.message,
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const getCommentData = getData('comment');
        const comments = getCommentData.filter(
            comment =>
                comment.comment_id != commentId || comment.post_id != postId,
        );
        writeData('comment', comments);
        const getPostData = getData('post');
        const posts = getPostData.map(post =>
            post.post_id === postId
                ? { ...post, comment_count: --post.comment_count }
                : post,
        );
        writeData('post', posts);
        res.status(200).json({
            message: 'delete comment success',
            data: null,
        });
    } catch (err) {
        res.status(404).json({
            message: 'delete comment failed..',
            data: err.message,
        });
    }
};

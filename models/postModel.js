import env from '../config/dotenv.js';
import fs from 'fs';

const baseUrl = env.API_BASE_URL;
const rootDir = env.ROOT_DIR;

function getData(dataType) {
    try {
        const data = fs.readFileSync(
            `${rootDir}/data/${dataType}DummyData.json`,
        );
        return JSON.parse(data);
    } catch (err) {
        console.error(`Data get failed... : ${err.message}`);
    }
}

//GET
export const getPosts = async (req, res) => {
    {
        try {
            res.status(200).json(getData('post'));
        } catch (e) {
            res.status(404).json({
                result: '전체 게시글 데이터 가져오기 실패',
                message: e.message,
            });
        }
    }
};

export const getComment = async (req, res) => {
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

export const getComments = async (req, res) => {
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

export const getSpecificPostData = async (req, res) => {
    try {
        const postId = req.params.postId;
        const postData = getData('post');
        const specificPost = postData.find(post => post.post_id === postId);
        if (specificPost !== undefined) {
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

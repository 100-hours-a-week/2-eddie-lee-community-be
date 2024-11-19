import env from '../config.dotenv.js';

const pathToComments = `${env.API_BASE_URL}/data/commentDummyData.json`;
const pathToPosts = `${env.API_BASE_URL}/data/postDummyData.json`;
const baseUrl = env.API_BASE_URL;
//GET
export const getAllPostData = async (req, res) => {
    {
        try {
            const postsRes = await fetch(pathToPosts);
            const posts = await postsRes.json();
            res.status(200).json(posts);
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
    console.log(`${postId}, ${commentId}`);
    const commentData = await fetch(pathToComments);
    const comments = await commentData.json();
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
    const commentData = await fetch(pathToComments);
    const comments = await commentData.json();

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
        const getPostData = await fetch(`${baseUrl}/data/posts`);
        if (!getPostData.ok) {
            throw new Error(`Failed to fetch posts: ${getPostData.statusText}`);
        }
        const postData = await getPostData.json();
        const specificPost = postData.find(post => post.post_id === postId);
        if (specificPost !== undefined) {
            res.json(specificPost);
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

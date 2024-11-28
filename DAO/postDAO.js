import { runQuery } from '../config/db.js';
import { PostDTO, PostListDTO } from '../DTO/postDTO.js';

async function updateCommentCount(postId) {
    const setQuery =
        'UPDATE POSTS SET comment_count = (SELECT COUNT(*) FROM COMMENTS WHERE post_id = ?) WHERE id = ?';
    const result = await runQuery(setQuery, [postId, postId]);
    if (!result) {
        return false;
    }
    return true;
}

export const readSelectedPost = async postId => {
    if (!(await updateCommentCount(postId))) {
        throw new Error('update comment count fail');
    }
    const setQuery =
        'SELECT USERS.id, title, USERS.profile_img, USERS.nickname, timestamp, image, content, post_like, post_view, comment_count FROM POSTS LEFT JOIN USERS ON POSTS.user_id = USERS.id WHERE POSTS.id = ?';
    const result = await runQuery(setQuery, [postId]);
    if (result) {
        const post = new PostDTO(
            result[0].id,
            result[0].title,
            result[0].profile_img,
            result[0].nickname,
            result[0].timestamp,
            result[0].image,
            result[0].content,
            result[0].post_like,
            result[0].post_view,
            result[0].comment_count,
        );
        return post;
    } else {
        throw new Error('get post data failed..');
    }
};

export const readPosts = async offset => {
    const setQuery =
        'SELECT POSTS.id, title, timestamp, post_like, comment_count, post_view, USERS.profile_img, USERS.nickname FROM POSTS LEFT JOIN USERS ON POSTS.user_id = USERS.id WHERE POSTS.id BETWEEN ? AND ?';
    const result = await runQuery(setQuery, [offset, offset + 10]);
    if (result) {
        const posts = [];
        result.forEach(post => {
            posts.push(
                new PostListDTO(
                    post.id,
                    post.title,
                    post.timestamp,
                    post.post_like,
                    post.comment_count,
                    post.post_view,
                    post.profile_img,
                    post.nickname,
                ),
            );
        });
        return posts;
    } else {
        throw new Error(`get post data failed in db..`);
    }
};

export const addPost = async postData => {
    const setQuery =
        'INSERT INTO POSTS (user_id, title, content, image) VALUES (?, ?, ?, ?)';
    const result = await runQuery(setQuery, [
        postData.user_id,
        postData.title,
        postData.content,
        postData.image,
    ]);
    if (!result) {
        throw new Error('insert post failed');
    }
    return true;
};

export const updatePost = async postData => {
    const setQuery =
        'UPDATE POSTS SET title = ?, content = ?, image = ? WHERE id = ?';
    const result = await runQuery(setQuery, [
        postData.title,
        postData.content,
        postData.image,
        postData.postId,
    ]);
    if (!result) {
        throw new Error('update post failed');
    }
    return true;
};

export const updatePostView = async postId => {
    const setQuery = 'UPDATE POSTS SET post_view = post_view + 1 WHERE id = ?';
    const result = await runQuery(setQuery, [postId]);
    if (!result) {
        throw new Error('update view fail');
    }
    return true;
};

export const updatePostLike = async postId => {
    const setQuery = 'UPDATE POSTS SET post_like = post_like + 1 WHERE id = ?';
    const result = await runQuery(setQuery, [postId]);
    if (!result) {
        throw new Error('update like fail');
    }
    return true;
};

export const deletePost = async postId => {
    const setQuery = 'DELETE FROM POSTS WHERE id = ?';
    const result = await runQuery(setQuery, [postId]);
    if (!result) {
        throw new Error('delete post fail');
    }
    return true;
};

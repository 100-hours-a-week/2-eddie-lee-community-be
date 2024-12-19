import { runQuery } from '../config/db.js';
import { CommentDTO, CommentModifyDTO } from '../DTO/commentDTO.js';

export const addComment = async commentData => {
    const setQuery =
        'INSERT INTO COMMENTS (user_id, post_id, content)VALUES(?, ?, ?)';
    const result = runQuery(setQuery, [
        commentData.user_id,
        commentData.post_id,
        commentData.comment_content,
    ]);
    if (!result) {
        throw new Error('add comment failed');
    }
    return true;
};

export const findComments = async postId => {
    const setQuery =
        "SELECT COMMENTS.id, content, DATE_FORMAT(CONVERT_TZ(timestamp, '+00:00', '+09:00'), '%Y-%m-%d %H:%i:%s') AS timestamp, USERS.profile_img, USERS.nickname, user_id FROM COMMENTS LEFT JOIN USERS ON COMMENTS.user_id = USERS.id WHERE post_id = ?";
    const result = await runQuery(setQuery, [postId]);
    if (!result) {
        throw new Error('get comment failed');
    }
    const comments = [];
    result.forEach(comment => {
        comments.push(
            new CommentDTO(
                comment.user_id,
                comment.id,
                comment.content,
                comment.timestamp,
                comment.profile_img,
                comment.nickname,
            ),
        );
    });
    return result;
};

export const findSelectedComment = async (postId, commentId) => {
    const setQuery =
        'SELECT id, post_id, content FROM COMMENTS WHERE post_id = ? && id = ?';
    const result = await runQuery(setQuery, [postId, commentId]);
    if (!result) {
        throw new Error('read comment fail');
    }
    const comment = new CommentModifyDTO(
        result[0].id,
        result[0].post_id,
        result[0].content,
    );
    return comment;
};

export const updateComment = async commentData => {
    const setQuery =
        'UPDATE COMMENTS SET content = ? WHERE post_id = ? && id = ?';
    const result = await runQuery(setQuery, [
        commentData.content,
        commentData.postId,
        commentData.commentId,
    ]);
    if (!result) {
        throw new Error('update comment fail');
    }
    return true;
};

export const deleteComment = async commentInfo => {
    const setQuery = 'DELETE FROM COMMENTS WHERE id = ?';
    const result = await runQuery(setQuery, [commentInfo.commentId]);
    if (!result) {
        throw new Error('delete post fail');
    }
    return true;
};

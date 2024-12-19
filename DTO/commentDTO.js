class CommentDTO {
    /**
     * @param {int} userId - 작성자 ID
     * @param {int} commentId - 댓글 ID
     * @param {string} content - 댓글 내용
     * @param {string} timestamp - 작성 시간
     * @param {string|null} profileImg - 작성자 프로필 이미지 URL 경로
     * @param {string} nickname - 작성자 닉네임
     */
    constructor(userId, commentId, content, timestamp, profileImg, nickname) {
        if (!userId || !commentId) {
            throw new Error('유저 ID나 댓글 ID가 없습니다.');
        }
        this.userId = userId;
        this.commentId = commentId;
        this.content = content;
        this.timestamp = timestamp;
        this.profileImg = profileImg;
        this.nickname = nickname;
    }
}

class CommentModifyDTO {
    /**
     * @param {int} commentId - 댓글 ID
     * @param {int} postId - 게시글 ID
     * @param {string} content - 댓글 내용
     */
    constructor(commentId, postId, content) {
        if (!commentId || !postId) {
            throw new Error('게시글 ID나 댓글 ID가 없습니다.');
        }
        this.commentId = commentId;
        this.postId = postId;
        this.content = content;
    }
}

export { CommentDTO, CommentModifyDTO };

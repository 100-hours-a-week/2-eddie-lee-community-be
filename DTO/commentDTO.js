class CommentDTO {
    constructor(userId, commentId, content, timestamp, profileImg, nickname) {
        this.userId = userId;
        this.commentId = commentId;
        this.content = content;
        this.timestamp = timestamp;
        this.profileImg = profileImg;
        this.nickname = nickname;
    }
}

class CommentModifyDTO {
    constructor(commentId, postId, content) {
        this.commentId = commentId;
        this.postId = postId;
        this.content = content;
    }
}

export { CommentDTO, CommentModifyDTO };

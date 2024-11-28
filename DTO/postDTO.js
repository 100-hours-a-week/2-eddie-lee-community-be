class PostListDTO {
    constructor(
        id,
        title,
        timestamp,
        like,
        comment_count,
        view,
        profileImg,
        nickname,
    ) {
        this.id = id;
        this.title = title;
        this.timestamp = timestamp;
        this.like = like;
        this.comment_count = comment_count;
        this.view = view;
        this.profileImg = profileImg;
        this.nickname = nickname;
    }
}

class PostDTO {
    constructor(
        user_id,
        title,
        profileImg,
        nickname,
        timestamp,
        image,
        content,
        like,
        view,
        comment_count,
    ) {
        this.user_id = user_id;
        this.title = title;
        this.profileImg = profileImg;
        this.nickname = nickname;
        this.timestamp = timestamp;
        this.image = image;
        this.content = content;
        this.like = like;
        this.view = view;
        this.comment_count = comment_count;
    }
}

export { PostListDTO, PostDTO };

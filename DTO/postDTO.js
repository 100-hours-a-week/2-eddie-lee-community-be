class PostListDTO {
    constructor(
        id,
        title,
        timestamp,
        likes,
        comment_counts,
        views,
        profileImg,
        nickname,
    ) {
        this.id = id;
        this.title = title;
        this.timestamp = timestamp;
        this.likes = likes;
        this.comment_counts = comment_counts;
        this.views = views;
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

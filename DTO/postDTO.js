class PostListDTO {
    /**
     * 게시글 목록을 가져오기 위한 DTO
     * @param {int} id - 게시글 ID
     * @param {string} title - 게시글 제목
     * @param {string} timestamp - 작성 시간
     * @param {int} likes - 좋아요 수
     * @param {int} comment_counts - 댓글 수
     * @param {int} views - 조회 수
     * @param {string|null} profileImg - 작성자의 프로필 이미지 URL
     * @param {string} nickname - 작성자 닉네임
     */
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
        if (!id) {
            throw new Error('게시글 ID가 없습니다.');
        }
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
    /**
     * 게시글 상세 정보를 가져오기 위한 DTO
     * @param {int} user_id - 게시글 작성자 ID
     * @param {string} title - 게시글 제목
     * @param {string|null} profileImg - 작성자의 프로필 이미지 URL
     * @param {string} nickname - 작성자 닉네임
     * @param {string} timestamp - 작성 시간
     * @param {string|null} image - 게시글에 첨부된 사진 URL
     * @param {string} content - 게시글 내용
     * @param {int} like - 좋아요 수
     * @param {int} comment_count - 댓글 수
     * @param {int} view - 조회 수
     * @param {boolean} isLike - 좋아요 눌렀는지 여부
     */
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
        isLike,
    ) {
        if (!user_id) {
            throw new Error('유저 ID가 없습니다.');
        }
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
        this.isLike = isLike;
    }
}

export { PostListDTO, PostDTO };

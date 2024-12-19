class CreateUserDTO {
    /**
     * 회원가입시 새로운 유저를 등록하기 위한 DTO
     * @param {String} email - 유저의 이메일
     * @param {String} passwd - 유저 비밀번호
     * @param {String|null} profileImg - 유저의 프로필 이미지 URL
     * @param {String} nickname - 유저의 닉네임
     */
    constructor(email, passwd, profileImg, nickname) {
        this.email = email;
        this.passwd = passwd;
        this.profileImg = profileImg;
        this.nickname = nickname;
    }
}

class ResponseUserDTO {
    /**
     * 특정유저의 데이터를 반환하기 위한 DTO
     * @param {int} id - 유저 아이디
     * @param {string} email - 유저 이메일
     * @param {string|null} profileImg - 유저 프로필 이미지 URL
     * @param {string} nickname - 유저 닉네임
     */
    constructor(id, email, profileImg, nickname) {
        this.id = id;
        this.email = email;
        this.profileImg = profileImg;
        this.nickname = nickname;
    }
}

export { CreateUserDTO, ResponseUserDTO };

class CreateUserDTO {
    /**
     * 로그인시 세션을 만들기 위한 DTO
     * @param {String} email - 유저의 이메일
     * @param {String} passwd - 유저 비밀번호
     * @param {String|null} profileImg - 유저의 프로필 이미지 URL
     * @param {String} nickname - 유저의 닉네임
     */
    constructor(email, passwd, profileImg, nickname) {
        if (!email || !passwd || !nickname) {
            throw new Error('필수 정보가 누락되었습니다.');
        }
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
        if (!id) {
            throw new Error('유저 ID가 없습니다.');
        }
        this.id = id;
        this.email = email;
        this.profileImg = profileImg;
        this.nickname = nickname;
    }
}

export { CreateUserDTO, ResponseUserDTO };

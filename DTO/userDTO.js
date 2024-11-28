class CreateUserDTO {
    constructor(email, passwd, profileImg, nickname) {
        this.email = email;
        this.passwd = passwd;
        this.profileImg = profileImg;
        this.nickname = nickname;
    }
}

class ResponseUserDTO {
    constructor(id, email, profileImg, nickname) {
        this.id = id;
        this.email = email;
        this.profileImg = profileImg;
        this.nickname = nickname;
    }
}

export { CreateUserDTO, ResponseUserDTO };

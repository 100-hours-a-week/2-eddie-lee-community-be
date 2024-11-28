import { runQuery } from '../config/db.js';
import { ResponseUserDTO } from '../DTO/userDTO.js';

export const login = async (email, passwd) => {
    const setQuery =
        'SELECT id, email, profile_img, nickname FROM USERS WHERE email = ? && passwd = ?';
    const result = await runQuery(setQuery, [email, passwd]);
    if (result) {
        const userData = new ResponseUserDTO(
            result[0].id,
            result[0].email,
            result[0].profile_img,
            result[0].nickname,
        );
        return userData;
    } else {
        throw new Error('login failed in db..');
    }
};

export const addUser = async userData => {
    const setQuery =
        'INSERT INTO USERS (email, passwd, profile_img, nickname) VALUES (?, ?, ?, ?)';
    const result = await runQuery(setQuery, [
        userData.email,
        userData.passwd,
        userData.profile_img,
        userData.nickname,
    ]);
    return result ? true : false;
};

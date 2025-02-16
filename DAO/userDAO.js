import { runQuery } from '../config/db.js';
import { ResponseUserDTO } from '../DTO/userDTO.js';
import bcrypt from 'bcryptjs';

export const login = async (email, passwd) => {
    const setQuery =
        'SELECT id, email, profile_img, nickname, passwd FROM USERS WHERE email = ?';
    const result = await runQuery(setQuery, [email]);
    const passwdIsMatch = await bcrypt.compare(passwd, result[0].passwd);
    if (!passwdIsMatch) {
        throw new Error('Invalid email or password');
    }
    const userData = new ResponseUserDTO(
        result[0].id,
        result[0].email,
        result[0].profile_img,
        result[0].nickname,
    );
    return userData;
};

export const addUser = async userData => {
    userData.passwd = await bcrypt.hash(userData.passwd, 10);
    const setQuery =
        'INSERT INTO USERS (email, passwd, profile_img, nickname) VALUES (?, ?, ?, ?)';
    const result = await runQuery(setQuery, [
        userData.email,
        userData.passwd,
        userData.profile_img,
        userData.nickname,
    ]);
    return result.affectedRows > 0;
};

export const updateUser = async userData => {
    const setQuery =
        'UPDATE USERS SET profile_img = ?, nickname = ? WHERE id = ?';
    const result = await runQuery(setQuery, [
        userData.profile_img,
        userData.nickname,
        userData.user_id,
    ]);
    return result.affectedRows > 0;
};

export const updatePasswd = async userData => {
    if (!userData || !userData.passwd) {
        throw new Error('비밀번호가 제공되지 않았습니다.');
    }
    const hashedPasswd = await bcrypt.hash(userData.passwd, 10);
    const setQuery = 'UPDATE USERS SET passwd = ? WHERE id = ?';
    const result = await runQuery(setQuery, [hashedPasswd, userData.user_id]);
    return result.affectedRows > 0;
};

export const findIsDuplicate = async (dataType, data) => {
    const allowedColumns = ['email', 'nickname'];
    if (!allowedColumns.includes(dataType)) {
        throw new Error(`Invalid data type: ${dataType}`);
    }
    const setQuery = `SELECT ${dataType} FROM USERS WHERE ${dataType} = ?`;
    const result = await runQuery(setQuery, [data]);
    return result.length > 0;
};

export const deleteUser = async userId => {
    if (!userId) {
        throw new Error('유저 ID를 찾을 수 없습니다.');
    }
    const setQuery = `DELETE FROM USERS WHERE id = ?`;
    const result = await runQuery(setQuery, [userId]);
    return result.affectedRows > 0;
};

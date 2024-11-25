import fs from 'fs';
import env from '../config/dotenv.js';

const rootDir = env.ROOT_DIR;

function getUserData() {
    try {
        const data = fs.readFileSync(`${rootDir}/data/userDummyData.json`);
        return JSON.parse(data);
    } catch (err) {
        console.error(`Data get failed... : ${err.message}`);
    }
}

function writeUserData(data) {
    try {
        fs.copyFileSync(
            `${rootDir}/data/userDummyData.json`,
            `${rootDir}/data/userDummyData_bu.json`,
        );
        fs.writeFileSync(
            `${rootDir}/data/userDummyData.json`,
            JSON.stringify(data),
            'utf8',
        );
        return true;
    } catch (err) {
        console.log(err.message);
    }
}

//GET
export const getUserSession = async (req, res, next) => {
    //세션 오류로 인한 유저 정보 하드 코딩
    res.status(200).json(req.session.user);
    // const userData = {
    //     user_id: '1731411547609',
    //     profile_img: `/public/assets/images/profile_img.webp`,
    //     email: 'eddie@test.io',
    //     nickname: 'eddie.lee',
    // };
    // console.log(req.session.user);

    // res.json(userData);
};

export const isDuplicate = async (req, res, next) => {
    try {
        const dataType = req.query.type;
        const inputData = req.query.input;
        if (!dataType || !inputData) {
            throw new Error(`invalid data type`);
        }

        const userData = getUserData();
        switch (dataType) {
            case 'email':
                if (userData.find(user => user.email === inputData)) {
                    res.status(200).json({
                        message: 'check duplicate success',
                        data: true,
                    });
                    return;
                }
                break;
            case 'nickname':
                if (userData.find(user => user.nickname === inputData)) {
                    res.status(200).json({
                        message: 'check duplicate success',
                        data: true,
                    });
                    return;
                }
                break;
        }
        res.status(200).json({
            message: 'check duplicate success',
            data: false,
        });
    } catch (err) {
        res.status(404).json({
            message: 'check duplicate fail',
            data: err.message,
        });
    }
};

//POST
export const signup = async (req, res) => {
    try {
        const userData = req.body;
        const getUsers = getUserData();
        getUsers.push(userData);
        writeUserData(getUsers);
        res.status(201).json({
            message: 'sign up success',
            data: null,
        });
    } catch (err) {
        res.status(404).json({
            message: 'sign up failed...',
            data: err.message,
        });
    }
};

export const sendUser = async (req, res) => {
    try {
        const users = getUserData();
        const user = users.find(
            user =>
                user.email === req.body.email &&
                user.passwd === req.body.passwd,
        );
        delete user.passwd;
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({
            message: 'Get user data Failed...',
            data: err.message,
        });
    }
};

export const modifyUser = async (req, res) => {
    try {
        const userId = req.userData.user_id;
        const profileImg = req.userData.profile_img;
        const nickname = req.userData.nickname;
        const getData = getUserData();
        const users = getData.map(user =>
            user.user_id === userId
                ? { ...user, profile_img: profileImg, nickname: nickname }
                : user,
        );
        writeUserData(users);
        res.status(200).json({
            message: 'modify_user_info_success',
            data: null,
        });
    } catch (err) {
        res.status(404).json({
            message: 'modify_user_info_success',
            data: err.message,
        });
    }
};

export const modifyUserPasswd = async (req, res, next) => {
    try {
        const userId = req.newPasswd.user_id;
        const newPasswd = req.newPasswd.passwd;

        const getData = getUserData();
        const users = getData.map(user =>
            user.user_id === userId ? { ...user, passwd: newPasswd } : user,
        );
        writeUserData(users);

        res.status(200).json({ message: `modify passwd success`, data: null });
    } catch (err) {
        res.status(404).json({
            message: `modify passwd failed..`,
            data: err.message,
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.session.user.user_id;
        const getData = getUserData();
        const users = getData.filter(user => user.user_id !== userId);
        writeUserData(users);
        res.status(200).json({ message: 'delete user success', data: null });
    } catch (err) {
        res.status(404).json({
            message: 'delete user fail',
            data: err.message,
        });
    }
};

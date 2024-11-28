import env from '../config/dotenv.js';
import fs, { writeFile } from 'fs';

const baseUrl = env.API_BASE_URL;
const rootDir = env.ROOT_DIR;

function getData(dataType) {
    try {
        if (dataType !== 'comment' && dataType !== 'post') {
            throw new Error('invalid type');
        }
        const data = fs.readFileSync(
            `${rootDir}/data/${dataType}DummyData.json`,
        );
        return JSON.parse(data);
    } catch (err) {
        console.error(`Data get failed... : ${err.message}`);
    }
}

function writeData(dataType, data) {
    try {
        fs.copyFileSync(
            `${rootDir}/data/${dataType}DummyData.json`,
            `${rootDir}/data/${dataType}DummyData_bu.json`,
        );
        fs.writeFileSync(
            `${rootDir}/data/${dataType}DummyData.json`,
            JSON.stringify(data),
            'utf8',
        );
        return true;
    } catch (err) {
        console.log(err.message);
    }
}

//PATCH

export const modifyUserData = async (req, res, next) => {
    try {
        const userId = req.userData.user_id;
        const profileImg = req.userData.profile_img;
        const nickname = req.userData.nickname;

        //게시글의 사용자 정보 수정
        const getPosts = getData('post');
        const posts = getPosts.map(post =>
            post.user_id === userId
                ? { ...post, profile_img: profileImg, nickname: nickname }
                : post,
        );
        writeData('post', posts);
        //댓글의 사용자 정보 수정
        const getComments = getData('comment');
        const comments = getComments.map(comment =>
            comment.user_id === userId
                ? { ...comment, profile_img: profileImg, nickname: nickname }
                : comment,
        );
        writeData('comment', comments);
        next();
    } catch (err) {
        next(err);
    }
};

//DELETE

export const deleteUserWrites = async (req, res, next) => {
    try {
        const userId = req.userData.userId;
        const getComments = getData('comment');
        const comments = getComments.filter(
            comment => comment.user_id !== userId,
        );
        writeData('comment', comments);

        const getPosts = getData('post');
        const posts = getPosts.filter(post => post.user_id !== userId);
        writeData('post', posts);

        next();
    } catch (err) {
        console.error(err.message);
    }
};

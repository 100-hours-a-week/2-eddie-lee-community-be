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

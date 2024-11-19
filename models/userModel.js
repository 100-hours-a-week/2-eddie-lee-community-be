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

function updateUserData() {}

export const sendUsers = async (req, res) => {
    try {
        const userId = req.params.userId;
        const users = getUserData();
        const user = users.find(user => user.user_id === userId);
        delete user.passwd;
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({
            message: 'Get user data Failed...',
            data: err.message,
        });
    }
};

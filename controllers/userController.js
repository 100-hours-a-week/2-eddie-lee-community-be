import env from '../config/dotenv.js';
import * as userDAO from '../DAO/userDAO.js';
import fs from 'fs';

const baseUrl = env.API_BASE_URL;
const rootDir = env.ROOT_DIR;

//GET
export const getUserSession = async (req, res, next) => {
    if (req.session.user) {
        res.status(200).json(req.session.user);
    } else {
        res.status(404).json({ message: 'session not exist' });
    }
};

//PATCH
export const modifyUser = async (req, res, next) => {
    try {
        const profileImg = req.file
            ? `/public/images/profileImages/${req.file.filename}`
            : null;
        const { nickname } = req.body;

        const sessionData = req.session.user;
        const userId = sessionData.user_id;
        const userData = {
            user_id: userId,
            profile_img: profileImg,
            nickname: nickname,
        };
        (await userDAO.updateUser(userData))
            ? res.json({ message: 'modify user success', data: 'null' })
            : res.status(404).json({ message: 'modify user fail', data: null });
    } catch (err) {
        next(err);
    }
};

export const modifyUserPasswd = async (req, res, next) => {
    try {
        const { modifyPasswd } = req.body;
        const userData = {
            user_id: req.session.user.user_id,
            passwd: modifyPasswd,
        };
        (await userDAO.updatePasswd(userData))
            ? res.json({ message: 'modify passwd success', data: null })
            : res
                  .status(404)
                  .json({ message: 'modify passwd fail', data: null });
    } catch (err) {
        next(err);
    }
};

//DELETE
export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.session.user.user_id;
        userDAO.deleteUser(userId);
        fs.unlink(req.session.user.profileImg, err => {
            if (err) {
                console.error('Failed to delete file', err.message);
            } else {
                console.log('Profile image delete success.');
            }
        });
        res.json({ message: 'delete user success', data: null });
    } catch (err) {
        console.error(err.message);
    }
};

export const deleteSession = async (req, res, next) => {
    if (req.session && req.session.user) {
        req.session.destroy(err => {
            if (err) {
                return next(err);
            }
            console.log('Previous session cleared');
        });
    }
    res.clearCookie('connect.sid');
    res.status(200).send('Session cleared');
};

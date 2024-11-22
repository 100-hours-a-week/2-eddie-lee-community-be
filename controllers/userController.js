import env from '../config/dotenv.js';

const baseUrl = env.API_BASE_URL;
const rootDir = env.ROOT_DIR;

//PATCH
export const modifyUser = async (req, res, next) => {
    try {
        const profileImg = req.file
            ? `${rootDir}/public/assets/images/defaultPostImg.png`
            : `${rootDir}/public/images/profileImages/${req.file.filename}`;
        const { nickname } = req.body;
        //const userId = req.params.userId;
        const sessionData = req.session.user;
        const userId = sessionData.userId;
        req.userData = {
            user_id: userId,
            profile_img: profileImg,
            nickname: nickname,
        };
    } catch (err) {
        console.error(err.message);
    }
    next();
};

export const modifyUserPasswd = async (req, res, next) => {
    try {
        const { modifyPasswd } = req.body;
        req.newPasswd = {
            user_id: req.session.user.userId,
            passwd: modifyPasswd,
        };
        next();
    } catch (err) {
        console.error(err.message);
    }
};

//DELETE
export const deleteUser = async (req, res, next) => {
    try {
        req.userData = { userId: req.session.user.userId };
        next();
    } catch (err) {
        console.err(err.message);
    }
};

export const deleteSession = async (req, res, next) => {
    if (req.session && req.session.user) {
        req.session.destroy(err => {
            if (err) {
                return next(err);
            }
            res.clearCookie('connect.sid');
        });
    }
};

import env from '../config/dotenv.js';
import * as userDAO from '../DAO/userDAO.js';

const baseUrl = env.API_BASE_URL;
const rootDir = env.ROOT_DIR;
//GET
export const isDuplicate = async (req, res, next) => {
    try {
        const { type, input } = req.query;
        if (!type || !input) {
            throw new Error(`invalid data type`);
        }
        const result = await userDAO.findIsDuplicate(type, input);
        if (result) {
            return res.status(200).json({
                message: 'check duplicate success',
                data: true,
            });
        }
        return res.status(200).json({
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
export const login = async (req, res, next) => {
    const loginInfo = req.body;
    const email = loginInfo.email;
    const passwd = loginInfo.passwd;
    try {
        const authUser = await userDAO.login(email, passwd);
        if (!authUser || !authUser.id) {
            console.log('login failed');
            return res.status(401).json({
                message: 'no user exist.',
                login_result: 'failed',
            });
        }

        console.log('login success');
        req.session.user = {
            user_id: authUser.id,
            nickname: authUser.nickname,
            profileImg: authUser.profileImg,
            email: authUser.email,
        };
        return res.status(200).json({
            message: 'Login success',
            data: null,
        });
    } catch (err) {
        next(err);
    }
};

export const signup = async (req, res, next) => {
    try {
        const textData = req.body;
        const fileData = req.file
            ? `/public/images/profileImages/${req.file.filename}`
            : null;

        const addUserData = {
            profile_img: fileData,
            email: textData.email,
            passwd: textData.passwd,
            nickname: textData.nickname,
        };
        const result = await userDAO.addUser(addUserData);
        if (!result) {
            throw new Error(`signup failed..`);
        }
        res.status(200).json({
            message: 'signup success',
            data: null,
        });
    } catch (err) {
        next(err);
    }
};

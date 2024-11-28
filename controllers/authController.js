import env from '../config/dotenv.js';
import * as userDAO from '../DAO/userDAO.js';

const baseUrl = env.API_BASE_URL;
const rootDir = env.ROOT_DIR;

//POST
export const login = async (req, res, next) => {
    //세션의 존재 여부 미리 확인
    if (req.session && req.session.user) {
        return req.session.destroy(err => {
            if (err) {
                return next(err);
            }
            res.clearCookie('connect.sid');
            console.log('Previous session cleared');
        });
    }

    const loginInfo = req.body;
    const email = loginInfo.email;
    const passwd = loginInfo.passwd;
    try {
        const authUser = await userDAO.login(email, passwd);
        if (!authUser || !authUser.id) {
            console.log('login failed');
            res.status(401).json({
                message: 'no user exist.',
                login_result: 'failed',
            });
        } else {
            console.log('login success');
            req.session.user = {
                user_id: authUser.id,
                nickname: authUser.nickname,
                profile_img: authUser.profileImg,
                email: authUser.email,
            };
            console.log(req.session.user);
            res.status(200).json({
                message: 'Login success',
                data: null,
            });
        }
    } catch (err) {
        next(err);
    }
};

export const signup = async (req, res) => {
    try {
        const textData = req.body;
        const fileData = req.file
            ? `/public/userPhotos/${req.file.filename}`
            : null;

        const addUserData = {
            profile_img: fileData,
            email: textData.email,
            passwd: textData.passwd,
            nickname: textData.nickname,
        };
        const result = await userDAO.addUser(addUserData);
        if (result) {
            res.status(200).json({
                message: 'signup success',
                data: null,
            });
        } else {
            throw new Error(`signup failed..`);
        }
    } catch (err) {
        res.status(404).json({
            message: 'signup fail',
            data: err.message,
        });
    }
};

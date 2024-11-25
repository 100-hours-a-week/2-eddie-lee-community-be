import env from '../config/dotenv.js';

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
        const authUser = await fetch(`${baseUrl}/data/user`, {
            method: 'POST',
            body: JSON.stringify({ email: email, passwd: passwd }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(async res => {
            if (res.ok) {
                return await res.json();
            } else {
                throw new Error(`auth user failed.. invalid response`);
            }
        });
        if (!authUser || !authUser.user_id) {
            console.log('login failed');
            res.status(401).json({
                message: 'no user exist.',
                login_result: 'failed',
            });
        } else {
            console.log('login success');
            req.session.user = {
                user_id: authUser.user_id,
                nickname: authUser.nickname,
                profile_img: authUser.profile_img,
                email: authUser.email,
            };
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
            : `${rootDir}/public/assets/profile_img.webp`;

        const addUserData = {
            user_id: Date.now().toString(),
            profile_img: fileData,
            email: textData.email,
            passwd: textData.passwd,
            nickname: textData.nickname,
        };
        await fetch(`${baseUrl}/data/auth/signup`, {
            method: 'POST',
            body: JSON.stringify(addUserData),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(async res => {
            if (res.ok) {
                return await res.json();
            } else {
                throw new Error(`sign up fail`);
            }
        });
        res.status(200).json({
            message: 'signup success',
            data: null,
        });
    } catch (err) {
        res.status(404).json({
            message: 'signup success',
            data: err.message,
        });
    }
};

import env from '../config/dotenv.js';
import fs from 'fs';

const baseUrl = env.API_BASE_URL;
const rootDir = env.ROOT_DIR;

//POST
export const login = async (req, res) => {
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
        if (!authUser) {
            console.log('login failed');
            res.status(401).json({
                message: 'no user exist.',
                login_result: 'failed',
            });
        } else {
            console.log('login success');
            req.session.user = {
                userId: authUser.user_id,
                userNickname: authUser.nickname,
                userProfileImg: authUser.profile_img,
                userEmail: authUser.email,
            };
            res.status(200).json({
                message: 'Login success',
                data: null,
            });
        }
    } catch (err) {
        console.error('Error fetching user data:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
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

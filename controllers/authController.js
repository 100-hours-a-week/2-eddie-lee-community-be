import env from '../config/dotenv.js';
import fs from 'fs';

const baseUrl = env.API_BASE_URL;
const rootDir = env.ROOT_DIR;

//POST
export const login = async (req, res) => {
    const loginInfo = req.body;
    const email = loginInfo.email;
    const passwd = loginInfo.passwd;
    let users = [];
    try {
        const getUsers = await fetch(`${baseUrl}/data/users`);
        users = await getUsers.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    const user = users.find(
        findUser => findUser.email === email && findUser.passwd === passwd,
    );
    if (!user) {
        console.log('login failed');
        res.status(404).json({
            message: 'no user exist.',
            login_result: 'failed',
        });
    } else {
        console.log('login success');
        req.session.user = {
            userId: user.user_id,
            userNickname: user.nickname,
            userProfileImg: user.profile_img,
            userEmail: user.email,
        };

        res.status(200).json({
            message: 'Login success',
            user: req.session.user,
        });
    }
};

export const signup = async (req, res) => {
    const textData = req.body;
    let fileData = req.file; // 파일이 없으면 undefined가 됩니다

    if (!fileData) {
        fileData = '/public/images/profile_img.webp';
    } else {
        const filePath = `/public/userPhotos/${req.file.filename}`;
        fileData = filePath;
    }

    const addUserData = {
        user_id: Date.now().toString(),
        profile_img: fileData,
        email: textData.email,
        passwd: textData.passwd,
        nickname: textData.nickname,
    };
    const originData = await fetch(`${baseUrl}/data/userDummyData.json`)
        .then(res => res.json())
        .catch(error => console.error(`데이터 가져오기 실패: ${error}`));
    originData.push(addUserData);
    console.log(originData);
    try {
        fs.writeFileSync(
            `${rootDir}/data/userDummyData.json`,
            JSON.stringify(originData, null, 2),
        );
        res.status(200).send('데이터 추가 완료');
    } catch (error) {
        res.status(500).send('데이터 추가 실패');
    }
};

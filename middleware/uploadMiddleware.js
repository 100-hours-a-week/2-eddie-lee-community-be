import multer from 'multer';
import env from '../config/dotenv.js';

const rootDir = env.ROOT_DIR;

const profileImg = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${rootDir}/public/images/profileImages`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const postImg = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = `${rootDir}/public/images/postImages`;
        //ensureDir(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const uploadProfileImg = multer({
    storage: profileImg,
    fileFilter,
});

const uploadPostImg = multer({
    storage: postImg,
    fileFilter,
});

export { uploadPostImg, uploadProfileImg };

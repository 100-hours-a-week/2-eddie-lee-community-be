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
        cb(null, `${rootDir}/public/images/postImages`);
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
    profileImg,
    fileFilter,
});

const uploadPostImg = multer({ postImg, fileFilter });

export { uploadPostImg, uploadProfileImg };

import multer from 'multer';
import env from '../config/dotenv.js';
import AWS from 'aws-sdk';

// S3 설정
const s3 = new AWS.S3({
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region: env.AWS_REGION,
});

// Multer 메모리 저장소
const storage = multer.memoryStorage();

// 파일 필터
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Multer 설정
const uploadProfileImg = multer({
    storage: storage,
    fileFilter,
});

const uploadPostImg = multer({
    storage: storage,
    fileFilter,
});

// S3 업로드 함수
const uploadToS3 = async (fileBuffer, bucketPath, fileName, mimeType) => {
    const params = {
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: `${bucketPath}/${fileName}`,
        Body: fileBuffer,
        ContentType: mimeType,
        ACL: 'public-read',
    };
    return s3.upload(params).promise();
};

// 프로필 이미지 업로드 미들웨어
const handleProfileImgUpload = async (req, res, next) => {
    try {
        if (!req.file) {
            // 파일이 없으면 S3 업로드를 건너뛰고 계속 진행
            req.file = null;
            return next();
        }

        const fileName = Date.now() + '-' + req.file.originalname;
        req.file.filename = fileName;
        const s3Response = await uploadToS3(
            req.file.buffer,
            'public/images/profileImages',
            fileName,
            req.file.mimetype,
        );

        // S3 업로드 결과를 req.file에 저장
        req.file.location = s3Response.Location;
        next();
    } catch (error) {
        next(error);
    }
};

// 포스트 이미지 업로드 미들웨어
const handlePostImgUpload = async (req, res, next) => {
    try {
        if (!req.file) {
            req.file = null;
            return next();
        }

        const fileName = Date.now() + '-' + req.file.originalname;
        req.file.filename = fileName;
        const s3Response = await uploadToS3(
            req.file.buffer,
            'public/images/postImages',
            fileName,
            req.file.mimetype,
        );

        req.file.location = s3Response.Location;
        next();
    } catch (error) {
        next(error);
    }
};

export {
    uploadProfileImg,
    uploadPostImg,
    handleProfileImgUpload,
    handlePostImgUpload,
};

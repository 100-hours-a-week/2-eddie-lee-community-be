import multer from 'multer';
import env from '../config/dotenv.js';
import AWS from 'aws-sdk';

const rootDir = env.ROOT_DIR;

const s3 = new AWS.S3({
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region: env.AWS_REGION,
});

const storage = multer.memoryStorage();

const uploadProfileImg = async (req, res, next) => {
    try {
        await new Promise((resolve, reject) => {
            setMulter(req, res, err => {
                if (err) reject(err);
                else resolve();
            });
        });

        const fileName = Date.now() + '-' + req.file.originalname;
        const s3Response = await uploadToS3(
            req.file.buffer,
            'public/images/profileImages',
            fileName,
            req.file.mimeType,
        );

        req.file.location = s3Response.Location;
    } catch (error) {
        next(error);
    }
};

const uploadPostImg = async (req, res, next) => {
    try {
        await new Promise((resolve, reject) => {
            setMulter(req, res, err => {
                if (err) reject(err);
                else resolve();
            });
        });

        const fileName = Date.now() + '-' + req.file.originalname;
        const s3Response = await uploadToS3(
            req.file.buffer,
            'public/images/postImages',
            fileName,
            req.file.mimeType,
        );

        req.file.location = s3Response.Location;
    } catch (error) {
        next(error);
    }
};

const fileFilter = (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

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

const setMulter = multer({
    storage: storage,
    fileFilter,
});

export { uploadPostImg, uploadProfileImg };

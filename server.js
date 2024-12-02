import dotenv from 'dotenv';
import app from './app.js';
import express from 'express';
import userRouter from './routes/userRoutes.js';
import postRouter from './routes/postRoutes.js';
import authRouter from './routes/authRoutes.js';
import cors from 'cors';
import path from 'path';

dotenv.config();
const port = process.env.PORT;
const router = express.Router();
app.use(
    cors({
        origin: 'http://52.78.44.85:7777', // 허용할 도메인
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // 허용할 HTTP 메서드
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true, // 쿠키를 포함한 요청을 허용하려면 true로 설정
    }),
);
app.options('*', cors());
app.use(
    '/public',
    express.static(path.join(process.env.PROJECT_ROOT, 'public')),
);
app.use(router);
router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/auth', authRouter);

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

import dotenv from 'dotenv';
import app from './app.js';
import express from 'express';
import userRouter from './routes/userRoutes.js';
import postRouter from './routes/postRoutes.js';
import authRouter from './routes/authRoutes.js';
import dataRouter from './routes/dataRoutes.js';

dotenv.config();
const port = 3000;
const router = express.Router();
app.use(router);
router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/auth', authRouter);
router.use('/data', dataRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

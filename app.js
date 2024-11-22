import express from 'express';
import session from 'express-session';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: 'your-secret-key',
        resave: false, // 변경되지 않은 세션을 저장하지 않음
        saveUninitialized: false, // 초기화되지 않은 세션 저장 방지
        cookie: {
            httpOnly: true, // 클라이언트에서 쿠키 접근 방지
            secure: false, // HTTPS가 아니면 false
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 30,
        },
    }),
);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;

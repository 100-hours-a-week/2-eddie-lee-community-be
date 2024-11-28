import dotenv from 'dotenv';
import path from 'path';

const result = dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const env = {
    PORT: process.env.PORT || 3000,
    ROOT_DIR: process.env.PROJECT_ROOT,
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
    DB_HOST: process.env.DB_HOST,
    DB_ID: process.env.DB_ID,
    DB_PASS: process.env.DB_PASS,
    DB_PORT: process.env.DB_PORT,
    DATABASE: process.env.DATABASE,
};

export default env;

import dotenv from 'dotenv';
import path from 'path';

const result = dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const env = {
    PORT: process.env.PORT || 3000,
    ROOT_DIR: process.env.PROJECT_ROOT,
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
};

export default env;

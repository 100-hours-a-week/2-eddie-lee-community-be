import env from '../config/dotenv.js';
import fs, { writeFile } from 'fs';

const baseUrl = env.API_BASE_URL;
const rootDir = env.ROOT_DIR;

function getData(dataType) {
    try {
        if (dataType !== 'comment' && dataType !== 'post') {
            throw new Error('invalid type');
        }
        const data = fs.readFileSync(
            `${rootDir}/data/${dataType}DummyData.json`,
        );
        return JSON.parse(data);
    } catch (err) {
        console.error(`Data get failed... : ${err.message}`);
    }
}

function writeData(dataType, data) {
    try {
        fs.copyFileSync(
            `${rootDir}/data/${dataType}DummyData.json`,
            `${rootDir}/data/${dataType}DummyData_bu.json`,
        );
        fs.writeFileSync(
            `${rootDir}/data/${dataType}DummyData.json`,
            JSON.stringify(data),
            'utf8',
        );
        return true;
    } catch (err) {
        console.log(err.message);
    }
}

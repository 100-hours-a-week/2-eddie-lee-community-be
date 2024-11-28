import dotenv from './dotenv.js';
import mariadb from 'mysql2/promise';

const dbInfo = mariadb.createPool({
    host: dotenv.DB_HOST,
    user: dotenv.DB_ID,
    password: dotenv.DB_PASS,
    database: dotenv.DATABASE,
    port: dotenv.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const runQuery = async (query, params = []) => {
    try {
        const [rows] = await dbInfo.execute(query, params);
        return rows;
    } catch (err) {
        console.error('Database query error:', err.message);
        throw err;
    }
};

const runTransaction = async transactionCallback => {
    let connection;
    try {
        connection = await dbInfo.getConnection();
        await connection.beginTransaction();
        const result = await transactionCallback(connection);
        await connection.commit();
        return result;
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Transaction failed:', err.message);
        throw err;
    } finally {
        if (connection) connection.release();
    }
};

export { runQuery, runTransaction };

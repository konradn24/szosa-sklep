const mysql = require('mysql2');

const makeUsersDb = require("./users-db");
const makeProductsDb = require("./products-db");
const makeOrdersDb = require("./orders-db");
const makeVerificationDb = require("./verification-db");

const { errors, AppError } = require("../utils/errors");
const logger = require('../services/logger');

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
}).promise();

async function checkConnection() {
    const test = await connection.getConnection();
    test.release();
}

async function makeDb() {
    return connection;
}

async function makeQuery({ sql, params=[] }) {
    try {
        const db = await makeDb();
        const [rows, fields] = await db.query(sql, params);

        logger.info(`Query success: ${sql} [${params}]`);

        return { rows: rows, fields: fields };
    } catch(err) {
        throw new AppError(errors.sqlError, 'SQL query failed.', ['Original error', 'Params'], [err, params], true);
    }
}

const usersDb = makeUsersDb({ makeQuery });
const productsDb = makeProductsDb({ makeQuery });
const ordersDb = makeOrdersDb({ makeQuery });
const verificationDb = makeVerificationDb({ makeQuery });

module.exports = { checkConnection, usersDb, productsDb, ordersDb, verificationDb };
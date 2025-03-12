require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const loggingMiddleware = require('./middlewares/logging');
const securityMiddleware = require('./middlewares/security');
const languageMiddleware = require('./middlewares/language');
const logger = require('./utils/logger');

const app = express();

app.set('view engine', "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    rolling: true
}));

app.use("/", loggingMiddleware.log);

const rootRouter = require("./routers/root");
const authRouter = require('./routers/auth');
const dashboardRouter = require("./routers/dashboard");

app.use("/", rootRouter);
app.use("/auth", authRouter);
app.use("/dashboard", securityMiddleware.verifyAccess, dashboardRouter);

async function start() {
    try {
        const apiConnection = await get("");

        if(!apiConnection.database) {
            logger.warn("Problem with API's database detected.");
        }

        logger.info("API connection OK.");
    } catch(error) {
        logger.error(`API connection ERROR: ${error.message}`);
    }

    const server = app.listen(process.env.PORT || 3000, () => {
        logger.info(`Server started listening on port ${server.address().port}.`);
    });
}

start();
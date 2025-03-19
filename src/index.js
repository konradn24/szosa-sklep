require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

// const loggingMiddleware = require('./middlewares/logging');
// const securityMiddleware = require('./middlewares/security');
const logger = require('./utils/logger');
const { checkConnection } = require('./data-access');

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

// app.use("/", loggingMiddleware.log);

const { root } = require("./routers");
// const authRouter = require('./routers/auth');
// const dashboardRouter = require("./routers/dashboard");

app.use("/", root);
// app.use("/auth", authRouter);
// app.use("/dashboard", securityMiddleware.verifyAccess, dashboardRouter);

async function start() {
    try {
        await checkConnection();

        logger.info("Database connection OK.");
    } catch(error) {
        logger.error(`Database connection ERROR: ${error.message}`);
    }

    const server = app.listen(process.env.PORT || 3000, () => {
        logger.info(`Server started listening on port ${server.address().port}.`);
    });
}

start();
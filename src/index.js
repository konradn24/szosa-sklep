require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const securityMiddleware = require('./middlewares/security');
const logger = require('./services/logger');
const { checkConnection } = require('./data-access');

global.appRoot = path.resolve(path.join(__dirname, '../'));

const app = express();

app.set('view engine', "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    rolling: true
}));

const { root, auth, admin, cart, order, myAccount } = require("./routers");

app.use("/", root);
app.use("/koszyk", cart);
app.use("/zamowienie", order);
app.use("/auth", auth);
app.use("/zarzadzanie-sklepem", securityMiddleware.checkAdminAccess, admin);
app.use("/moje-konto", myAccount);

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
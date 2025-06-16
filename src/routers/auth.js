const express = require('express');
const { createHash } = require('crypto');

const { AppError, errors } = require('../utils/errors');
const { getUserByLogin, authUser, addUser, updateUser, removeUser } = require('../use-cases/user');
const { getVerification, addVerification, removeVerification } = require('../use-cases/verification');

const { makeUser, makeVerification } = require('../entities');
const { sendMail } = require('../services/mailer');

const logger = require("../services/logger");

const router = express.Router();

router.post('/', async (req, res) => {
    const { login, password } = req.body;

    if(!login || !password) {
        return res.redirect(`/logowanie?error=${errors.unauthorized[0]}`);
    }

    const encryptedPassword = createHash('sha256').update(password).digest('hex');

    let authenticated;

    try {
        authenticated = await authUser({ login: login, password: encryptedPassword });
    } catch(error) {
        logger.error(error);
        return res.redirect(`/logowanie?error=${error.appCode}`);
    }

    req.session.user = authenticated;

    return res.redirect(`/?action=login&success=${encodeURIComponent(authenticated.name)}`);
});

router.post('/logout', (req, res) => {
    let name = req.session.user ? req.session.user.name : undefined;
    req.session.user = undefined;

    return res.redirect(`/?action=logout&success=${encodeURIComponent(name)}`);
});

router.post('/register', async (req, res) => {
    if(req.session.user) {
        return res.redirect('/');
    }

    const userData = req.body;

    if(!userData || typeof userData.login !== 'string') {
        return res.redirect(`/rejestracja?error=${errors.invalidData[0]}`);
    }

    userData.password = userData.password1;
    delete userData.password1;
    delete userData.password2;

    userData.login = userData.login.toLowerCase();
    userData.password = createHash('sha256').update(userData.password).digest('hex');

    let userExists;

    try {
        userExists = await getUserByLogin({ login: userData.login, name: userData.name });
    } catch(error) {
        if(!(error instanceof AppError) || error.appCode !== errors.notFound[0]) {
            logger.error(error);
            return res.redirect(`/rejestracja?error=${error.appCode}`);
        }
    }

    if(userExists) {
        return res.redirect(`/rejestracja?error=${errors.alreadyExists}`);
    }

    let result;

    try {
        const user = makeUser({
            login: userData.login,
            password: userData.password,
            name: userData.name
        }, true);

        result = await addUser({ user });
    } catch(error) {
        logger.error(error);
        return res.redirect(`/rejestracja?error=${error.appCode}`);
    }

    req.session.user = result;

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    let verification;

    try {
        verification = makeVerification({
            login: result.login,
            code: verificationCode
        }, true);

        verification = await addVerification({ verification });
    } catch(error) {
        logger.error(error);
        return res.redirect(`/rejestracja?error=${error.appCode}`);
    }

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: result.login,
        subject: "Szosa Sklep - weryfikacja adresu E-Mail",
        html: `<h1>Dziękujemy za rejestrację!</h1><p><a href="${process.env.HOME_URL}/auth/verify?code=${verificationCode}">Zweryfikuj swój adres E-mail klikając w ten link!</a></p>`
    }

    const mailSent = await sendMail(mailOptions);

    if(!mailSent) {
        return res.redirect('/?action=login&mail=false');
    }

    return res.redirect('/?action=login&mail=true');
});

router.get('/verify', async (req, res) => {
    const code = req.query.code;

    if(!code) {
        return res.redirect(`/?action=verify&error=${errors.notFound}`);
    }

    let verification;

    try {
        verification = await getVerification({ code });
    } catch(error) {
        logger.error(error);
        return res.redirect(`/?action=verify&error=${error.appCode}`);
    }

    let user;

    try {
        user = await getUserByLogin({ login: verification.login });
    } catch(error) {
        logger.error(error);
        return res.redirect(`/?action=verify&error=${error.appCode}`);
    }

    user.verified = true;

    let updatedUser;

    try {
        updatedUser = await updateUser({ user });
    } catch(error) {
        logger.error(error);
        return res.redirect(`/?action=verify&error=${error.appCode}`);
    }

    if(req.session.user) {
        req.session.user = updatedUser;
    }

    try {
        await removeVerification({ id: verification.id });
    } catch(error) {
        logger.error(`Failed to remove verified user's verification record (ID ${verification.id}): ${error}`);
    }

    return res.redirect(`/?action=verify&success=${encodeURIComponent(req.session.user.login)}`);
});

router.post('/delete-account', async (req, res) => {
    if(!req.session.user) {
        return res.redirect('/');
    }

    let result;

    try {
        result = await removeUser({ id: req.session.user.id });
    } catch(error) {
        logger.error(error);
        return res.redirect(`/moje-konto?action=delete&error=${error.appCode}`);
    }

    if(result.deletedCount === 0) {
        logger.warning(`User of ID ${req.session.user.id} not deleted!`);
        return res.redirect(`/moje-konto?action=delete&error=${errors.notDeleted}`);
    }

    return res.redirect('/?action=delete&success=true');
});

module.exports = router;
const express = require('express');
const { createHash } = require('crypto');
const nodemailer = require('nodemailer');

const { AppError, errors } = require('../utils/errors');
const { authUser, addUser } = require('../use-cases/user');
const { makeUser } = require('../entities');

const router = express.Router();

router.post('/', async (req, res) => {
    const { login, password } = req.body;

    if(!login || !password) {
        return res.redirect(`/logowanie?error=${errors.forbidden[0]}`);
    }

    const encryptedPassword = createHash('sha256').update(password).digest('hex');

    let authenticated;

    try {
        authenticated = await authUser({ login: login, password: encryptedPassword });
    } catch(error) {
        console.error(error);
        return res.redirect(`/logowanie?error=${error.appCode}`);
    }

    req.session.user = authenticated;

    return res.redirect('/?action=login&success=0');
});

router.post('/logout', (req, res) => {
    req.session.user = undefined;

    return res.redirect('/');
});

router.post('/register', async (req, res) => {
    const userData = req.body.user;

    if(!userData || typeof userData.login !== 'string') {
        return res.redirect(`/rejestracja?error=${errors.invalidData[0]}`);
    }

    userData.login = userData.login.toLowerCase();
    userData.password = createHash('sha256').update(userData.password).digest('hex');

    let userExists;

    try {
        userExists = await getUserByLogin({ login: userData.login, name: userData.name });
    } catch(error) {
        if(!(error instanceof AppError) || error.appCode !== errors.notFound[0]) {
            console.error(error);
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
            name: userData.name,
            admin: false
        });

        result = await addUser({ user });
    } catch(error) {
        console.error(error);
        return res.redirect(`/rejestracja?error=${error.appCode}`);
    }

    req.session.user = result;

    // TODO generate e-mail verification code and save to db
    const verificationCode = '000000';

    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: result.login,
        subject: "Szosa Sklep - weryfikacja adresu E-Mail",
        html: `<h1>Dziękujemy za rejestrację!</h1><p><a href="localhost:3000/auth/verify?code=${verificationCode}">Zweryfikuj swój adres E-mail klikając w ten link!</a></p>`
    }

    // TODO sending mail with promise
    let mailSuccess;

    transporter.sendMail(mailOptions, function(error, info) {
        if(error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    return res.redirect('/?action=login&success=0');
});

module.exports = router;
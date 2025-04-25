const nodemailer = require('nodemailer');
const logger = require('./logger');

async function sendMail(mailOptions) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: process.env.MAIL_SERVICE,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        transporter.sendMail(mailOptions, function(error, info) {
            console.log(error)

            if(error) {
                logger.error("NodeMailer error: " + error);
                resolve(false);
            } else {
                logger.info('Email sent: ' + info.response);
                resolve(true);
            }
        });
    });
}

module.exports = { sendMail };
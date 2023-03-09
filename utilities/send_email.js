var path = require("path");
require('dotenv').config({ path: __dirname + '/.env' });
const logger = require('./logger/logger');
const nodemailer = require('nodemailer');

module.exports = async (user, type, token = null) => {
    let html = `<strong>error in send email</strong>`
    let subject = "error in send email";

    if (type === "user_otp_verification") {
        subject = `Verify your email`
        html = `Your OTP is <b>${token} </b>. It will expire in 1 hour.`
    }
    if (type === "user_forgot_password") {
        subject = 'Verify your email'
        html = `Your OTP is <b> ${token} </b>. It will expire in 1 hour.`
    }

    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD
        }
    });

    let mailDetails = {
        from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
        to: user.email,
        subject,
        html
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            logger.error('error in nodemailer: ', err);
            throw err;
        } else {
            logger.info('Email sent successfully');
        }
    });

}

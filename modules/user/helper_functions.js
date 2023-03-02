const logger = require('../../utilities/logger/logger');
const userRepo = require('../../db_services/user_repo');
const sendEmail = require("../../utilities/send_email");
const bcrypt = require('bcrypt');

module.exports = {
    sendEmailVerification: async (user, emailType) => {
        try {
            const otp = Math.floor(1000 + Math.random() * 9000);
            const hashedOtp = await bcrypt.hash(otp.toString(), 10);
            logger.info('otp: ', otp);
            await userRepo.createUserOtp({
                user: user._id,
                otp: hashedOtp,
                expiresAt: Date.now() + 3600000,
            });
            if (emailType = "user_otp_verification")
                await sendEmail(user, emailType, otp);
            if (emailType = "user_forgot_password")
                await sendEmail(user, emailType, otp);
            return {
                status: true,
                message: "User otp verification email sent",
                data: {
                    user: user._id,
                    email: user.email
                }
            };
        } catch (error) {
            logger.error('unable to send otp!', error);
            throw error;
        }
    },
}
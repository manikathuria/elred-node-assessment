const cryptHash = require("../../utilities/bcrypt/crypt_hash")
const bcryptCompare = require("../../utilities/bcrypt/bcrypt_compare")
const handleErrors = require("../../utilities/controllers/handle_errors")
const joiModel = require("./joi_models")
const signToken = require("../../utilities/jwt/sign_token")
const userRepo = require('../../db_services/user_repo');
const logger = require('../../utilities/logger/logger')
// const uuid4 = require("uuid4");
const {
    sendEmailVerification
} = require('./helper_functions');
const { ObjectId } = require("mongodb")


module.exports = {
    register: async (req, res) => {
        try {
            console.log(req.body, "user register req body")
            const validation = joiModel.userRegisterReq.validate(req.body)
            if (validation.error) {
                return res.status(200).send({
                    message: validation.error.message ?? "something went wrong",
                    success: false,
                    data: {}
                })
            }
            validatedUser = validation.value

            const user = await userRepo.readUser({ email: validatedUser.email });
            if (user.length > 0) {
                return res.status(200).send({
                    message: "User with same email already exist",
                    success: false,
                    data: {}
                })
            };

            validatedUser.password = await cryptHash(validatedUser.password)
            const createdUser = await userRepo.createUser(validatedUser)
            logger.info('user: ', createdUser);
            delete validatedUser.password 

            //user verification code
            await sendEmailVerification(createdUser, "user_otp_verification");

            return res.status(200).send({
                message: "Please check your email for otp!",
                success: true,
                data: createdUser
            })

        } catch (err) {
            return handleErrors(err, res);
        }
    },

    login: async (req, res) => {
        try {
            logger.info(req.body, "user login req body")
            const validation = joiModel.userLoginReq.validate(req.body)
            if (validation.error) {
                return res.status(200).send({
                    message: validation.error.details.message,
                    success: false,
                    data: {}
                })
            }

            validatedUser = validation.value;
            const user = await userRepo.readUser({ email: validatedUser.email });
            if (!user || user.length <= 0) {
                return res.status(400).send({
                    message: "user not found! Please sign up",
                    success: false,
                    data: {}
                })
            }

            if (!user[0].isEmailVerified) {
                return res.status(200).send({
                    message: "user is not verified! resend otp to verify again.",
                    success: false,
                    data: {}
                })
            }

            let match = await bcryptCompare(validatedUser.password, user[0].password)
            if (!match) {
                return res.status(200).send({
                    message: "Invalid email or password",
                    success: false,
                    data: {}
                });
            } else {
                delete user[0]["_doc"]["password"];
                return res.status(200).send({
                    message: "signin success",
                    success: true,
                    data: {
                        ...user[0]["_doc"],
                        "token": signToken({...validatedUser, _id: user[0]._id})
                    }
                });
            }
        } catch (err) {
            return handleErrors(err, res);
        }
    },

    verifyOtp: async (req, res) => {
        try {
            const validation = joiModel.verifyOtpReq.validate(req.body)
            if (validation.error) {
                return res.status(200).send({
                    message: validation.error.message ?? "something went wrong",
                    success: false,
                    data: {}
                })
            }

            validatedReq = validation.value
            const { email, otp } = validatedReq;
            const checkUserOtpResponse = await userRepo.checkUserOtp({ user: new ObjectId(validatedReq._id) });
            if (!checkUserOtpResponse) {
                return res.status(400).json({
                    status: false,
                    message: 'Account record does not exist or has been verified. Please sign up or log in!',
                    data: []
                })
            }

            if (checkUserOtpResponse.expiresAt <= Date.now()) {
                await userRepo.deleteExpiredOtp({ user: new ObjectId(validatedReq._id) });
                return res.status(400).json({
                    status: false,
                    message: 'Code has expired! Please sign up again',
                    data: []
                })
            }

            const validOtp = await bcryptCompare(otp.toString(), checkUserOtpResponse.otp);
            if (!validOtp) {
                return res.status(400).json({
                    status: false,
                    message: `Invalid otp! ${otp}`,
                    data: []
                })
            }

            await userRepo.updateUser(
                { _id: new ObjectId(validatedReq._id) },
                {
                    isEmailVerified: true,
                    whenVerified: Date.now()
                });
            await userRepo.deleteExpiredOtp({ user: new ObjectId(validatedReq._id) });
            return res.status(200).json({
                status: true,
                message: "User email verified successfully!",
                data: {
                    _id: validatedReq._id,
                    email
                }
            })

        } catch (err) {
            return handleErrors(err, res);
        }
    },

    resendOtp: async (req, res) => {
        try {
            const validation = joiModel.resendOtpReq.validate(req.body)
            if (validation.error) {
                return res.status(200).send({
                    message: validation.error.message ?? "something went wrong",
                    success: false,
                    data: {}
                })
            }
            validatedUser = validation.value

            await userRepo.deleteExpiredOtp(validatedUser);
            const emailVerificationResponse = await sendEmailVerification(validatedUser, "user_otp_verification");
            res.send(emailVerificationResponse);

        } catch (err) {
            return handleErrors(err, res);
        }
    }
}


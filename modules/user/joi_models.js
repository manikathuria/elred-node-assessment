const joi = require("joi");

module.exports = {
    userRegisterReq: joi.object({
        name: joi.string().min(1).max(60).required(),
        email: joi.string().email({ minDomainSegments: 2 }).required(),
        password: joi.string().min(2).max(150).required(),
    }),

    userLoginReq: joi.object({
        email: joi.string().email({ minDomainSegments: 2 }).required(),
        password: joi.string().min(2).max(150).required(),
    }),

    verifyOtpReq: joi.object({
        _id: joi.string().required(),
        email: joi.string().email({ minDomainSegments: 2 }).required(),
        otp: joi.number().required()
    }),

    resendOtpReq: joi.object({
        _id : joi.string().required(),
        email: joi.string().email({ minDomainSegments: 2 }).required(),
    })
}

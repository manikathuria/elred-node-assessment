const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserOtpVerificationSchema = new Schema({
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
}, {timestamps: true});

const UserOtpVerification = mongoose.model("User_otp_verification", UserOtpVerificationSchema);

module.exports = UserOtpVerification

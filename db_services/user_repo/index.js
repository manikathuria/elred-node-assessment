const User = require('../../data/models/User');
const UserOtpVerification = require('../../data/models/User_otp_verification')
const { getDb } = require("../../db_connection");
const logger = require('../../utilities/logger/logger');
const db = getDb();


module.exports = {
    createUser: async (userData) => {
        try {
            await new User(userData).save();
            let res = await User.findOne({email: userData.email, isDeleted: false});

            return res;
        } catch (err) {
            throw err;
        }
    },

    readUser: async (filter) => {
        try {
            let res = await User.find({...filter, isDeleted: false}).select('+password');
            return res;
        } catch (err) {
            throw err;
        }
    },

    updateUser: async (_id, data) => {
        try {
            return User.findOneAndUpdate({ _id }, {
                $set: {
                    ...data
                }
            });
        } catch (err) {
            throw err;
        }
    },

    createUserOtp: async (data) => {
        try {
            data.expiresAt = Date.now() + 3600000;
            return await new UserOtpVerification(data).save();
        } catch (err) {
            throw err;
        }
    },

    checkUserOtp: async (filter) => {
        try {
            return UserOtpVerification.findOne(filter);
        } catch (err) {
            throw err;
        }
    },

    deleteExpiredOtp: async (filter) => {
        try {
            return UserOtpVerification.deleteOne(filter);
        } catch (err) {
            throw err;
        }
    }
}
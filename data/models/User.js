const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,  
        unique: true
    },
    password: {
        type: String,
        select: false
    },
    name: {
        type: String,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    whenVerified: {
        type: String
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
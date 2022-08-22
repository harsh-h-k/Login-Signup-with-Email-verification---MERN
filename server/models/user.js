const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    isVerified : {
        type : Boolean,
        default : false,
        required : true
    }
}, { timestamps : true })

const user = mongoose.model("user", userSchema)

const userSessionSchema = new mongoose.Schema({
    id : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        required : true
    },
    startTime : {
        type : Date,
        required : true
    },
    endTime : {
        type : Date,
        required : true
    },
    isExpired : {
        type : Boolean,
        default : false
    }
}, { timestamps : true })

const userSession = mongoose.model("userSession", userSessionSchema)


const otpSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    type : {
        type : String,
        enum : ["signup","forgotPassword"],
        default : "signup",
        required : true
    },
    isValidated : {
        type : Boolean,
        default : false
    },
    otp : {
        type : String,
        required : true
    },
    isExpired : {
        type : Boolean,
        default : false
    },
    expiry : {
        type : Date,
        required : true
    }
}, { timestamps : true })

const otps = mongoose.model("otps", otpSchema)

module.exports = {
    user,
    userSession,
    otps
}
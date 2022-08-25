const { successResponse, failResponse, errorResponse } = require('..//helpers/response')
const { v4: uuidv4 } = require('uuid')
const userModel = require("../models/user")
const userFuncs = require("../functions/loginSignupFuncs")
var validator = require('validator')
const crypto = require('crypto')
const tokenFunc = require("../helpers/token")
const emailFunc = require("../helpers/email")

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Check If all params are received or not
        if (!name || !email || !password) {
            return failResponse(req, res, "Enter name, email and password")
        }

        // Validate email, password length and user already registered or not 
        const validateEmail = validator.isEmail(email)
        if (!validateEmail) {
            return failResponse(req, res, "Entered email is inValid")
        }
        if (password.length < 6) {
            return failResponse(req, res, "minimum password length required : 6 characters")
        }
        const checkEmail = await userFuncs.ifEmailAlreadyRegistered(email)
        if (checkEmail) {
            return failResponse(req, res, "email already registered, kindly login.")
        }
        // sendOtp By Type 
        const sendOtp = await emailFunc.sendEmail(email, "signup")

        // Insert record of new user 

        const user = new userModel.user({
            userId: uuidv4(),
            password: crypto.createHash("md5").update(password).digest("hex"),
            name,
            email,
            isVerified: false
        })
        const data = await user.save()

        //    return success result 
        return successResponse(req, res, "successfully registered")
    } catch (error) {
        console.log(error)
        return errorResponse(req, res, error)
    }
}

const login = async (req, res) => {
    try {
        let { email, password } = req.body

        if (!email || !password) {
            return failResponse(req, res, "Enter email and password")
        }

        //    Check if user registered or not 
        const checkEmail = await userFuncs.ifEmailAlreadyRegistered(email)
        if (!checkEmail) {
            return failResponse(req, res, "No Account associated with this email found. kindly register")
        }

        // Get details with that email 
        const userData = await userModel.user.find({ email: email })

        if (!(userData[0].isVerified)) {
            return failResponse(req, res, "Please verify email first")
        }

        // match password 
        password = crypto.createHash("md5").update(password).digest("hex")
        if (password !== userData[0].password) {
            return failResponse(req, res, "password incorrect")
        }

        // create session with expiry of 7 days 
        const currentDate = new Date()
        const tokenExpiryDate = currentDate.setDate(currentDate.getDate() + 6)
        const userSession = new userModel.userSession({
            id: uuidv4(),
            userId: userData[0].userId,
            startTime: new Date(),
            endTime: tokenExpiryDate
        })
        const userSessionData = await userSession.save()

        // Generate token 
        const token = await tokenFunc.generateToken(userData[0], userSessionData)

        return successResponse(req, res, {
            userId: userData[0].userId,
            name: userData[0].name,
            token
        })
    } catch (error) {
        console.log(error)
        return errorResponse(req, res, error)
    }
}

const verifyEmail = async (req, res) => {
    try {
        const {email, type, otp} = req.body
        const typeArr = ["signup","forgotPassword"]
        if(!(typeArr.includes(type))){
            return failResponse(req, res, "inValid type")
        }

        if (!email) {
            return failResponse(req, res, "Enter email")
        }

        //    Check if user registered or not 
        const checkEmail = await userFuncs.ifEmailAlreadyRegistered(email)
        if (!checkEmail) {
            return failResponse(req, res, "No Account associated with this email found. kindly register")
        }

        const getOtp = await userModel.otps.find({
            email,
            type,
            isExpired : false
        })
        let verifyOtp = false
        if(getOtp.length > 0){
            if(getOtp[0].otp == otp){
                const updateOtp = await userModel.otps.updateMany({email,type},{
                    $set : {
                        "isValidated" : true,
                        "isExpired" : true
                    }
                })

                const updateUser = await userModel.user.updateOne({email},{
                    $set : {
                        "isVerified" : true
                    }
                })
                verifyOtp = true
            }
        } 
        if(verifyOtp){
            return successResponse(req, res,"otp verified")
        }
        return failResponse(req, res, "inValid Otp")

    } catch (error) {
        console.log(error)
        return errorResponse(req, res, error)
    }
}

const resetPassword = async (req, res) => {
    try {
        const {email, otp, password} = req.body
        if (!email || !otp || !password) {
            return failResponse(req, res, "Enter email, otp and password")
        }

        const validateEmail = validator.isEmail(email)
        if (!validateEmail) {
            return failResponse(req, res, "Entered email is inValid")
        }
        
        //    Check if user registered or not 
        const checkEmail = await userFuncs.ifEmailAlreadyRegistered(email)
        if (!checkEmail) {
            return failResponse(req, res, "No Account associated with this email found. kindly register")
        }

        if (password.length < 6) {
            return failResponse(req, res, "minimum password length required : 6 characters")
        }

        const type = "forgotPassword"
    
        const getOtp = await userModel.otps.find({
            email,
            type,
            isExpired : false
        })
        let verifyOtp = false
        if(getOtp.length > 0){
            if(getOtp[0].otp == otp){
                const updateOtp = await userModel.otps.updateMany({email,type},{
                    $set : {
                        "isValidated" : true,
                        "isExpired" : true
                    }
                })

                const updateUser = await userModel.user.updateOne({email},{
                    $set : {
                        "isVerified" : true
                    }
                })
                verifyOtp = true
            }
        } 
        if(verifyOtp){
            const updateUser = await userModel.user.updateOne({email},{
                $set : {
                    "password" :   crypto.createHash("md5").update(password).digest("hex")
                }
            })
          return successResponse(req, res, "password updated")
        }
        return failResponse(req, res, "inValid Otp")

    } catch (error) {
        console.log(error)
        return errorResponse(req, res, error)
    }
}

const resendOtp = async (req, res) => {
    try {
        let { email ,type} = req.body

        if (!email) {
            return failResponse(req, res, "Enter email")
        }

        //    Check if user registered or not 
        const checkEmail = await userFuncs.ifEmailAlreadyRegistered(email)
        if (!checkEmail) {
            return failResponse(req, res, "No Account associated with this email found. kindly register")
        }
        // sendOtp By Type 
        const sendOtp = await emailFunc.sendEmail(email, type)

        return successResponse(req, res, "success")
    } catch (error) {
        console.log(error)
        return errorResponse(req, res, error)
    }
}

module.exports = {
    registerUser,
    login,
    verifyEmail,
    resetPassword,
    resendOtp
}
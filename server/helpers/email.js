require('dotenv').config();
const nodemailer = require('nodemailer');
const userModel = require('../models/user')
const loginSignupFuncs = require("../functions/loginSignupFuncs")

const generateOtp = () => {
    let otp = ""
    for (let i = 0; i < 6; i++) {
        otp = otp + Math.floor(Math.random() * 10)
    }
    return otp
}

const sendEmail = async (email, type) => {
    await loginSignupFuncs.removePreviousOtp(email)

    let mailTransporter = nodemailer.createTransport({
    
        service: 'gmail',
        auth: {
            user: process.env.Email_Add,
            pass: process.env.Email_Password
        }
    });

    let subject
    if (type === "signup") {
        subject = "Signup : MindDeft Task By Harsh Kesharwani"
    }
    if (type === "forgotPassword") {
        subject = "Forgot Password : MindDeft Task By Harsh Kesharwani"
    }

    const otp = generateOtp()
    const currentDate = new Date()
    const expiryDate = currentDate.setDate(currentDate.getDate() + 1)
    const saveOtp = new userModel.otps({
        email,
        type,
        otp,
        isValidated: false,
        expiry: expiryDate
    })

    await saveOtp.save()

    let text = ` Hello, I hope you are doing well. Your OTP is : ${otp} . Note : It is valid for only 24hrs. `


    let mailDetails = {
        from: process.env.Email_Add,
        to: email,
        subject,
        text
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log(err)
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
            status = true
        }
    });

}

module.exports = {
    sendEmail
}
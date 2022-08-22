const express = require('express')
const router = express.Router()
const loginSignupCont = require("../controller/loginSignupCont")

router.post("/registerUser", loginSignupCont.registerUser)
router.post("/login", loginSignupCont.login)
router.post("/verifyEmail", loginSignupCont.verifyEmail)
router.post("/resendOtp", loginSignupCont.resendOtp)
router.post("/resetPassword", loginSignupCont.resetPassword)


module.exports = router
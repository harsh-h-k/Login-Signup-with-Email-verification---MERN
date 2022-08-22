const express = require('express')
const router = express.Router()
const userProfileCont = require("../controller/userProfileCont")

router.get("/getUserProfile", userProfileCont.getUserProfile)
router.post("/updateUserDetails", userProfileCont.updateUserDetails)
router.post("/logout", userProfileCont.logout)

module.exports = router
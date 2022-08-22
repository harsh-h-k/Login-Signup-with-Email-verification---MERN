const express = require('express')
const app = express()
const {authenticateToken} = require('../helpers/token')
const loginSignup = require('./loginSignup')
const userProfile = require('./userProfile')

app.use("/public", loginSignup)
app.use("/user",authenticateToken, userProfile)

module.exports = app
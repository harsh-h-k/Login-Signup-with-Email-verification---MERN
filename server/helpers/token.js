require('dotenv').config();
const jwt = require("jsonwebtoken")
const { successResponse, failResponse, errorResponse } = require('../helpers/response')
const loginFuncs = require("../functions/loginSignupFuncs")

const generateToken = async (userDetails, session) => {
    const token = jwt.sign(
        {
            user: {
                userId: userDetails.userId,
                name: userDetails.name
            },
            session: {
                id : session.id,
                startTime: session.startTime,
                endTime: session.endTime,
                isExpired: session.isExpired
            }
        }, process.env.Token_Secret
    )
    return token
}

function authenticateToken(req, res, next) {
    if (req.headers.authorization === undefined) {
        return errorResponse(req, res, "noBearerToken", "authFailed")
    }

    const bearerToken = req.headers.authorization
    const bearer = bearerToken.split(" ")
    const token = bearer[1]

    jwt.verify(
        token,
        process.env.Token_Secret,
        async (error, data) => {
            if (error) {
                return errorResponse(
                    req,
                    res,
                    "Token Verification Failed",
                    403
                )
            } else {
                
                const userId = data.user.userId
                const sessionDetails = data.session
                let sessionData = await loginFuncs.getSessionDetailsById(sessionDetails.id)
                const currentDate = new Date()
                if ((sessionData.isExpired) || ( currentDate > sessionData.endTime) )
                {
                    await loginFuncs.closeSession(sessionDetails.id)
                    return errorResponse(
                        req,
                        res,
                        "Session Expired",
                        403
                    )
                }

                await loginFuncs.refreshSession(sessionDetails.id)
                sessionData = await loginFuncs.getSessionDetailsById
                req.user = data.user
                req.session = sessionDetails
                next()
            }
        }
    )


}

module.exports = {
    generateToken,
    authenticateToken
}
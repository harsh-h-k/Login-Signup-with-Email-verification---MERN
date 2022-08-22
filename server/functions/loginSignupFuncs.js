const userModel = require("../models/user")

const ifEmailAlreadyRegistered = async (email) => {
    const check = await userModel.user.find({ email: email })
    if (check.length > 0) {
        return true
    }
    return false
}

const refreshSession = async (id) => {

    const currentDate = new Date()
    const tokenExpiryDate = currentDate.setDate(currentDate.getDate() + 6)

    const check = await userModel.user.updateOne({ id }, {
        $set: {
            "endTime": tokenExpiryDate
    }
    })

    return true
}

const closeSession = async (id) => { 
 
    const check = await userModel.userSession.updateOne({ id }, {
        $set: {
            "isExpired": true
    }
    })

    return true
}

const getSessionDetailsById = async (id) => { 
 
    const check = await userModel.userSession.findOne({ id })
    return check
}

const removePreviousOtp = async (email) => {

    const update = await userModel.otps.updateMany({
        email
    }, {
        $set : {
            "isExpired" : true
        }
    })
}


module.exports = {
    ifEmailAlreadyRegistered,
    refreshSession,
    closeSession,
    getSessionDetailsById,
    removePreviousOtp
}
const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET

const signToken = (payload) =>{
    return jwt.sign(payload,secretKey)
}

const verifToken = (token) =>{
    return jwt.verify(token,secretKey)
}

module.exports = {signToken, verifToken}
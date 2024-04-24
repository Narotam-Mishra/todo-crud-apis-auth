
const User = require('../models/userSchema')
const jwt = require('jsonwebtoken');

const { UnauthenticatedError } = require('../errors/index');

// auth middleware setup to verfiy jwt token
const auth = async (req,res,next) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError('Authentication invalid')
    }
    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
       
        // const user = User.findById(payload.id).select('-password')
        // req.user = user;

        // attach the user to job routes
        req.user = {userId:payload.userId, name:payload.name}
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }
}

module.exports = auth
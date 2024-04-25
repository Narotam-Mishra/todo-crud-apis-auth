
const User = require('../models/userSchema')
const jwt = require('jsonwebtoken');
const Todo = require('../models/todoSchema');

const { UnauthenticatedError, UnauthorizedError } = require('../errors/index');

// auth middleware setup to verfiy jwt token
const auth = async (req,res,next) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError('Authentication invalid')
    }
    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
       
        // Fetch the user from the database based on the user ID in the JWT payload
        const user = await User.findById(payload.userId);

        if (!user) {
            throw new UnauthenticatedError('Authentication invalid');
        }

        // Attach the user object to the request
        req.user = { userId: payload.userId };
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }
}

module.exports = auth
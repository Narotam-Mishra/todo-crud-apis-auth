
const UserModel = require('../models/userSchema');
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors/index');

// register setup
const register = async (req,res) => {
    // const {name, email, password } = req.body;

    // const tempUser = {name,email,password:hashedPassword}
    
    const user = await UserModel.create({...req.body })
    const token = user.createJWT();
    
    res.status(StatusCodes.CREATED).json({ user: {name: user.name}, token });
}

// login setup
const login = async (req,res) => {
    const { email, password } = req.body;

    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }

    const user = await UserModel.findOne({email});

    if(!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const isPasswordMatched = await user.comparePassword(password);

    // compare password
    if(!isPasswordMatched){
        throw new UnauthenticatedError('Invalid Credentials')
    }

    // if user exist then create token
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: {name: user.name }, token})
}

module.exports = {
    register, login
}
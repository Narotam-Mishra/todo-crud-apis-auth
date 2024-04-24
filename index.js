
require('dotenv').config();
require('express-async-errors');

// extra security packages
const cors = require('cors')

// express
const express = require('express');
const server = express();

// connect DB
const DBConnection = require('./db/connectDB');

// authentication middleware import to protect user
const authenticateUser = require('./middleware/authentication')

// auth & job router imports
const authRouter = require('./routes/authRoutes');
const todoRouter = require('./routes/todoRoutes');

// error handler middlewares
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// to use json data
server.use(express.json());

// middleware setup for additional packages
server.use(cors())

server.use(express.static('./public'));

// home route
server.get('/', (req,res) => {
    res.send('Welcome Todo List App');
})

// login & register routes
server.use('/api/v1/auth',authRouter);

// jobsAPI route
server.use('/api/v1/todos', authenticateUser, todoRouter);

server.use(notFoundMiddleware);
server.use(errorHandlerMiddleware);

const portNo = process.env.PORT || 6464;
const Mongo_URI = process.env.mongoURL;

const startService = async () => {
    try {
        await DBConnection(Mongo_URI)
        .then(() => console.log('DB Connected'))
        server.listen(portNo, () => {
            console.log(`Server is listening on port ${portNo}...`);
        })
    } catch (error) {
        console.log(error);
    }
}

startService();
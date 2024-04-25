
require('dotenv').config();
require('express-async-errors');

// security package
const cors = require('cors')

// express
const express = require('express');
const server = express();

// connect DB
const DBConnection = require('./db/connectDB');

// authentication middleware import to protect user
const authenticateUser = require('./middleware/authentication')

// auth & todo router imports
const authRouter = require('./routes/authRoutes');
const todoRouter = require('./routes/todoRoutes');

// error handler middlewares
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// to use json data
server.use(express.json());

// middleware setup for additional packages
server.use(cors())

// to server static html file
server.use(express.static('./public'));

// home route
server.get('/', (req,res) => {
    res.send('Welcome to Todo List App');
})

// login & register routes
server.use('/api/v1/auth',authRouter);

// router path setup for todos-APIs
server.use('/api/v1/todos', authenticateUser, todoRouter);

server.use(notFoundMiddleware);
server.use(errorHandlerMiddleware);

// Set the port based on the environment
const portNo = process.env.NODE_ENV === 'production' ? process.env.PORT : 0;
const Mongo_URI = process.env.mongoURL;

const startService = async () => {
    try {
        await DBConnection(Mongo_URI)
        .then(() => console.log('DB Connected'))
        const httpServer = server.listen(portNo, () => {
            const actualPort = httpServer.address().port;
            console.log(`Server is listening on port ${actualPort}...`);
        })
        // Return the HTTP server instance for closing later
        return httpServer;
    } catch (error) {
        console.log(error);
    }
}

startService();

module.exports = { server, startService };



// logic to connect with DB 
const mongoose = require('mongoose');

const ConnectionSetup = (url) => {
    return mongoose.connect(url);
};

module.exports = ConnectionSetup;
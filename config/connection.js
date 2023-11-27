const mongoose = require('mongoose');

// local connection to mongoDB, with my database name
mongoose.connect('mongodb://127.0.0.1:27017/socialnetworkDB');

// Export connection 
module.exports = mongoose.connection;

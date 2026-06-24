const app = require('../server.js');
const mongoose = require('mongoose');
const connectDB = require('../config/db.js');
const { connectRedis } = require('../config/redis.js');

module.exports = async (req, res) => {
    // Connect MongoDB if not already connected (0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting)
    if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2) {
        await connectDB();
    }
    
    // Connect Redis (connectRedis internally checks if it's already open)
    await connectRedis();

    return app(req, res);
};

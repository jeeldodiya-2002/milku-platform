const app = require('../server.js');
const mongoose = require('mongoose');
const connectDB = require('../config/db.js');
const { connectRedis } = require('../config/redis.js');

let isConnected = false;

module.exports = async (req, res) => {
    if (!isConnected) {
        // Connect MongoDB if not already connected
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
        }
        // Connect Redis
        await connectRedis();
        isConnected = true;
    }

    return app(req, res);
};

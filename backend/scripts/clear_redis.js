const { redisClient } = require('../config/redis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const clear = async () => {
  try {
    console.log('Connecting to Redis:', process.env.REDIS_URL);
    await redisClient.connect();
    console.log('Connected!');
    await redisClient.flushAll();
    console.log('Redis Cleared Successfully!');
    process.exit();
  } catch (err) {
    console.error('Redis Clear Failed:', err);
    process.exit(1);
  }
};

clear();

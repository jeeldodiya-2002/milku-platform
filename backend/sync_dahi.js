const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { createClient } = require('redis');

dotenv.config();

const Product = require('./models/ProductModel');
const Category = require('./models/CategoryModel');

const sync = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Ensure Category is named exactly "Dahi" (as seen in the Main list)
        // OR rename to "Curd/Dahi" if preferred. Let's stick to "Dahi" as it was found.
        const cat = await Category.findOne({ name: /Dahi/i });
        if (cat) {
            console.log(`Found category: ${cat.name}`);
            // We'll standardize on "Dahi" for simplicity
            const targetName = "Dahi";
            
            // 2. Update all products to match "Dahi"
            const res = await Product.updateMany(
                { category: { $regex: /Dahi|Curd/i } },
                { $set: { category: targetName } }
            );
            console.log(`Updated ${res.modifiedCount} products to category: ${targetName}`);
        }

        // 3. Clear Redis Cache
        const redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
        await redisClient.connect();
        const keys = await redisClient.keys('products_*');
        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log(`🧹 Cleared ${keys.length} Redis cache keys`);
        }
        await redisClient.disconnect();

        console.log('✅ Sync Complete');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

sync();

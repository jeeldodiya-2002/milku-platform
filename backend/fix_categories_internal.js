const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from the backend directory
dotenv.config({ path: './.env' });

const Category = require('./models/CategoryModel');

const migrate = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI not found in .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const mainNames = ['PANEER', 'GHEE', 'CHASS', 'DAHI', 'BUTTERMILK/CHASS'];
        
        console.log('Targeting:', mainNames);

        // Case-insensitive update
        const results = await Category.updateMany(
            { name: { $in: mainNames.map(n => new RegExp(`^${n}$`, 'i')) } },
            { $set: { isMain: true } }
        );

        console.log(`Updated ${results.modifiedCount} categories to isMain: true`);
        
        // Also check if they exist
        const all = await Category.find({ isMain: true });
        console.log('Current Main Categories:', all.map(c => c.name));

        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();

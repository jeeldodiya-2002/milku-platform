const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: './.env' });

const Category = require('./models/CategoryModel');

const checkCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const categories = await Category.find();
        console.log('Total Categories:', categories.length);
        categories.forEach(cat => {
            console.log(`Name: ${cat.name}, isMain: ${cat.isMain}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkCategories();

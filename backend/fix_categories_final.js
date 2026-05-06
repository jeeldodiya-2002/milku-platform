const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: './.env' });

const Category = require('./models/CategoryModel');

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Target names based on database dump
        const mainNames = [
            'Paneer', 
            'Ghee', 
            'Buttermilk/Chass', 
            'Curd/Dahi'
        ];
        
        console.log('Enforcing Main Status for:', mainNames);

        const results = await Category.updateMany(
            { name: { $in: mainNames } },
            { $set: { isMain: true } }
        );

        console.log(`Updated ${results.modifiedCount} categories to isMain: true`);
        
        const all = await Category.find({ isMain: true });
        console.log('Final Main Categories:', all.map(c => c.name));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

migrate();

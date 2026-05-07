const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    category: String,
    isActive: Boolean
}));

const checkAllCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const categories = await Product.distinct('category');
        for (const cat of categories) {
            const products = await Product.find({ category: cat, isActive: true });
            console.log(`Category: ${cat} (${products.length} active products)`);
            products.forEach(p => console.log(`  - ${p.name}`));
        }

        await mongoose.connection.close();
    } catch (err) {
        console.error(err.message);
    }
};

checkAllCategories();

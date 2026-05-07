const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    category: String,
    isVisible: Boolean
}));

const checkSpecialItems = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const specialItems = await Product.find({ 
            category: { $regex: /^special items$/i }
        });

        console.log(`Total Products in Special Items: ${specialItems.length}`);
        specialItems.forEach(p => {
            console.log(`- ${p.name} (Visible: ${p.isVisible}, Category: ${p.category})`);
        });

        await mongoose.connection.close();
    } catch (err) {
        console.error(err.message);
    }
};

checkSpecialItems();

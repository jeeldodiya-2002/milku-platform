const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const inspect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to:', mongoose.connection.name);
    
    const Category = mongoose.connection.db.collection('categories');
    const cats = await Category.find({}).toArray();
    console.log('Categories Structure:', JSON.stringify(cats[0], null, 2));
    
    const Product = mongoose.connection.db.collection('products');
    const products = await Product.find({}).toArray();
    
    let hasObject = false;
    products.forEach(p => {
      if (typeof p.name === 'object') {
        console.log('Found Object Name in Product:', p._id, p.name);
        hasObject = true;
      }
    });
    
    if (!hasObject) console.log('All product names are strings.');
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

inspect();

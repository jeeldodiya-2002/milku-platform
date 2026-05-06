const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');
const { redisClient } = require('../config/redis');

const CATEGORIES = [
  'Buttermilk/Chass', 'Curd/Dahi', 'Paneer', 'Ghee',
  'Shrikhand', 'Lassi', 'Basundi', 'Penda', 'Barfi',
  'Halwa', 'Live Halwa', 'Cruz', 'Mava', 'Chikki',
  'Special Items', 'Other Items'
];

const PRODUCTS = [
  // BUTTERMILK
  { name: 'Fresh Buttermilk', category: 'Buttermilk/Chass', availableSizes: ['500 ML'], shortDescription: 'Pure, refreshing buttermilk crafted from farm-fresh milk.', frontImage: '/media/chass.png', backImage: '/media/chass.png', storageInstructions: 'Keep refrigerated at 4°C or below.' },
  // CURD
  { name: 'Fresh & Creamy Curd', category: 'Curd/Dahi', availableSizes: ['1 KG', '5 KG'], shortDescription: 'Thick, creamy and perfectly set curd for your daily meals.', frontImage: '/media/dahi.png', backImage: '/media/dahi.png', storageInstructions: 'Keep refrigerated.' },
  // PANEER
  { name: 'Medium Fat Paneer', category: 'Paneer', availableSizes: ['1 KG', '5 KG'], shortDescription: 'Soft and fresh paneer with balanced fat content.', frontImage: '/media/medium_fat_paneer.png', backImage: '/media/medium_fat_paneer.png', storageInstructions: 'Keep frozen or refrigerated.' },
  { name: 'Low Fat Soft Paneer', category: 'Paneer', availableSizes: ['1 KG', '5 KG'], shortDescription: 'Low fat paneer with extra softness.', frontImage: '/media/low_fat_soft_paneer.png', backImage: '/media/low_fat_soft_paneer.png', storageInstructions: 'Keep frozen or refrigerated.' },
  { name: 'Low Fat Hard Paneer', category: 'Paneer', availableSizes: ['1 KG', '5 KG'], shortDescription: 'Low fat paneer with firm texture, ideal for frying.', frontImage: '/media/low_fat_hard_paneer.png', backImage: '/media/low_fat_hard_paneer.png', storageInstructions: 'Keep frozen or refrigerated.' },
  { name: 'Malai Paneer', category: 'Paneer', availableSizes: ['1 KG', '5 KG'], shortDescription: 'Rich and creamy malai paneer for gourmet recipes.', frontImage: '/media/malai_paneer.png', backImage: '/media/malai_paneer.png', storageInstructions: 'Keep frozen or refrigerated.' },
  // GHEE
  { name: 'A2 Desi Cow Ghee', category: 'Ghee', availableSizes: ['500 ML', '1 L', '5 KG', '15 KG'], shortDescription: 'Pure A2 Desi Cow Ghee made with traditional Bilona method.', frontImage: '/media/a2_cow_ghee.png', backImage: '/media/a2_cow_ghee.png', storageInstructions: 'Store in a cool, dry place.' },
  { name: 'Buffalo Ghee', category: 'Ghee', availableSizes: ['500 ML', '1 L', '5 KG', '15 KG'], shortDescription: 'Rich and aromatic Buffalo Ghee.', frontImage: '/media/buffelo_ghee.png', backImage: '/media/buffelo_ghee.png', storageInstructions: 'Store in a cool, dry place.' },
  
  // SHRIKHAND
  ...['Mattho', 'Rajbhog', 'Mango', 'American Dry Fruit', 'Kesar Elaichi', 'Elaichi', 'Kaju Draksh', 'Kesar Dry Fruit', 'Badam Pista'].map(name => ({ name, category: 'Shrikhand', shortDescription: `Deliciously rich ${name} Shrikhand. Crafted from pure Milku curd for a truly traditional dessert experience.`, storageInstructions: 'Keep refrigerated.' })),
  
  // LASSI
  ...['Kesar Dry Fruit', 'Mava', 'Rose', 'Mango', 'Cold Coco'].map(name => ({ name, category: 'Lassi', shortDescription: `Refreshing and thick ${name} Lassi. A signature Milku beverage perfect for a hot day.`, storageInstructions: 'Keep refrigerated.' })),
  
  // BASUNDI
  ...['Plane', 'Kesar Dry Fruit', 'Kesar Angur', 'Anjir', 'Chandni Bahar', 'Sitafal', 'Mango Delight', 'Mango Fruit Plaza'].map(name => ({ name, category: 'Basundi', shortDescription: `Rich, creamy, and traditional ${name} Basundi by Milku. Made by slow-boiling pure milk for an authentic taste.`, storageInstructions: 'Keep refrigerated.' })),
  
  // PENDA
  ...['White', 'Kesar Elaichi', 'Thabdi', 'Milku Special'].map(name => ({ name, category: 'Penda', shortDescription: `Premium ${name} Penda crafted with pure Milku ghee and traditional recipes. Perfect for every celebration.`, storageInstructions: 'Store in a cool, dry place.' })),
  
  // BARFI
  ...['Gulkand', 'Anjir', 'Kalakand', 'Pista', 'Chocolate', 'Kesar', 'Rose', 'Akhrot', 'Compound'].map(name => ({ name, category: 'Barfi', shortDescription: `Exquisite ${name} Barfi. A classic Indian sweet made with the finest Milku dairy ingredients.`, storageInstructions: 'Store in a cool, dry place.' })),
  
  // HALWA
  ...['Bombay', 'Dry Fruit', 'Dudhi'].map(name => ({ name, category: 'Halwa', shortDescription: `Authentic ${name} Halwa crafted with the signature purity of Milku Dairy. A traditional delight.`, storageInstructions: 'Keep refrigerated.' })),
  
  // LIVE HALWA
  ...['Kaju Akhrot', 'Dry Fruit', 'Anjir', 'Gulkand', 'Gajar'].map(name => ({ name, category: 'Live Halwa', shortDescription: `Freshly prepared hot ${name} Halwa by Milku. Experience authentic taste.`, storageInstructions: 'Consume fresh.' })),
  
  // CRUZ
  ...['Raja Rani', 'Volcano', 'Madhu Malti', 'Almond Prain', 'Almond Florentine', 'Red Velvet', 'American', 'Royal Cream'].map(name => ({ name, category: 'Cruz', shortDescription: `Signature ${name} dairy delicacy crafted with the purity of Milku Dairy.`, storageInstructions: 'Keep refrigerated.' })),
  
  // MAVA
  ...['Sweet Mava', 'Molo Mavo', 'Cow Mava', 'Lal Mava', 'Special Lal Mava'].map(name => ({ name, category: 'Mava', shortDescription: `Pure ${name} for culinary use, made from 100% pure Milku milk.`, storageInstructions: 'Keep refrigerated.' })),
  
  // CHIKKI
  ...['Khajur Dry Fruit', 'Anjur Dry Fruit'].map(name => ({ name, category: 'Chikki', shortDescription: `Traditional ${name} brittle sweet made with nuts and jaggery by Milku.`, storageInstructions: 'Store in an airtight container.' })),
  
  // SPECIAL ITEMS
  ...['Premium Kaju Katri', 'Kesar Kaju Katri', 'Strawberry Kaju Katri', 'Kaju Kasata', 'Kaju Pan', 'Cadbury Ball', 'Coconut Ball', 'Roasted Almond Ball', 'Kaju Gajar', 'Meva Bite', 'Choco Bite', 'Orange Bite', 'Blueberry Bite', 'Kaju Anjir Role', 'Sangam Kaju Katri', 'Dry Fruit Laddu (Sugar Free)', 'Mix Dry Fruit Mithai'].map(name => ({ name, category: 'Special Items', shortDescription: `Premium ${name} sweet delicacy, specially crafted by Milku.`, storageInstructions: 'Store in a cool, dry place.' })),
  
  // OTHER ITEMS
  ...['Son Papadi', 'Premium Mohanthal', 'Magdal', 'Ghee Devada', 'Kalajam', 'Milk Cake', 'Premium Kesar Koprapak', 'Khir Kadam', 'Patisa', 'Kesar Gujiya', 'Kesar Motichur Laddu', 'Gulab Jamun', 'Ghee Bundi', 'Tel Bundi', 'Ghee Jalebi', 'Tel Jalebi'].map(name => ({ name, category: 'Other Items', shortDescription: `Traditional ${name} delicacy, made with love and purity by Milku.`, storageInstructions: 'Store appropriately.' }))
];

const seed = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    // Drop existing
    try { await Category.collection.drop(); } catch (e) { }
    try { await Product.collection.drop(); } catch (e) { }
    console.log('Dropped existing collections and indexes.');

    // Seed Categories
    const createdCats = await Category.insertMany(CATEGORIES.map(c => ({ name: c })));
    console.log(`Inserted ${createdCats.length} categories.`);

    // Seed Main Products
    const mainProducts = await Product.insertMany(PRODUCTS);
    console.log(`Inserted ${mainProducts.length} main products.`);

    // Clear Redis Cache
    if (redisClient.isOpen || true) {
      try {
        await redisClient.connect();
        await redisClient.flushAll();
        console.log('Redis Cache Cleared.');
      } catch (e) {
        console.log('Redis not reachable, skipping cache clear.');
      }
    }

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();


const express = require('express');
const router = express.Router();
const Category = require('../../models/CategoryModel');
const Product = require('../../models/ProductModel');
const { verifyToken } = require('../../middleware/auth');
const { clearProductCache } = require('../../controllers/public/productController');
const { getIO } = require('../../config/socket');

// Resolve any legacy {en, gu} bilingual objects to flat English strings
const resolveField = (val) => {
  if (!val) return val;
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && !Array.isArray(val)) {
    return val.en || Object.values(val)[0] || '';
  }
  return val;
};

const sanitizeCategory = (cat) => {
  const c = cat.toObject ? cat.toObject() : { ...cat };
  c.name = resolveField(c.name);
  return c;
};

// Get all categories (Public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, data: categories.map(sanitizeCategory) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create category (Admin)
router.post('/', verifyToken, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    await clearProductCache();
    getIO().emit('categories_updated');
    res.status(201).json({ success: true, data: sanitizeCategory(category) });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update category and its products (Admin)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const oldCategory = await Category.findById(req.params.id);
    if (!oldCategory) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const oldName = resolveField(oldCategory.name);
    const newName = req.body.name;

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    
    // Cascading Update: If name changed, update all products
    if (newName && oldName !== newName) {
      await Product.updateMany(
        { category: { $regex: new RegExp(`^${oldName}$`, 'i') } },
        { category: newName }
      );
    }

    await clearProductCache();
    getIO().emit('categories_updated');

    res.json({ success: true, data: sanitizeCategory(category) });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete category and its products (Admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Resolve the name in case it's still a legacy object
    const categoryName = resolveField(category.name);
    // Delete all products using a case-insensitive match for robustness
    await Product.deleteMany({ category: { $regex: new RegExp(`^${categoryName}$`, 'i') } });
    
    await category.deleteOne();
    await clearProductCache();
    getIO().emit('categories_updated');
    res.json({ success: true, message: 'Category and all associated products deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

const Product = require('../../models/ProductModel');
const { redisClient } = require('../../config/redis');

/**
 * Permanently resolves any legacy bilingual {en, gu} object fields to flat English strings.
 * This protects the frontend even if stale Redis cache or DB data still contains old objects.
 */
const resolveField = (val) => {
  if (!val) return val;
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && !Array.isArray(val)) {
    return val.en || Object.values(val)[0] || '';
  }
  return val;
};

const sanitizeProduct = (product) => {
  const p = product.toObject ? product.toObject() : { ...product };
  p.name = resolveField(p.name);
  p.category = resolveField(p.category);
  p.shortDescription = resolveField(p.shortDescription);
  p.storageInstructions = resolveField(p.storageInstructions);
  p.specialTag = resolveField(p.specialTag);
  return p;
};

/**
 * Automated Dairy Storage Intelligence
 * Generates optimal storage protocols based on product architecture.
 */
const getAutoStorageInstructions = (name, category) => {
  const n = `${name || ''} ${category || ''}`.toLowerCase();
  
  if (n.includes('ghee')) return "Store in a cool, dry place away from direct sunlight. No refrigeration required.";
  if (n.includes('paneer')) return "Keep refrigerated below 4°C. Submerge in water for extra softness after opening.";
  if (n.includes('dahi') || n.includes('curd') || n.includes('yogurt')) return "Refrigerate at 4°C or below. Consume fresh for best probiotic value.";
  if (n.includes('milk')) return "Store in refrigerator. Once opened, consume within 48 hours.";
  if (n.includes('butter')) return "Keep refrigerated. For easy spreading, keep at room temp for 10 mins before use.";
  if (n.includes('cheese')) return "Store in an airtight container in the refrigerator to prevent drying.";
  if (n.includes('chass') || n.includes('buttermilk') || n.includes('lassi')) return "Serve chilled. Store in refrigerator and shake well before consumption.";
  if (n.includes('shrikhand') || n.includes('sweets') || n.includes('mithai')) return "Refrigerate at all times. Best consumed within 7-10 days of production.";
  if (n.includes('khoya') || n.includes('mawa')) return "Store in refrigerator. Can be frozen for extended shelf life up to 1 month.";
  
  return "Store in a cool, refrigerated environment (below 4°C) to maintain artisan quality.";
};

// @desc    Fetch all products with 3D support (Cached)
const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const cacheKey = `products_${category || 'all'}_${!!req.headers.authorization}`;

    // Try Redis Cache first
    if (redisClient.isOpen) {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            // Sanitize cached data in case it contains stale bilingual objects
            parsed.data = parsed.data.map(sanitizeProduct);
            console.log(`[CACHE] Serving products via Redis: ${cacheKey}`);
            return res.status(200).json(parsed);
        }
    }

    let query = {};
    if (!req.headers.authorization) query.isActive = true;
    if (category && category !== 'all') query.category = category;
    
    console.log(`[DB] Fetching products for category: ${category || 'all'}`);
    const products = await Product.find(query).sort({ createdAt: -1 });
    const sanitized = products.map(sanitizeProduct);
    
    const responseData = { success: true, count: sanitized.length, data: sanitized };

    // Set Cache for 1 Hour
    if (redisClient.isOpen) {
        await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 3600 });
    }

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


const clearProductCache = async () => {
    if (redisClient.isOpen) {
        try {
            const keys = await redisClient.keys('*');
            const targetKeys = keys.filter(k => k.startsWith('products_') || k.startsWith('categories_'));
            if (targetKeys.length > 0) {
                await redisClient.del(targetKeys);
                console.log(`🧹 Cache Purged: ${targetKeys.join(', ')}`);
            }
        } catch (err) {
            console.error('Redis Clear Error:', err);
        }
    }
};

// @desc    Fetch Single Product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: sanitizeProduct(product) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Invalid Product ID' });
  }
};

// @desc    Create Product (3D Specialized Uploads)
const createProduct = async (req, res) => {
  try {
    let productData = req.body;
    
    // Handle Specialized Gallery & Legacy Image Parsing
    if (req.files) {
      if (req.files.frontImage) productData.frontImage = req.files.frontImage[0].path;
      if (req.files.backImage) productData.backImage = req.files.backImage[0].path;
      
      if (req.files.images) {
        const galleryPaths = req.files.images.map(img => img.path);
        productData.images = galleryPaths;
        
        // If no frontImage provided, use the first from gallery for compatibility
        if (!productData.frontImage && galleryPaths.length > 0) {
           productData.frontImage = galleryPaths[0];
        }
      }
    }

    const fields = ['availableSizes', 'ingredients', 'nutritionalInfo'];
    fields.forEach(f => {
      if (typeof productData[f] === 'string') {
        try { productData[f] = JSON.parse(productData[f]); } catch(e) {}
      }
    });

    // AUTOMATED STORAGE INTELLIGENCE
    productData.storageInstructions = getAutoStorageInstructions(productData.name, productData.category);

    const product = await Product.create(productData);
    await clearProductCache();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Create Product Error:', error.message);
    res.status(400).json({ success: false, message: error.message || 'Creation failed' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    let updateData = req.body;
    
    // Parse JSON fields if they are sent as strings (from FormData)
    const fields = ['availableSizes', 'ingredients', 'nutritionalInfo', 'features', 'removedImages'];
    fields.forEach(f => {
      if (typeof updateData[f] === 'string') {
        try { updateData[f] = JSON.parse(updateData[f]); } catch(e) {}
      }
    });

    const existingProduct = await Product.findById(id);
    if (!existingProduct) return res.status(404).json({ success: false, message: 'Not found' });

    let currentImages = [...(existingProduct.images || [])];

    // Handle Image Removals
    if (updateData.removedImages && Array.isArray(updateData.removedImages)) {
      currentImages = currentImages.filter(img => {
        const filename = img.split('/').pop();
        return !updateData.removedImages.includes(filename);
      });

      // If frontImage or backImage was removed, clear them or update them
      if (existingProduct.frontImage) {
        const frontFilename = existingProduct.frontImage.split('/').pop();
        if (updateData.removedImages.includes(frontFilename)) {
          updateData.frontImage = currentImages.length > 0 ? currentImages[0] : '';
        }
      }
      if (existingProduct.backImage) {
        const backFilename = existingProduct.backImage.split('/').pop();
        if (updateData.removedImages.includes(backFilename)) {
          updateData.backImage = '';
        }
      }
    }

    // Handle New Uploads
    if (req.files) {
      if (req.files.frontImage) updateData.frontImage = req.files.frontImage[0].path;
      if (req.files.backImage) updateData.backImage = req.files.backImage[0].path;

      if (req.files.images) {
        const newGalleryPaths = req.files.images.map(img => img.path);
        currentImages = [...currentImages, ...newGalleryPaths];
      }
    }

    // Set the final images gallery
    updateData.images = currentImages;

    // Ensure frontImage is synced if it was missing
    if (!updateData.frontImage && updateData.images.length > 0) {
       updateData.frontImage = updateData.images[0];
    }

    // RE-CALCULATE STORAGE IF NAME OR CATEGORY CHANGED (OR IF CURRENTLY MISSING)
    if (updateData.name || updateData.category) {
       updateData.storageInstructions = getAutoStorageInstructions(updateData.name, updateData.category);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
    if (!product) return res.status(404).json({ success: false, message: 'Not found' });
    await clearProductCache();
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('❌ UPDATE PRODUCT ENGINE FAILURE:', error.message);
    let errorMsg = 'Update failed';
    
    if (error.name === 'ValidationError') {
       errorMsg = Object.values(error.errors).map(val => val.message).join(', ');
    } else if (error.code === 11000) {
       errorMsg = 'Product name already exists';
    } else {
       errorMsg = error.message;
    }
    
    res.status(400).json({ success: false, message: `Update Engine: ${errorMsg}` });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Not found' });
    await clearProductCache();
    res.status(200).json({ success: true, message: 'Removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  clearProductCache
};

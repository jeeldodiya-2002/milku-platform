const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../../controllers/public/productController');
const { verifyToken } = require('../../middleware/auth');
const upload = require('../../config/cloudinary');

// Configuration for 3D Dual-Asset Upload
const cpUpload = upload.fields([
  { name: 'frontImage', maxCount: 1 }, 
  { name: 'backImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);

router.get('/', getProducts);
router.get('/:id', getProductById);

// RESILIENT MULTI-PART PARSER WITH ERROR CAPTURE
router.post('/', verifyToken, (req, res, next) => {
  cpUpload(req, res, (err) => {
    if (err) {
      console.error('🔥 UPLOAD ENGINE FAILURE:', err.message);
      return res.status(400).json({ success: false, message: `Image Engine: ${err.message}` });
    }
    next();
  });
}, createProduct);

router.put('/:id', verifyToken, (req, res, next) => {
  cpUpload(req, res, (err) => {
    if (err) {
      console.error('🔥 UPLOAD ENGINE FAILURE:', err.message);
      return res.status(400).json({ success: false, message: `Image Engine: ${err.message}` });
    }
    next();
  });
}, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

module.exports = router;

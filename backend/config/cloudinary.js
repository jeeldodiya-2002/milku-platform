const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'milku_products',
    allowed_formats: ['jpg', 'png', 'webp', 'jpeg'],
    public_id: (req, file) => {
      if (!file) return `milku_fallback_${Date.now()}`;
      const name = (file.originalname || 'image').split('.')[0].replace(/[^a-z0-9]/gi, '_');
      return `milku_${Date.now()}_${name}`;
    },
    // Transformation: Square crop and auto-quality
    transformation: [
      { width: 800, height: 800, crop: 'fill', gravity: 'auto' },
      { quality: 'auto', fetch_format: 'auto' }
    ],
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Increased to 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
  }
});

module.exports = upload;

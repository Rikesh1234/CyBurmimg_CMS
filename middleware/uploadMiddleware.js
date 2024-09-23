const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Helper function to ensure the directory exists
const ensureDirectoryExistence = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
};

// Multer storage configuration for different paths
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = './public/uploads/';
    
    // Store featured image in 'uploads/post/'
    if (file.fieldname === 'featured_image') {
      uploadPath = './public/uploads/post/';
    }
    
    // Store gallery images in 'uploads/post/gallery/'
    if (file.fieldname === 'gallery_images') {
      uploadPath = './public/uploads/post/gallery/';
    }

    // Ensure the directory exists
    ensureDirectoryExistence(uploadPath);

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter for image uploads
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit per file
  fileFilter: fileFilter
});

module.exports = upload;

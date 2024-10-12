const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Helper function to ensure the directory exists
const ensureDirectoryExistence = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
};

// Multer storage configuration for different paths
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "./public/uploads/";

    // Store featured image in 'uploads/post/'
    if (file.fieldname === "featured_image") {
      uploadPath = "./public/uploads/post/";
    }

    // Store gallery images in 'uploads/post/gallery/'
    else if (file.fieldname === "gallery_images") {
      uploadPath = "./public/uploads/post/gallery/";
    }

    // Store category images in 'uploads/category/'
    else if (file.fieldname === "category_image") {
      uploadPath = "./public/uploads/category/";
    }

    // Store author images in 'uploads/author/'
    else if (file.fieldname === "author_image") {
      uploadPath = "./public/uploads/author/";
    }
    // Store static page images in 'uploads/static_pages/'
    else if (file.fieldname === "static_page_image") {
      uploadPath = "./public/uploads/static_pages/";
    }
    // Store static page images in 'uploads/static_pages/'
    else if (file.fieldname === "testimonials_image") {
      uploadPath = "./public/uploads/testominal/";
    }
    // Store static page images in 'uploads/sliders/'
    else if (file.fieldname === "slider_image") {
      uploadPath = "./public/uploads/sliders/";
    }
    // Store static page images in 'uploads/static_pages/'
    else if (file.fieldname === "team_image") {
      uploadPath = "./public/uploads/teams/";
    }

    else if (file.fieldname === "user_image") {
      uploadPath = "./public/uploads/users/";
    }

    else if (file.fieldname == "ads_image"){
      uploadPath = "./public/uploads/ads";
    }

    // Ensure the directory exists
    ensureDirectoryExistence(uploadPath);

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Using Date.now() to ensure unique filenames
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter for image uploads
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
};

// Multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit per file
  fileFilter: fileFilter,
});

module.exports = upload;

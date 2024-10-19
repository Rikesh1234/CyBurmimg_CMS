const fs = require('fs');
const path = require('path');

// Directory containing your images
const imagesDir = path.join(__dirname, '..', '/public/images/login_background'); // Adjust the path if necessary

// Function to get all image files from the directory
const getImages = () => {
    return fs.readdirSync(imagesDir)
        .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext); // Add more extensions if needed
        });
};

// Function to get a random image URL from the local directory
const getRandomImage = () => {
    const images = getImages();
    if (images.length === 0) {
        throw new Error('No images found in the directory');
    }
    const randomIndex = Math.floor(Math.random() * images.length);
    return `/images/login_background/${images[randomIndex]}`; // Serve images from the /images directory
};

module.exports = {
    getRandomImage,
};

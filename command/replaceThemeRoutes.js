// command/replaceThemeRoute.js
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env

// Retrieve theme name from environment variable
const themeName = process.env.THEME;
if (!themeName) {
    console.error("Error: THEME_NAME is not defined in the environment variables.");
    process.exit(1);
}

// Define source and target paths
const themeRoutesPath = path.join(__dirname, `../theme/${themeName}/routes/themeRoutes.js`);
const cmsRoutesPath = path.join(__dirname, `../routes/themeRoutes.js`);

try {
    // Check if the theme routes file exists
    if (fs.existsSync(themeRoutesPath)) {
        // Ensure the CMS routes file exists; if not, create an empty one
        if (!fs.existsSync(cmsRoutesPath)) {
            fs.writeFileSync(cmsRoutesPath, '', 'utf8'); // Create an empty file
            console.log(`Created empty CMS routes file at ${cmsRoutesPath}`);
        }
        
        // Copy the theme routes file to the CMS routes directory
        fs.copyFileSync(themeRoutesPath, cmsRoutesPath);
        console.log(`Copied theme routes from ${themeRoutesPath} to ${cmsRoutesPath}`);
    } else {
        console.error(`Error: Source theme routes file does not exist at ${themeRoutesPath}`);
        process.exit(1);
    }

    console.log("CMS theme routes successfully replaced.");
} catch (error) {
    console.error("Error replacing CMS theme routes:", error);
    process.exit(1);
}

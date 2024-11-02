// scripts/replaceThemeConfig.js
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const themeName = process.env.THEME; // Read the theme name from .env
if (!themeName) {
    console.error("Error: THEME_NAME is not defined in the environment variables.");
    process.exit(1);
}

// Define paths for the theme config and CMS config files
const themeConfigPath = path.join(__dirname, `../theme/${themeName}/config/themeConfig.js`);
const cmsConfigPath = path.join(__dirname, '../config/themeConfig.js'); // Update with the actual path

try {
    // Check if the theme config file exists
    if (!fs.existsSync(themeConfigPath)) {
        console.error(`Error: Theme config file does not exist at ${themeConfigPath}`);
        process.exit(1);
    }

    // Read the theme config file
    const themeConfigContent = fs.readFileSync(themeConfigPath, 'utf8');

    // Write content to the CMS config file, creating it if it doesn't exist
    fs.writeFileSync(cmsConfigPath, themeConfigContent, 'utf8');
    console.log(`CMS config has been replaced with the theme config from: ${themeConfigPath}`);
} catch (error) {
    console.error("Error replacing CMS config:", error);
    process.exit(1);
}

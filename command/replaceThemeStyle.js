// command/replaceThemeStyle.js
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra'); // Requires fs-extra package for easy folder manipulation
require('dotenv').config(); // Load environment variables from .env

// Retrieve theme name from environment variable
const themeName = process.env.THEME;
if (!themeName) {
    console.error("Error: THEME_NAME is not defined in the environment variables.");
    process.exit(1);
}

// Define source and target paths
const themeSourcePath = path.join(__dirname, `../theme/${themeName}/public`);
const cmsPublicThemePath = path.join(__dirname, `../public/theme/${themeName}`);

try {
    // Remove existing CMS public theme directory if it exists
    if (fs.existsSync(cmsPublicThemePath)) {
        fse.removeSync(cmsPublicThemePath);
        console.log(`Removed existing public theme directory at ${cmsPublicThemePath}`);
    }

    // Ensure the CMS public theme directory is created
    fs.mkdirSync(cmsPublicThemePath, { recursive: true });
    console.log(`Created public theme directory at ${cmsPublicThemePath}`);

    // Copy all contents from theme public directory to CMS public theme directory
    if (fs.existsSync(themeSourcePath)) {
        fse.copySync(themeSourcePath, cmsPublicThemePath);
        console.log(`Copied styles from ${themeSourcePath} to ${cmsPublicThemePath}`);
    } else {
        console.error(`Error: Source public directory does not exist at ${themeSourcePath}`);
        process.exit(1);
    }

    console.log("CMS theme styles successfully replaced.");
} catch (error) {
    console.error("Error replacing CMS theme styles:", error);
    process.exit(1);
}

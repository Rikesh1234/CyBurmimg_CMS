// command/replaceThemeViews.js
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
const themeSourcePath = path.join(__dirname, `../theme/${themeName}`);
const cmsThemePath = path.join(__dirname, `../views/theme/${themeName}`);

// Paths for main folders and files in the source theme
const sourcePaths = {
    partials: path.join(themeSourcePath, 'partials'),
    pages: path.join(themeSourcePath, 'pages'),
    index: path.join(themeSourcePath, 'index.ejs'),
    master: path.join(themeSourcePath, 'master.ejs')
};

console.log(sourcePaths);

try {
    // Remove existing CMS theme directory if it exists
    if (fs.existsSync(cmsThemePath)) {
        fse.removeSync(cmsThemePath);
        console.log(`Removed existing theme directory at ${cmsThemePath}`);
    }

    // Ensure CMS theme directory is created (after deletion)
    fs.mkdirSync(cmsThemePath, { recursive: true });
    console.log(`Created theme directory at ${cmsThemePath}`);

    // Copy 'partials' folder if it exists
    if (fs.existsSync(sourcePaths.partials)) {
        fse.copySync(sourcePaths.partials, path.join(cmsThemePath, 'partials'));
        console.log(`Copied 'partials' folder to ${cmsThemePath}`);
    }

    // Copy 'pages' folder if it exists
    if (fs.existsSync(sourcePaths.pages)) {
        fse.copySync(sourcePaths.pages, path.join(cmsThemePath, 'pages'));
        console.log(`Copied 'pages' folder to ${cmsThemePath}`);
    }

    // Copy 'index.ejs' or 'master.ejs' if either exists
    if (fs.existsSync(sourcePaths.index)) {
        fs.copyFileSync(sourcePaths.index, path.join(cmsThemePath, 'index.ejs'));
        console.log(`Copied 'index.ejs' to ${cmsThemePath}`);
    } else if (fs.existsSync(sourcePaths.master)) {
        fs.copyFileSync(sourcePaths.master, path.join(cmsThemePath, 'master.ejs'));
        console.log(`Copied 'master.ejs' to ${cmsThemePath}`);
    } else {
        console.log("No main template file found ('index.ejs' or 'master.ejs').");
    }

    console.log("CMS theme views successfully replaced.");
} catch (error) {
    console.error("Error replacing CMS theme views:", error);
    process.exit(1);
}

const redis = require("../config/redis");
const { body, validationResult } = require("express-validator");
const Package = require("../models/Package");
const CustomField = require("../models/CustomField");


//view package page
exports.getPackagePage = async (req, res) => {
  try {
    // Fetch all packages from the database
    const packages = await Package.find();

    // Render the view and pass the packages to the EJS template
    res.render('package/package_listing', { title: 'Package Page', packages });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


//view package Create page
exports.getPackageCreatePage = async (req, res) => {

  let customField = await CustomField.find()
  .populate({
    path: 'model',  // Populate the 'model' field
    match: { path: '../models/Package' } // Filter to only include models with the specified path
  })
  .populate({
    path: 'target_type', // Populate the 'field' field
  });

  res.render('package/package_create_edit', {
    title: 'Package Create Page',
    package: null, 
    customField
  });
};


// Handle package creation
exports.createPackage = async (req, res) => {
  try {
    console.log(req.body);
    
    const { title, currency, price, includes } = req.body;

    // If includes are provided, make sure it's an array
    const includesArray = Array.isArray(includes) ? includes : [includes];

    // Create a new package object
    const newPackage = new Package({
      title,
      currency,
      price,
      includes: includesArray
    });

    // Save the package to the database
    await newPackage.save();
    await redis.del("/cms/package");


    // Redirect to package listing or any other desired page after successful creation
    res.redirect("/cms/package");
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).send("Server Error");
  }
};


// Get Package Edit Page
exports.getPackageEditPage = async (req, res) => {
  try {
    let customField = await CustomField.find()
  .populate({
    path: 'model',  // Populate the 'model' field
    match: { path: '../models/Package' } // Filter to only include models with the specified path
  })
  .populate({
    path: 'target_type', // Populate the 'field' field
  });
    const packageId = req.params.packageId;
    const packageData = await Package.findById(packageId);

    if (!packageData) {
      return res.status(404).send('Package not found');
    }

    res.render('package/package_create_edit', {
      title: 'Edit Package',
      package: packageData, // Pass the package data to the template
      customField
    });
  } catch (error) {
    console.error('Error fetching package for edit:', error);
    res.status(500).send('Server Error');
  }
};

// Update Package
exports.updatePackage = async (req, res) => {
  try {
    const packageId = req.params.packageId;
    const { title, currency, price, includes } = req.body;

    // Ensure includes is an array (for single input case)
    const includesArray = Array.isArray(includes) ? includes : [includes];

    // Find and update the package
    const updatedPackage = await Package.findByIdAndUpdate(
      packageId,
      {
        title,
        currency,
        price,
        includes: includesArray,
      },
      { new: true }
    );

    if (!updatedPackage) {
      return res.status(404).send('Package not found');
    }
    await redis.del("/cms/package");

    // Redirect to package listing or any other desired page after successful update
    res.redirect("/cms/package");
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).send('Server Error');
  }
};

// Delete package function
exports.deletePackage = async (req, res) => {
  try {
    const packageId = req.params.id;

    // Find and delete the package by ID
    const deletedPackage = await Package.findByIdAndDelete(packageId);

    // If the package is not found, send a 404 response
    if (!deletedPackage) {
      return res.status(404).send("Package not found");
    }
    await redis.del("/cms/package");

    // Redirect to the package listing after successful deletion
    res.redirect('/cms/package');
  } catch (err) {
    console.error("Error deleting package:", err);
    res.status(500).send("Server Error");
  }
};
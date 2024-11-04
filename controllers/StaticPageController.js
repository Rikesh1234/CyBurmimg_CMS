// controllers/StaticPageController.js
const StaticPage = require("../models/StaticPage");
const { body, validationResult } = require("express-validator");
const redis = require("../config/redis");
const CustomField = require("../models/CustomField");
const CustomFieldValue = require("../models/CustomFieldValue");


// Delete static page
const fs = require("fs");
const path = require("path");

const {
  fetchCustomFields,
  saveCustomFieldValues,
} = require("../helper/customFieldHelper");

// View static pages listing
exports.getStaticPagePage = async (req, res) => {
  if (req.session.user) {
    try {
      const pages = await StaticPage.find();

      res.render("pages/page_listing", { title: "Static-Page Page", pages });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
      res.render("404", {
        errorMessages: "Something is wrong with our side. Please inform us!",
        error: "500",
      });
    }
  } else {
    res.render("404", {
      errorMessages: "Looks Like you are lost!",
      error: "404",
    });
  }
};

// View static page create form
exports.getStaticPageCreatePage = async (req, res) => {
  if (req.session.user) {
    const customField = await fetchCustomFields("StaticPage");

    res.render("pages/page_create_edit", {
      title: "Create Static Page",
      page: null,
      errors: [],
      customField,
      formData:{}
    });
  } else {
    res.render("404", {
      errorMessages: "Looks Like you are lost!",
      error: "404",
    });
  }
};

// Create static page
exports.createStaticPage = [
  // Validation rules
  body("title").notEmpty().withMessage("Title is required"),
  body("slug").notEmpty().withMessage("Slug is required"),
  body("content").notEmpty().withMessage("Content is required"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Re-render form with errors and input values
      return res.render("pages/page_create_edit", {
        title: "Create Static Page",
        formData: req.body,
        errors: errors.array().map((err) => err.msg),
        customField: [],
        page:null
      });
    }

    try {
      // Extract all fields from req.body, including tag_line and summary
      const { title, slug, content, tag_line, summary } = req.body; // Add tag_line and summary here
      const status = req.body.status === "on" ? "active" : "inactive";

      // Check for duplicate slug
      const existingPage = await StaticPage.findOne({ slug });
      if (existingPage) {
        return res.render("pages/page_create_edit", {
          title: "Create Static Page",
          page: req.body,
          errors: errors.array().map((err) => err.msg),
        });
      }

      // Handle featured image upload
      let featured_image = "/images/upload.png"; // Default image
      if (req.file) {
        featured_image = `/uploads/static_pages/${req.file.filename}`;
      }

      // Create new static page object
      const newPage = new StaticPage({
        title,
        slug,
        content,
        status,
        tag_line,
        summary,
        featured_image,
      });

      // Save static page to database
      await newPage.save();
      // Invalidate the cached post list
      await redis.del("/cms/static-page");
      // Redirect to static page listing
      res.redirect("/cms/static-page");
    } catch (err) {
      console.error(err);
      // Re-render the form with an error message
      res.render("pages/page_create_edit", {
        title: "Create Static Page",
        page: req.body,
        errors: ["An unexpected error occurred. Please try again later."],
      });
    }
  },
];

// View static page edit form
exports.getStaticPageEditPage = async (req, res) => {
  if (req.session.user) {
    try {
      const page = await StaticPage.findById(req.params.pageId);

      if (!page) return res.status(404).send("Page not found");

      const customFields = await fetchCustomFields(
        "StaticPage",
        null,
        req.params.pageId
      );

      // Fetch the existing custom field values for the post
      const customFieldValues = await CustomFieldValue.find({
        entityId: page._id,
      });

      const customField = customFields.map((field) => {
        // Get all value records for this custom field
        const valueRecords = customFieldValues.filter(
          (val) => val.customField.toString() === field._id.toString()
        );

        // Create an object that includes all field names and their corresponding values
        const fieldValues = {};
        field.field_name.forEach((fieldName, index) => {
          const valueRecord = valueRecords.find(
            (val) => val.fieldName === fieldName
          );
          fieldValues[fieldName] = valueRecord ? valueRecord.value : "";
        });

        return {
          ...field.toObject(),
          values: fieldValues,
        };
      });

      res.render("pages/page_create_edit", {
        title: "Edit Static Page",
        page,
        errors: [],
        customField: customField ?? [],
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
      res.render("404", {
        errorMessages: "Something is wrong with our side. Please inform us!",
        error: "500",
      });
    }
  } else {
    res.render("404", {
      errorMessages: "Looks Like you are lost!",
      error: "404",
    });
  }
};

// Update static page
exports.updateStaticPage = [
  // Validation rules
  body("title").notEmpty().withMessage("Title is required"),
  body("slug").notEmpty().withMessage("Slug is required"),
  body("content").notEmpty().withMessage("Content is required"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Re-render form with errors and input values
      return res.render("pages/page_create_edit", {
        title: "Edit Static Page",
        formData: req.body, // Pass current form data
        errors: errors.array().map((err) => err.msg),
        customField: [],
      });
    }

    try {
      // Include tag_line and summary in the destructuring
      const { title, slug, content, tag_line, summary } = req.body;
      const status = req.body.status === "on" ? "active" : "inactive";

      // Check for duplicate slug, ignoring the current page being edited
      const existingPage = await StaticPage.findOne({
        slug,
        _id: { $ne: req.params.pageId },
      });
      if (existingPage) {
        return res.render("pages/page_create_edit", {
          title: "Edit Static Page",
          page: req.body,
          errors: [
            "Slug must be unique. A page with this slug already exists.",
          ],
        });
      }

      let featured_image = "/images/upload.png"; // Default image
      if (req.file) {
        featured_image = `/uploads/static_pages/${req.file.filename}`;
      }

      // Handle custom fields
      const customFields = await fetchCustomFields("StaticPage");
      const customFieldData = {};

      // Collect custom field values from request
      customFields.forEach((field) => {
        // Handle each field name in the array
        field.field_name.forEach((fieldName) => {
          if (req.body[fieldName] !== undefined) {
            customFieldData[fieldName] = req.body[fieldName];
          }
        });
      });

      // Save custom field values for the updated page
      await saveCustomFieldValues("StaticPage", req.params.pageId, customFieldData);

      // Update static page
      const updatedPage = await StaticPage.findByIdAndUpdate(
        req.params.pageId,
        {
          title,
          slug,
          content,
          status,
          tag_line,
          summary,
          featured_image,
        },
        { new: true }
      );

      if (!updatedPage) return res.status(404).send("Page not found");

      // Invalidate the cached post list
      await redis.del("/cms/static-page");

      // Redirect to static page listing
      res.redirect("/cms/static-page");
    } catch (err) {
      console.error(err);
      // Re-render the form with an error message
      res.render("pages/page_create_edit", {
        title: "Edit Static Page",
        page: req.body,
        errors: ["An unexpected error occurred. Please try again later."],
      });
    }
  },
];

exports.deleteStaticPage = async (req, res) => {
  try {
    // Find the page by ID to get the featured image path before deleting
    const page = await StaticPage.findById(req.params.pageId);

    // If no page is found, send a 404 response
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    console.log(page.featured_image);

    // File path of the featured image (adjust the path to where your uploads are stored)
    const filePath = path.join(__dirname, `../public${page.featured_image}`);

    // Try to delete the page by ID
    const deletedPage = await StaticPage.findByIdAndDelete(req.params.pageId);

    // Invalidate the cached post list
    await redis.del("/cms/static-page");

    // Check if file exists and is not the default image before attempting deletion
    if (
      fs.existsSync(filePath) &&
      page.featured_image !== "/images/upload.png"
    ) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting the file:", err);
        } else {
          console.log("File deleted successfully:", filePath);
        }
      });
    }

    // Respond with success message
    res.status(200).json({ message: "Page deleted successfully" });
  } catch (err) {
    console.error("Error deleting static page:", err);
    // Handle server errors
    res.status(500).json({ message: "Server Error" });
  }
};

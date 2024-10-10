// controllers/StaticPageController.js
const StaticPage = require("../models/StaticPage");
const { body, validationResult } = require("express-validator");
const redis = require("../config/redis");

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
exports.getStaticPageCreatePage = (req, res) => {
  if (req.session.user) {
    res.render("pages/page_create_edit", {
      title: "Create Static Page",
      page: null,
      errors: [],
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
        page: req.body,
        errors: errors.array().map((err) => err.msg),
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

      res.render("pages/page_create_edit", {
        title: "Edit Static Page",
        page,
        errors: [],
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
        page: req.body, // Pass current form data
        errors: errors.array().map((err) => err.msg),
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

// Delete static page
exports.deleteStaticPage = async (req, res) => {
  try {
    // Try to delete the page by ID
    const deletedPage = await StaticPage.findByIdAndDelete(req.params.pageId);
    await redis.del("/cms/static-page");

    // If no page is found, send a 404 response
    if (!deletedPage) {
      return res.status(404).json({ message: "Page not found" });
    }

    // Respond with success message
    res.status(200).json({ message: "Page deleted successfully" });
  } catch (err) {
    console.error(err);
    // Handle server errors
    res.status(500).json({ message: "Server Error" });
  }
};

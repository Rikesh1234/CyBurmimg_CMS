// controllers/StaticPageController.js
const StaticPage = require('../models/StaticPage');
const { body, validationResult } = require('express-validator');

// View static pages listing
exports.getStaticPagePage = async (req, res) => {
  try {
    const pages = await StaticPage.find();
    res.render('pages/page_listing', { title: 'Static-Page Page', pages });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// View static page create form
exports.getStaticPageCreatePage = (req, res) => {
  res.render('pages/page_create_edit', { title: 'Create Static Page', page: null, errors: [] });
};

// Create static page
exports.createStaticPage = [
  // Validation rules
  body('title').notEmpty().withMessage('Title is required'),
  body('slug').notEmpty().withMessage('Slug is required'),
  body('content').notEmpty().withMessage('Content is required'),

  async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Re-render form with errors and input values
      return res.render('pages/page_create_edit', {
        title: 'Create Static Page',
        page: req.body, // Pass current form data
        errors: errors.array().map(err => err.msg),
      });
    }

    try {
      const { title, slug, content } = req.body;
      const status = req.body.status === 'on' ? 'active' : 'inactive';

      // Check for duplicate slug
      const existingPage = await StaticPage.findOne({ slug });
      if (existingPage) {
        return res.render('pages/page_create_edit', {
          title: 'Create Static Page',
          page: req.body,
          errors: ['Slug must be unique. A page with this slug already exists.'],
        });
      }

      // Create new static page object
      const newPage = new StaticPage({ title, slug, content, status });

      // Save static page to database
      await newPage.save();

      // Redirect to static page listing
      res.redirect('/cms/static-page');
    } catch (err) {
      console.error(err);
      // Re-render the form with an error message
      res.render('pages/page_create_edit', {
        title: 'Create Static Page',
        page: req.body,
        errors: ['An unexpected error occurred. Please try again later.'],
      });
    }
  },
];

// View static page edit form
exports.getStaticPageEditPage = async (req, res) => {
  try {
    const page = await StaticPage.findById(req.params.pageId);
    console.log(req.body)
    console.log(req.parms)
    if (!page) return res.status(404).send('Page not found');

    res.render('pages/page_create_edit', { title: 'Edit Static Page', page, errors: [] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Update static page
exports.updateStaticPage = [
  // Validation rules
  body('title').notEmpty().withMessage('Title is required'),
  body('slug').notEmpty().withMessage('Slug is required'),
  body('content').notEmpty().withMessage('Content is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Re-render form with errors and input values
      return res.render('pages/page_create_edit', {
        title: 'Edit Static Page',
        page: req.body, // Pass current form data
        errors: errors.array().map(err => err.msg),
      });
    }

    try {
      const { title, slug, content } = req.body;
      const status = req.body.status === 'on' ? 'active' : 'inactive';

      // Check for duplicate slug, ignoring the current page being edited
      const existingPage = await StaticPage.findOne({ slug, _id: { $ne: req.params.pageId } });
      if (existingPage) {
        return res.render('pages/page_create_edit', {
          title: 'Edit Static Page',
          page: req.body,
          errors: ['Slug must be unique. A page with this slug already exists.'],
        });
      }

      // Update static page
      const updatedPage = await StaticPage.findByIdAndUpdate(req.params.pageId, {
        title,
        slug,
        content,
        status,
      }, { new: true });

      if (!updatedPage) return res.status(404).send('Page not found');

      // Redirect to static page listing
      res.redirect('/cms/static-page');
    } catch (err) {
      console.error(err);
      // Re-render the form with an error message
      res.render('pages/page_create_edit', {
        title: 'Edit Static Page',
        page: req.body,
        errors: ['An unexpected error occurred. Please try again later.'],
      });
    }
  }
];

// Delete static page
exports.deleteStaticPage = async (req, res) => {
  try {
    const deletedPage = await StaticPage.findByIdAndDelete(req.params.pageId);

    if (!deletedPage) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.status(200).json({ message: 'Page deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete the page' });
  }
};

require('dotenv').config();

const Team = require("../models/Team");
const Post = require("../models/Post");
const Package = require('../models/Package');
const Category = require("../models/Category");
const StaticPage = require('../models/StaticPage');
const Testominal = require("../models/Testominal");

//view home page
exports.getPage = async (req, res) => {  // Mark the function as async
    try {
        
        const showingpage  = 'home';
        
        
        const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate('category'); 

        const categories = await Category.find().populate("parent");

        const pages = await StaticPage.find();

        const teams = await Team.find().limit(3);

        const testomonials = await Testominal.find();

        const sliders = await Slider.find({ published: true });

        const theme = process.env.THEME;
        if (!theme) {
            return res.status(500).send('Theme is not defined');
        }

        // Pass the posts data to the template along with the title
        res.render(`theme/${theme}/index`, { title: 'Home Page', posts, categories, pages, teams, testomonials,sliders, showingpage });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};


// ---------SELECTED STATIC PAGE------------------------------------------------------
exports.getStaticPage = async (req, res) => {
  try {
      
      const showingpage = req.params.slug;
      
    // Fetch the page data based on the slug in the URL
    const staticPage = await StaticPage.findOne({ slug: req.params.slug });

    if (!staticPage) {
      return res.status(404).send('Page not found');
    }
    

    // Define variables to be used in the view
    const pageTitle = staticPage.title || 'Static Page';
    const background_image = staticPage.featured_image || '/images/default-bg.jpg'; // default image if not set
    const content = staticPage.content || '';

    // Render the static page with its specific data
    res.render(`theme/${process.env.THEME}/pages/static-page`, {
      pageTitle,
      background_image,
      content,
      showingpage
    });

  } catch (err) {
    console.error("Error fetching static page:", err);
    res.status(500).send("Server Error");
  }
};
// ---------SELECTED STATIC PAGE END---------------------------------------------------




// ---------SLIDER------------------------------------------------------
const Slider = require("../models/Slider");

exports.getHomePageSlider = async (req, res) => {
  try {
    // Fetch all sliders marked as published
    const sliders = await Slider.find({ published: true });

    // Render the homepage view with sliders data
    res.render("theme/goodwill-cleaning/index", { sliders });
    
  } catch (err) {
    console.error("Error fetching sliders:", err);
    res.status(500).send("Server Error");
  }
};

// ---------SLIDER END------------------------------------------------------

// ---------LISTING PAGE END------------------------------------------------------

// Fetch posts for a selected category by slug
exports.getCategoryListingPage = async (req, res) => {
  try {
      
      const showingpage = req.params.slug;
      
    // Get the category slug from request params
    const categorySlug = req.params.slug;

    // Find the category by slug
    const category = await Category.findOne({ slug: categorySlug });

    // If no category found, return 404
    if (!category) {
      return res.status(404).send("Category not found");
    }

    // Fetch all posts that belong to the selected category
    const posts = await Post.find({ category: category._id }).populate("category");

    // Render the category listing page with the fetched posts
    res.render("theme/goodwill-cleaning/pages/postListing", {
      posts,
      category, // Pass the category data to the view
      showingpage
    });
  } catch (err) {
    console.error("Error fetching posts for category:", err);
    res.status(500).send("Server Error");
  }
};


// ---------LISTING PAGE END------------------------------------------------------


// ---------POST DETAIL PAGE ------------------------------------------------------
exports.getPostDetailPage = async (req, res) => {
  try {
      
      showingpage = 'post'
      
    // Fetch the post based on `postId` from the request params
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send('Post not found');
    }

    // Render the post detail view, passing the post data
    res.render('theme/goodwill-cleaning/pages/postDetail', {
      post,
      showingpage
    });
  } catch (err) {
    console.error('Error fetching post detail:', err);
    res.status(500).send('Server Error');
  }
};
// ---------POST DETAIL PAGE END------------------------------------------------------


// ---------PRICE------------------------------------------------------

exports.getPackage = async (req, res) => {
  try {
    // Fetch packages from the database
    const packages = await Package.find();

    

    // Render the EJS view, passing packages data
    res.render('theme/goodwill-cleaning/pages/pricePage', {
      title: 'Package Prices',
      packages: packages,
      showingpage: 'price'
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).send('Server Error');
  }
};
// ---------END PRICE------------------------------------------------------
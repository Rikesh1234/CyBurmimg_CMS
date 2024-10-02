require('dotenv').config();

const Post = require("../models/Post");
const Category = require("../models/Category");
const StaticPage = require('../models/StaticPage');
const Team = require("../models/Team");
const Testominal = require("../models/Testominal");

//view home page
exports.getPage = async (req, res) => {  // Mark the function as async
    try {
        const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate('category'); 

        const categories = await Category.find().populate("parent");

        const pages = await StaticPage.find();

        const teams = await Team.find().limit(3);

        const testomonial = await Testominal.find();

        const sliders = await Slider.find({ published: true });

        const theme = process.env.THEME;
        if (!theme) {
            return res.status(500).send('Theme is not defined');
        }

        // Pass the posts data to the template along with the title
        res.render(`theme/${theme}/index`, { title: 'Home Page', posts, categories, pages, teams, testomonial,sliders });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};


// ---------STATIC PAGE------------------------------------------------------
exports.getStaticPage = async (req, res) => {
  try {
    // Fetch the page data based on the slug in the URL
    const staticPage = await StaticPage.findOne({ slug: req.params.slug });

    if (!staticPage) {
      return res.status(404).send('Page not found');
    }

    // Define variables to be used in the view
    const pageTitle = staticPage.title || 'Static Page';
    const background_image = staticPage.background_image || '/images/default-bg.jpg'; // default image if not set
    const content = staticPage.content || '';

    // Render the static page with its specific data
    res.render(`theme/${process.env.THEME}/pages/static-page`, {
      pageTitle,
      background_image,
      content
    });

  } catch (err) {
    console.error("Error fetching static page:", err);
    res.status(500).send("Server Error");
  }
};
// ---------STATIC PAGE END---------------------------------------------------




// ---------SLIDER------------------------------------------------------
const Slider = require("../models/Slider");

exports.getHomePageSlider = async (req, res) => {
  try {
    // Fetch all sliders marked as published
    const sliders = await Slider.find({ published: true });

    // Render the homepage view with sliders data
    res.render("theme/goodwill-cleaning/index", { sliders });
    console.log(sliders);
    
  } catch (err) {
    console.error("Error fetching sliders:", err);
    res.status(500).send("Server Error");
  }
};

// ---------SLIDER END------------------------------------------------------

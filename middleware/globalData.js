// globalData middleware
const Category = require('../models/Category');
const Page = require('../models/StaticPage');
const Package = require('../models/Package');
const Post = require("../models/Post");


module.exports = async (req, res, next) => {
  try {
    const categories = await Category.find();
    const pages = await Page.find();
    const packages = await Package.find();
    const posts = await Post.find().sort({ createdAt: -1 }).limit(5);

    
    
    // Replace with your actual contact details fetching logic
    const contact = {
      phone: '+977-9841221213',
      email: 'abc@gmail.com',
      socialLinks: {
        facebook: '#',
        instagram: '#',
        twitter: '#',
        linkedin: '#'
      }
    };

    // Attach categories, pages, and contact to res.locals for global access
    res.locals.categories = categories;
    res.locals.pages = pages;
    res.locals.contact = contact;
    res.locals.packages = packages;
    res.locals.posts = posts;


    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// globalData middleware
const Category = require('../models/Category');
const Page = require('../models/StaticPage');
const Package = require('../models/Package');
const Post = require("../models/Post");

const {
  fetchCustomFields,
  saveCustomFieldValues,
} = require("../helper/customFieldHelper");


const { truncateWords } = require("../helper/truncateWord");

module.exports = async (req, res, next) => {
  try {
    const categories = await Category.find();
    const pages = await Page.find();
    const packages = await Package.find();
    const posts = await Post.find().sort({ createdAt: -1 }).limit(5);
    const latestBlogs = await Post.find()
    .populate({
      path: 'category',
      match: { slug: 'blog' }
    })
    .sort({ createdAt: -1 })
    .limit(3);

    const customField = await fetchCustomFields("Post");


    if (req.session.user) {
      res.locals.loginFeaturedImage = req.session.user.featuredImage;
      res.locals.loginUser = req.session.user.username;
    } else {
      res.locals.loginFeaturedImage = null;
      res.locals.loginUser = null;
    }
  
  // Filter out posts where category didn't match (in case of no blog category)
  const filteredLatestBlogs = latestBlogs.filter(post => post.category.length > 0);  
    // Replace with your actual contact details fetching logic
    const contact = {
      phone: '+04 20 900 310',
      email: 'anilsah37618@gmail.com',
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
    res.locals.latestBlogs = filteredLatestBlogs
    res.locals.truncateWords = truncateWords;
    res.locals.customField = customField

    

    

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};
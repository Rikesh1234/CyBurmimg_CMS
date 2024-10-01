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
        .sort({ createdAt: -1 })  // Sort by createdAt descending (latest first)
        .populate('category');  // Populate the category data

        const categories = await Category.find().populate("parent");

        const pages = await StaticPage.find();

        const teams = await Team.find().limit(3);

        const testomonial = await Testominal.find();

        const theme = process.env.THEME;
        if (!theme) {
            return res.status(500).send('Theme is not defined');
        }

        // Pass the posts data to the template along with the title
        res.render(`theme/${theme}/index`, { title: 'Home Page', posts, categories, pages, teams, testomonial });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

exports.getStaticPage = async (req, res) => {
    try {
       
        const static_page = await Post.findOneAndDelete({ slug: req.params.slug });

        if (!static_page)  {
            return res.status(404).send("Post not found");
          }

          res.render(`theme/${theme}/page/staic-page`, { title: 'Static Page', static_page });

    } catch (err) {
    }
}

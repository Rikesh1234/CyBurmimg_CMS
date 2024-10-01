require('dotenv').config();

const Post = require("../models/Post");
const Category = require("../models/Category");

//view home page
exports.getPage = async (req, res) => {  // Mark the function as async
    try {
        const posts = await Post.find()
        .sort({ createdAt: -1 })  // Sort by createdAt descending (latest first)
        .limit(20)  // Limit to 3 posts
        .populate('category');  // Populate the category data

        const categories = await Category.find().populate("parent");

        const pages = await StaticPage.find();

        const theme = process.env.THEME;
        if (!theme) {
            return res.status(500).send('Theme is not defined');
        }

        // Pass the posts data to the template along with the title
        res.render(`theme/${theme}/index`, { title: 'Home Page', posts, categories, pages });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};


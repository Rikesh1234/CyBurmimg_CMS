require("dotenv").config();

const Team = require("../models/Team");
const Post = require("../models/Post");
const Package = require("../models/Package");
const Category = require("../models/Category");
const StaticPage = require("../models/StaticPage");
const Testominal = require("../models/Testominal");
const Gallery = require("../models/Gallery");
const CustomFieldValue = require("../models/CustomFieldValue");

const { truncateWords } = require("../helper/truncateWord");

//view home page
exports.getPage = async (req, res) => {
  // Mark the function as async
  try {
    const showingpage = "home";
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("category") // Populating the category
      .populate("author") // Populating the author
      .lean(); // Using lean() to make post documents plain JS objects

    // Fetch custom field values for each post
    const postIds = posts.map((post) => post._id);
    const customFieldValues = await CustomFieldValue.find({
      entityId: { $in: postIds },
    }).populate("customField");

    // Map custom field values to their corresponding posts
    posts.forEach((post) => {
      post.customFields = customFieldValues.filter(
        (field) => field.entityId.toString() === post._id.toString()
      );
    });

    
    const categories = await Category.find().populate("parent");

    const pages = await StaticPage.find();

    const teams = await Team.find().limit(3);

    const testomonials = await Testominal.find();

    const sliders = await Slider.find({ published: true });

    const theme = process.env.THEME;
    if (!theme) {
      return res.status(500).send("Theme is not defined");
    }

    // Pass the posts data to the template along with the title
    res.render(`theme/${theme}/index`, {
      title: "Home Page",
      posts,
      categories,
      pages,
      teams,
      testomonials,
      sliders,
      showingpage,
      truncateWords,
    });
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
      return res.status(404).send("Page not found");
    }

    // Define variables to be used in the view
    const pageTitle = staticPage.title || "Static Page";
    const background_image =
      staticPage.featured_image || "/images/default-bg.jpg"; // default image if not set
    const content = staticPage.content || "";

    // Render the static page with its specific data
    res.render(`theme/${process.env.THEME}/pages/static-page`, {
      pageTitle,
      background_image,
      content,
      showingpage,
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
    const posts = await Post.find({ category: category._id }).populate(
      "category"
    ).lean();

    
    // Fetch custom field values for each post
    const postIds = posts.map((post) => post._id);


    const customFieldValues = await CustomFieldValue.find({
      entityId: { $in: postIds },
    }).populate("customField");



    // Map custom field values to their corresponding posts
    posts.forEach((post) => {
      post.customFields = customFieldValues.filter(
        (field) => field.entityId.toString() === post._id.toString()
      );
    });
    // Render the category listing page with the fetched posts
    res.render(`theme/${process.env.THEME}/pages/postListing`, {
      posts,
      category, // Pass the category data to the view
      showingpage,
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
    const showingpage = "post";

    // Fetch the post based on `postId` from the request params
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate("category").lean();

    const morePosts = await Post.find({ _id: { $ne: postId } })
      .limit(5)
      .populate("category")
      .lean();

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // If the post has a photo gallery, render the photoDetail view
    let gallery_images = [];
    if (post.photo_gallery) {
      gallery_images = await Gallery.findById(post.gallery);
    }

    // Render the appropriate view based on gallery presence
    res.render(
      post.photo_gallery
        ? `theme/${process.env.THEME}/pages/photoDetail`
        : `theme/${process.env.THEME}/pages/postDetail`,
      {
        post,
        morePosts,
        showingpage,
        gallery_images: gallery_images.images, // assuming you need the images array from gallery
      }
    );
  } catch (err) {
    console.error("Error fetching post detail:", err);
    res.status(500).send("Server Error");
  }
};

// ---------POST DETAIL PAGE END------------------------------------------------------

// ---------PRICE------------------------------------------------------

exports.getPackage = async (req, res) => {
  try {
    // Fetch packages from the database
    const packages = await Package.find();

    // Render the EJS view, passing packages data
    res.render("theme/goodwill-cleaning/pages/pricePage", {
      title: "Package Prices",
      packages: packages,
      showingpage: "price",
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).send("Server Error");
  }
};
// ---------END PRICE------------------------------------------------------

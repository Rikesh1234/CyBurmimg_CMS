require("dotenv").config();

const Team = require("../models/Team");
const Post = require("../models/Post");
const Slider = require("../models/Slider");
const Package = require("../models/Package");
const Category = require("../models/Category");
const StaticPage = require("../models/StaticPage");
const Testominal = require("../models/Testominal");
const Gallery = require("../models/Gallery");
const CustomFieldValue = require("../models/CustomFieldValue");

const { truncateWords } = require("../helper/truncateWord");

const themeConfig = require("../config/themeConfig");

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

    const pages = await StaticPage.find().lean();

    // Fetch custom field values for each post
    const pageIds = pages.map((page) => page._id);
    const pageCustomFieldValues = await CustomFieldValue.find({
      entityId: { $in: pageIds },
    }).populate("customField");

    // Map custom field values to their corresponding posts
    pages.forEach((page) => {
      page.customFields = pageCustomFieldValues.filter(
        (field) => field.entityId.toString() === page._id.toString()
      );
    });


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

exports.getHomePageSlider = async (req, res) => {
  try {
    // Fetch all sliders marked as published
    const sliders = await Slider.find({ published: true });

    // Render the homepage view with sliders data
    res.render(`theme/${process.env.THEME}/index`, { sliders });
  } catch (err) {
    console.error("Error fetching sliders:", err);
    res.status(500).send("Server Error");
  }
};

// ---------SLIDER END------------------------------------------------------

// ---------LISTING PAGE END------------------------------------------------------

// Fetch posts for a selected category by slug with pagination
exports.getCategoryListingPage = async (req, res) => {
  try {
    const showingpage = req.params.slug;
    const categorySlug = req.params.slug;

    // Pagination parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 5; // Default to 5 posts per page

    const customListingPage = themeConfig.CUSTOM_LISTING_PAGE;

    // Find the category by slug
    const category = await Category.findOne({ slug: categorySlug });

    // If no category found, return 404
    if (!category) {
      return res.status(404).send("Category not found");
    }

    // Fetch posts for the current page
    const posts = await Post.find({ category: category._id })
      .populate("category")
      .skip((page - 1) * limit) // Skip posts of previous pages
      .limit(limit) // Limit the number of posts returned
      .lean();

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

    let matchingKey = null;
    if (typeof customListingPage !== "undefined") {
      const customListingKeys = Object.keys(customListingPage);
      for (const key of customListingKeys) {
        if (category.slug === key) {
          matchingKey = key;
          break;
        }
      }
    }

    // Get total post count to calculate total pages
    const totalPosts = await Post.countDocuments({ category: category._id });
    const totalPages = Math.ceil(totalPosts / limit);

    const pagination = {
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };

    console.log(pagination);
    
    // Render the category listing page with pagination
    const template = matchingKey
      ? `theme/${process.env.THEME}/pages/${customListingPage[matchingKey]}`
      : `theme/${process.env.THEME}/pages/postListing`;

    res.render(template, {
      posts,
      category,
      showingpage,
      pagination,
      limit,
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

    const customDetailPage = themeConfig.CUSTOM_DETAIL_PAGE;

    // Fetch the post based on `postId` from the request params
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate("category").lean();

    const categorySlugs = post.category.map((element) => element.slug); // Adjust based on the structure of your category

    const categoryName = post.category.map((element) => element.title);

    const morePosts = await Post.find({
      _id: { $ne: postId },
      "category.name": categoryName[0],
    })
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

    // Variable to store the first matching key
    let matchingKey = null;

    if (typeof customDetailPage !== "undefined") {
      // Extract keys from customDetailPage
      const customDetailKeys = Object.keys(customDetailPage); // Example: ['blog', 'article']

      // Check for matches and stop at the first match
      for (const key of customDetailKeys) {
        if (categorySlugs.includes(key)) {
          // Check for presence in the category slugs
          matchingKey = key; // Store the matching key
          break; // Exit the loop on the first match
        }
      }
    }
    // Render the appropriate view based on gallery presence
    if (matchingKey != null) {
      res.render(
        `theme/${process.env.THEME}/pages/${customDetailPage[matchingKey]}`,
        {
          post,
          morePosts,
          showingpage,
          categoryName,
        }
      );
    } else {
      res.render(
        post.photo_gallery
          ? `theme/${process.env.THEME}/pages/photoDetail`
          : `theme/${process.env.THEME}/pages/postDetail`,
        {
          post,
          morePosts,
          showingpage,
          gallery_images: gallery_images.images, // assuming you need the images array from gallery
          categoryName,
        }
      );
    }
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
    res.render(`theme/${process.env.THEME}/pages/pricePage`, {
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

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
const logger = require("../logger");

const {
  fetchCustomFields,
  saveCustomFieldValues,
} = require("../helper/customFieldHelper");

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
      return res.status(404).render("404", {
        title: "Page Not Found",
        error: "404   ",
        errorMessages: "The page you are looking for cannot be found.",
      });
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

// ---------Contact page---------------------------------------------------

exports.getContactPage = async (req, res) => {
  try {
    // Define a unique identifier for the contact page
    const contactPageIdentifier = "contact";

    const contactPage = await StaticPage.findOne({ slug: "contact" });

    if (!contactPage) {
      res.render(`theme/${process.env.THEME}/pages/contact`, {
        showingpage: contactPageIdentifier,
        customFields: [],
      });
    }

    // Fetch custom field values associated with the contact page
    const customFields = await CustomFieldValue.find({
      entityId: contactPage._id,
    }).lean();

    console.log(customFields[0]?.value);

    // Render the contact page with the custom field values
    res.render(`theme/${process.env.THEME}/pages/contact`, {
      showingpage: "contact",
      customFields: customFields[0]?.value,
    });
  } catch (err) {
    console.error("Error fetching custom fields for contact page:", err);
    res.status(500).send("Server Error");
  }
};
// ---------Contact page---------------------------------------------------

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

// ---------NEW POST----------------------------------------------------------
// exports.createNewPost = async (req, res) => {
//   try {
//     const {
//       title,
//       slug,
//       tag_line,
//       summary,
//       content,
//       category,
//       author,
//       tags,
//       photo_gallery,
//       gallery,
//       published,
//       featured_image,
//     } = req.body;

//     // Validate required fields
//     if (!title || !content || !category || !slug) {
//       return res.status(400).json({
//         error: 'Title, content, slug, and category are required fields.',
//       });
//     }

//     // Create a new post instance
//     const post = new Post({
//       title,
//       slug,
//       tag_line,
//       summary,
//       content,
//       category,
//       author,
//       tags,
//       photo_gallery,
//       gallery,
//       published,
//       featured_image,
//     });

//     // Save the post to the database
//     const savedPost = await post.save();

//     // Respond with success
//     res.status(201).json({
//       message: 'Post created successfully',
//       post: savedPost,
//     });
//   } catch (error) {
//     // Check for duplicate slug error
//     if (error.code === 11000 && error.keyPattern && error.keyPattern.slug) {
//       return res.status(400).json({
//         error: 'Slug must be unique. The provided slug already exists.',
//       });
//     }

//     // Log and return server error
//     console.error('Error creating post:', error);
//     res.status(500).json({ error: 'Server error. Please try again later.' });
//   }
// };

// ---------END NEW POST------------------------------------------------------

// ---------STUDENT FORM FOR NEW POST------------------------------------------------------

// Controller to handle form submission
exports.submitStudentForm = async (req, res) => {
  try {
    const { studentName, level, subjectStudent, studentMessage, tutionType } = req.body;

    // Validate only studentName
    if (!studentName) {
      return res.status(400).json({
        error: "Missing required field: studentName",
      });
    }

    // Initialize an array to store category IDs
    let categoryIds = [];

    // Validate and fetch the selected Level (child category of 'level')
    let levelCategory;
    if (level) {
      levelCategory = await Category.findOne({ slug: level });
      if (!levelCategory) {
        return res.status(400).json({ error: "Invalid level (category)" });
      }
      categoryIds.push(levelCategory._id); // Save selected level category ID
    }

    // Validate and fetch selected Subjects (child categories of 'subject')
    let subjectCategories = [];
    if (subjectStudent && subjectStudent.length > 0) {
      subjectCategories = await Category.find({ slug: { $in: subjectStudent } });
      if (subjectCategories.length !== subjectStudent.length) {
        return res.status(400).json({ error: "Invalid subject(s) selected" });
      }
      categoryIds = [...categoryIds, ...subjectCategories.map(subject => subject._id)]; // Save subject category IDs
    }

    
    // Create and save a new Post
    const post = new Post({
      title: studentName,
      slug: studentName.toLowerCase().replace(/\s+/g, "-"),
      summary: studentMessage || "No message provided",
      content: "Student form submission",
      category: categoryIds, // Store all selected category IDs
      published: true,
      
      // Optional: Add additional metadata if needed
      metadata: {
        level: level ? {
          id: levelCategory._id,
          slug: levelCategory.slug,
          title: levelCategory.title
        } : null,
        subjects: subjectCategories.map(subject => ({
          id: subject._id,
          slug: subject.slug,
          title: subject.title
        }))
      }
    });

    const savedPost = await post.save();

    // Fetch custom fields dynamically for the 'Post' model
    const customFields = await fetchCustomFields("Post");

    // Normalize and map request body to custom fields
    const normalizedRequestBody = {};
    Object.keys(req.body).forEach((key) => {
      normalizedRequestBody[key.toLowerCase().replace(/\s+/g, "")] = req.body[key];
    });

    // Extract and store only the required custom fields
    const customFieldData = {};

    customFields.forEach((field) => {
      field.field_name.forEach((fieldName) => {
        const normalizedFieldName = fieldName.toLowerCase().replace(/\s+/g, "");

        if (normalizedRequestBody[normalizedFieldName] !== undefined) {
          customFieldData[fieldName] = normalizedRequestBody[normalizedFieldName];
        }
      });
    });

    // Explicitly add Tuition Type to custom field data if it exists
    if (tutionType) {
      customFieldData['Tuition Type'] = tutionType;
    }

    // Save custom field values
    await saveCustomFieldValues("Post", savedPost._id, customFieldData);

    // Send successful response
    res.status(201).json({
      message: "Tutor request submitted and saved successfully",
      post: savedPost,
      customFieldData,
      categories: {
        level: levelCategory ? levelCategory.slug : null,
        subjects: subjectStudent || []
      }
    });
  } catch (error) {
    console.error("Error in submitStudentForm:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

// ---------STUDENT FORM END  FORM NEW POST------------------------------------------------------


// ---------STUDENT FORM FOR NEW POST------------------------------------------------------

// Controller to handle teacher form submission
exports.submitTeacherForm = async (req, res) => {
  try {
    const { teacherName, level, teacherMessage, tutoringDays, teacherDistrict, teacherLocation, teacherPhone, teacherEmail } = req.body;

    // Validate required field: teacherName
    if (!teacherName) {
      return res.status(400).json({
        error: "Missing required field: teacherName",
      });
    }

    // Initialize an array to store category IDs
    let categoryIds = [];

    // Validate and fetch the selected Level (Category)
    let levelCategory;
    if (level) {
      levelCategory = await Category.findOne({ slug: level });
      if (!levelCategory) {
        return res.status(400).json({ error: "Invalid level (category)" });
      }
      categoryIds.push(levelCategory._id); // Save selected level category ID
    }

    // Create and save a new Post
    const post = new Post({
      title: teacherName, 
      slug: teacherName.toLowerCase().replace(/\s+/g, "-"),
      summary: teacherMessage,
      content: "Teacher submission form",
      category: categoryIds,
      published: false,
    });

    const savedPost = await post.save();

    // Prepare custom field data explicitly
    const customFieldData = {
      'Name': teacherName,
      'Level': level,
      'Tutoring Days': tutoringDays || [],
      'District': teacherDistrict,
      'Location': teacherLocation,
      'Phone': teacherPhone,
      'Email': teacherEmail,
      'Message': teacherMessage
    };

    // Remove undefined or null values
    Object.keys(customFieldData).forEach(key => {
      if (customFieldData[key] === undefined || customFieldData[key] === null) {
        delete customFieldData[key];
      }
    });

    // Save custom field values
    await saveCustomFieldValues("Post", savedPost._id, customFieldData);

    // Send successful response
    res.status(201).json({
      message: "Teacher submission saved successfully as a post.",
      post: savedPost,
      customFieldData,
      categories: {
        level: levelCategory ? levelCategory.slug : null,
      },
    });
  } catch (error) {
    console.error("Error in submitTeacherForm:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
// ---------STUDENT FORM FOR NEW POST------------------------------------------------------

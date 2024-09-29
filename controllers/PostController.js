const Post = require("../models/Post");
const redis = require("../config/redis");

//view post page
exports.getPostPage = async (req, res) => {
  try {
    // Fetch all posts from the database
    const posts = await Post.find();

    // Render the view and pass the posts to the EJS template
    res.render("posts/post/post_listing", { title: "Post Page", posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

//view post Create page
exports.getPostCreatePage = (req, res) => {
  res.render("posts/post/post_create_edit", {
    title: "Create Post",
    errorMessages: [],
    formData: {},
    post: null,
  });
};

exports.createPost = async (req, res) => {
  try {
    // Extract form data from the request body
    const {
      title,
      slug,
      tag_line,
      summary,
      content,
      category,
      author,
      tags,
      photo_gallery,
      published,
      published_date,
    } = req.body;

    // Handle featured image upload
    const featured_image = req.files["featured_image"]
      ? `/uploads/post/${req.files["featured_image"][0].filename}`
      : "/images/default.jpg";

    // Handle gallery images upload
    const gallery_images = req.files["gallery_images"]
      ? req.files["gallery_images"].map(
          (file) => `/uploads/post/gallery/${file.filename}`
        )
      : [];
    // Create a new post object
    const newPost = new Post({
      title,
      slug,
      tag_line,
      summary,
      content,
      category,
      author,
      tags,
      photo_gallery: gallery_images.length > 0, // Set true if there are gallery images
      gallery_images, // Store the array of gallery image paths
      published: published === "on",
      published_date: published_date || Date.now(),
      featured_image,
    });

    // Save the post to the database
    await newPost.save();

    // Invalidate the cached post list
    await redis.del("/cms/post");

    // Redirect to the post listing page after successful creation
    res.redirect("/cms/post");
  } catch (err) {
    if (err.name === "ValidationError") {
      const errorMessages = Object.values(err.errors).map(
        (error) => error.message
      );
      res.render("posts/post/post_create_edit", {
        title: "Create Post",
        errorMessages,
        formData: req.body,
        post: null,
      });
    } else {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Invalidate the cached post list
    await redis.del("/cms/post");
    // Handle deletion of associated files here if necessary
    res.redirect("/cms/post");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Get the post edit page using async/await
exports.getPostEditPage = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Pass 'errorMessages' as an empty array if no errors exist
    res.render("posts/post/post_create_edit", {
      title: "Edit Post",
      post, // Pass the post to EJS
      errorMessages: [], // Default to empty array
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Handle updating a post
exports.updatePost = async (req, res) => {
  const postId = req.params.postId;
  const {
    title,
    slug,
    tag_line,
    summary,
    content,
    category,
    author,
    tags,
    published,
    published_date,
  } = req.body;

  // Array to collect validation errors
  const errorMessages = [];

  // Perform manual validation on required fields
  if (!title || title.trim() === "") errorMessages.push("Title is required");
  if (!slug || slug.trim() === "") errorMessages.push("Slug is required");
  if (!content || content.trim() === "")
    errorMessages.push("Content is required");
  if (!category || category.length === 0)
    errorMessages.push("At least one category is required");
  if (!author || author.trim() === "") errorMessages.push("Author is required");

  // If there are validation errors, re-render the form with error messages
  if (errorMessages.length > 0) {
    // Fetch the existing post to repopulate the form
    const existingPost = await Post.findById(postId);
    return res.render("posts/post/post_create_edit", {
      title: "Edit Post",
      errorMessages,
      post: {
        ...existingPost.toObject(), // Copy existing post details
        title, // Preserve user’s current input
        slug,
        tag_line,
        summary,
        content,
        category,
        author,
        tags,
        published,
        published_date,
      },
    });
  }

  try {
    // Handle featured image update if provided
    const featured_image = req.files["featured_image"]
      ? `/uploads/post/${req.files["featured_image"][0].filename}`
      : req.body.existing_featured_image;

    // Handle gallery images update
    const gallery_images = req.files["gallery_images"]
      ? req.files["gallery_images"].map(
          (file) => `/uploads/post/gallery/${file.filename}`
        )
      : req.body.existing_gallery_images || [];

    // Ensure empty values for category and author are not set to old values
    const updatedCategory = category && category.length > 0 ? category : [];
    const updatedAuthor = author && author.trim() !== "" ? author : "";

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        slug,
        tag_line,
        summary,
        content,
        category: updatedCategory, // Ensure empty category doesn't default to old value
        author: updatedAuthor, // Ensure empty author doesn't default to old value
        tags,
        photo_gallery: gallery_images.length > 0, // Set to true if there are gallery images
        gallery_images,
        featured_image,
        published: published === "on",
        published_date: published_date || Date.now(),
      },
      { new: true, runValidators: true } // Ensure Mongoose validation is still applied
    );

    if (!updatedPost) {
      return res.status(404).send("Post not found");
    }

    // Invalidate the cached post list
    await redis.del("/cms/post");

    // Redirect after successful update
    res.redirect("/cms/post");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

//view Author page
exports.getAuthorPage = (req, res) => {
  res.render("posts/author/author_listing", { title: "Author Page" });
};

//view Author Create page
exports.getAuthorCreatePage = (req, res) => {
  res.render("posts/author/author_create_edit", {
    title: "Author Create Page",
  });
};

//view Author Edit page
exports.getAuthorEditPage = (req, res) => {
  res.render("posts/author/author_create_edit", { title: "Author Edit Page" });
};

//view Category page
exports.getCategoryPage = (req, res) => {
  res.render("posts/category/category_listing", { title: "Category Page" });
};

//view Category Create page
exports.getCategoryCreatePage = (req, res) => {
  res.render("posts/category/category_create_edit", {
    title: "Category Create Page",
  });
};

//view Category Edit page
exports.getCategoryEditPage = (req, res) => {
  res.render("posts/category/category_create_edit", {
    title: "Category Edit Page",
  });
};

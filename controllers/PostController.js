const Post = require("../models/Post");
const Author = require("../models/Author");
const Category = require("../models/Category");
const CustomField = require("../models/CustomField");
const validationConfig = require("../config/validationConfig.json");
const Gallery = require("../models/Gallery");

const path = require("path");
const fs = require("fs");

const redis = require("../config/redis");
const { body, validationResult } = require("express-validator");

// Fetch author and categories
async function fetchCategoriesAndAuthors() {
  const categories = await Category.find({ status: "active" }).lean();
  const authors = await Author.find({ status: "active" }).lean();
  return { categories, authors };
}

const getPostValidationRules = () => {
  const rules = [];

  // Validate the title field if it's included in the config
  if (validationConfig.post.title) {
    rules.push(
      body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 5 })
        .withMessage("Title must be at least 5 characters long")
    );
  }

  // Validate the slug field if it's included in the config
  if (validationConfig.post.slug) {
    rules.push(
      body("slug")
        .notEmpty()
        .withMessage("Slug is required")
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage("Slug must be a URL-friendly string")
    );
  }

  // Validate the author field based on the config
  if (validationConfig.post.author) {
    rules.push(body("author").notEmpty().withMessage("Author is required"));
  }

  // Validate the category field based on the config
  if (validationConfig.post.category) {
    rules.push(body("category").notEmpty().withMessage("Category is required"));
  }

  // Validate the content field based on the config
  if (validationConfig.post.content) {
    rules.push(
      body("content")
        .notEmpty()
        .withMessage("Content is required")
        .isLength({ min: 20 })
        .withMessage("Content must be at least 20 characters long")
    );
  }

  // Validate the tags field based on the config
  if (validationConfig.post.tags) {
    rules.push(body("tags").notEmpty().withMessage("Tags are required"));
  }

  return rules;
};
//view post page
exports.getPostPage = async (req, res) => {
  if (req.session.user) {
    try {
      // Fetch all posts from the database
      const posts = await Post.find();
      // Render the view and pass the posts to the EJS template
      res.render("posts/post/post_listing", { title: "Post Page", posts });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
      res.render("404", {
        errorMessages: "Something is wrong with our side. Please inform us!",
        error: "500",
      });
    }
  } else {
    res.render("404", {
      errorMessages: "Looks Like you are lost!",
      error: "404",
    });
  }
};

//view post Create page
exports.getPostCreatePage = async (req, res) => {
  if (req.session.user) {
    try {
      // Fetch all categories  and authors to populate the dropdown

      let customField = await CustomField.find()
        .populate({
          path: "model", // Populate the 'model' field
          match: { path: "../models/Post" }, // Filter to only include models with the specified path
        })
        .populate({
          path: "target_type", // Populate the 'field' field
        });

      // In getPostCreatePage
      const { categories, authors } = await fetchCategoriesAndAuthors();

      

      res.render("posts/post/post_create_edit", {
        title: "Create Post",
        errorMessages: [],
        formData: {},
        post: null,
        categories,
        authors,
        formConfig: validationConfig.post,
        customField,
        gallery_images: [],
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      // res.status(500).send("Server Error");
      res.status(500).render("404", {
        errorMessages: "Something is wrong with our side. Please inform us!",
        error: "500",
      });
    }
  } else {
    res.render("404", {
      errorMessages: "Looks Like you are lost!",
      error: "404",
    });
  }
};

exports.createPost = [
  // Apply dynamic validation rules based on config
  ...getPostValidationRules(),

  async (req, res) => {
    let gallery = null;
    let uploadedGalleryImages = []; 

    try {
      let customField = await CustomField.find()
        .populate({
          path: "model", // Populate the 'model' field
          match: { path: "../models/Post" }, // Filter to only include models with the specified path
        })
        .populate({
          path: "target_type", // Populate the 'field' field
        });

      // Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Fetch categories and authors again to render the form
        // In createPost validation error handling
        const { categories, authors } = await fetchCategoriesAndAuthors();

        return res.render("posts/post/post_create_edit", {
          title: "Create Post",
          errorMessages: errors.array().map((err) => err.msg),
          formData: req.body,
          post: null,
          categories,
          authors,
          formConfig: validationConfig.post,
          customField,
        });
      }

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
        status,
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

      //Creating a new gallery entry
      if (gallery_images.length > 0) {
        gallery = new Gallery({
          images: gallery_images.map((url) => ({ url })),
          description: summary || "",
        });

        // Save the gallery to the database
        gallery = await gallery.save();
      }

      // Create a new post object
      const newPost = new Post({
        title,
        slug,
        tag_line,
        summary,
        content,
        author: validationConfig.post.author ? author : undefined,
        category: validationConfig.post.category ? category : undefined,
        tags: validationConfig.post.tags ? tags : undefined,
        photo_gallery: photo_gallery === "on",
        gallery: gallery ? gallery._id : null,
        published: status === "on",
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
      // Clean up the gallery
      if (gallery) {
        await Gallery.findByIdAndDelete(gallery._id);
      }

      // Delete uploaded gallery images from the server
      for (const imagePath of uploadedGalleryImages) {
        const fullPath = path.join(__dirname, "..", imagePath);
        fs.unlink(fullPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Failed to delete image: ${fullPath}`, unlinkErr);
          }
        });
      }

      // If featured image was uploaded, delete it too
      if (req.files["featured_image"]) {
        const featuredImagePath = path.join(__dirname, "..", featured_image);
        fs.unlink(featuredImagePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(
              `Failed to delete featured image: ${featuredImagePath}`,
              unlinkErr
            );
          }
        });
      }
      console.error(err);
      // res.status(500).send("Server Error");

      // In case of any other errors, show server error
      res.status(500).render("404", {
        errorMessages: "Something is wrong with our side. Please inform us!",
        error: "500",
      });
    }
  },
];

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
    res.render("404", {
      errorMessages: "Something is wrong with our side. Please inform us!",
      error: "500",
    });
  }
};

// Get the post edit page using async/await
exports.getPostEditPage = async (req, res) => {
  if (req.session.user) {
    try {
      let customField = await CustomField.find()
        .populate({
          path: "model", // Populate the 'model' field
          match: { path: "../models/Post" }, // Filter to only include models with the specified path
        })
        .populate({
          path: "target_type", // Populate the 'field' field
        });

      const postId = req.params.postId;

      // Find the post by ID
      const post = await Post.findById(postId);

      // In getPostCreatePage
      const { categories, authors } = await fetchCategoriesAndAuthors();

      if (!post) {
        return res.status(404).send("Post not found");
      }

      gallery_images = await Gallery.findById(post.gallery);

      res.render("posts/post/post_create_edit", {
        title: "Edit Post",
        post,
        errorMessages: [],
        authors,
        categories,
        formConfig: validationConfig.post,
        customField,
        gallery_images: gallery_images ? gallery_images.images : [],
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
      res.render("404", {
        errorMessages: "Something is wrong with our side. Please inform us!",
        error: "500",
      });
    }
  } else {
    res.render("404", {
      errorMessages: "Looks Like you are lost!",
      error: "404",
    });
  }
};

// Handle updating a post
exports.updatePost = [
  // Apply dynamic validation rules based on config
  ...getPostValidationRules(),

  async (req, res) => {
    try {
      const postId = req.params.postId;

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const existingPost = await Post.findById(postId);
        const { categories, authors } = await fetchCategoriesAndAuthors();

        return res.render("posts/post/post_create_edit", {
          title: "Edit Post",
          errorMessages: errors.array().map((err) => err.msg),
          post: {
            ...existingPost.toObject(),
            title,
            slug,
            tag_line,
            summary,
            content,
            category,
            author,
            tags,
            status: status === "on",
            published_date,
          },
          authors,
          categories,
          formConfig: validationConfig.post,
        });
      }

      // If validation passes, continue with updating the post
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
        status,
        published_date,
      } = req.body;

      // Handle featured image update
      const featured_image = req.files["featured_image"]
        ? `/uploads/post/${req.files["featured_image"][0].filename}`
        : req.body.existing_featured_image;

      // Handle gallery images update
      let gallery_images = req.files["gallery_images"]
        ? req.files["gallery_images"].map(
            (file) => `/uploads/post/gallery/${file.filename}`
          )
        : [];

      // Find the existing post
      const existingPost = await Post.findById(postId);

      // Check for existing gallery and update if needed
      let gallery = existingPost.gallery
        ? await Gallery.findById(existingPost.gallery)
        : null;

      if (gallery && gallery_images.length > 0) {
        // Append new images to existing gallery
        gallery.images = [
          ...gallery.images,
          ...gallery_images.map((url) => ({ url })),
        ];
        await gallery.save();
      } else if (!gallery && gallery_images.length > 0) {
        // Create new gallery if not existing and new images provided
        gallery = new Gallery({
          images: gallery_images.map((url) => ({ url })),
          description: summary || "",
        });
        await gallery.save();
      }

      // Prepare update data
      const updateData = {
        title,
        slug,
        tag_line,
        summary,
        content,
        author: validationConfig.post.author ? author : undefined,
        category: validationConfig.post.category ? category : undefined,
        tags: validationConfig.post.tags ? tags : undefined,
        photo_gallery: photo_gallery === "on",
        gallery: gallery ? gallery._id : existingPost.gallery,
        published: status === "on",
        published_date: published_date || Date.now(),
        featured_image,
      };

      // Update the post
      const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedPost) {
        return res.status(404).send("Post not found");
      }

      // Invalidate cache and redirect
      await redis.del("/cms/post");
      return res.redirect("/cms/post");
    } catch (err) {
      console.error(err);
      res.status(500).render("404", {
        errorMessages: "Something went wrong on our side. Please inform us!",
        error: "500",
      });
    }
  },
];

// Controller to handle the delete image request
exports.deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id;

    // Find the gallery that contains the image
    const gallery = await Gallery.findOne({ "images._id": imageId });

    if (gallery) {
      // Find the index of the image in the gallery's images array
      const imageIndex = gallery.images.findIndex(
        (image) => image._id.toString() === imageId
      );

      if (imageIndex > -1) {
        // Get the URL of the image to delete the file from the server
        const imageUrl = gallery.images[imageIndex].url;

        const filePath = path.join(__dirname, "..", "public", imageUrl);

        // Remove the image from the array
        gallery.images.splice(imageIndex, 1);

        // Save the updated gallery
        await gallery.save();

        // Delete the image file from the server
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Failed to delete file:", err);
            return res.status(500).json({
              success: false,
              message: "Failed to delete image file from the server",
            });
          }

          // Respond with success
          res.json({ success: true, message: "Image removed successfully" });
        });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Image not found in the gallery" });
      }
    } else {
      res.status(404).json({ success: false, message: "Gallery not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// View Authors page
exports.getAuthorPage = async (req, res) => {
  try {
    const authors = await Author.find();
    res.render("posts/author/author_listing", {
      title: "Author Page",
      authors,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
// View Author Create page
exports.getAuthorCreatePage = (req, res) => {
  res.render("posts/author/author_create_edit", {
    title: "Author Create Page",
    author: null,
  });
};

// Create Author
exports.createAuthor = [
  // Validation rules
  body("name").notEmpty().withMessage("Name is required"),
  body("slug").notEmpty().withMessage("Slug is required"),
  body("email").isEmail().withMessage("Invalid email address"),

  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array().map((err) => err.msg) });
    }

    try {
      // Extract form data
      const { name, slug, email, content } = req.body;
      const status = req.body.status === "on" ? "active" : "inactive";

      // Group social media links under `socialLinks`
      const socialLinks = {
        facebook: req.body.facebook || "",
        instagram: req.body.instagram || "",
        twitter: req.body.twitter || "",
        linkedin: req.body.linkedin || "",
      };

      // Create new author object
      const newAuthor = new Author({
        name,
        slug,
        email,
        content,
        status,
        socialLinks, // Store social media links correctly
      });

      // Save author to database
      await newAuthor.save();
      await redis.del("/cms/author"); // Clear cache

      // Redirect to author listing
      res.redirect("/cms/author");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  },
];

// View Author Edit page
exports.getAuthorEditPage = async (req, res) => {
  try {
    const authorId = req.params.authorId;

    // Find the author by ID
    const author = await Author.findById(authorId);

    // If the author is not found, handle the error appropriately
    if (!author) {
      return res.status(404).send("Author not found");
    }

    // Render the form with the existing author data
    res.render("posts/author/author_create_edit", {
      title: "Edit Author",
      author: author, // Pass the author object to the template
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Update Author
exports.updateAuthor = async (req, res) => {
  try {
    const {
      name,
      slug,
      email,
      facebook,
      instagram,
      twitter,
      linkedin,
      content,
    } = req.body;

    // Convert "on" to "active", otherwise "inactive"
    const status = req.body.status === "on" ? "active" : "inactive";

    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.authorId,
      {
        name,
        slug,
        email,
        facebook,
        instagram,
        twitter,
        linkedin,
        content,
        status,
      },
      { new: true }
    );

    if (!updatedAuthor) return res.status(404).send("Author not found");

    await redis.del("/cms/author");

    res.redirect("/cms/author");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Delete Author
exports.deleteAuthor = async (req, res) => {
  try {
    const authorId = req.params.authorId;

    // Use `findByIdAndDelete` to delete the author directly
    const deletedAuthor = await Author.findByIdAndDelete(authorId);

    if (!deletedAuthor) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Clear cache after deletion
    await redis.del("/cms/author");

    // Send a JSON response indicating success
    res.json({ message: "Author deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

//view Category page
exports.getCategoryPage = async (req, res) => {
  try {
    const categories = await Category.find().populate("parent");
    // Pass categories to the view
    res.render("posts/category/category_listing", {
      title: "Category Page",
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Server Error");
    res.render("404", {
      errorMessages: "Something is wrong with our side. Please inform us!",
      error: "500",
    });
  }
};

exports.createCategory = [
  // Validate fields
  body("title").notEmpty().withMessage("Title is required"),
  body("slug")
    .notEmpty()
    .withMessage("Slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Invalid slug format"),

  // Process request
  async (req, res) => {
    console.log(req.file);
    console.log(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessage = errors
        .array()
        .map((err) => err.msg)
        .join(", ");

      // Redirect back with an error query parameter
      return res.redirect(
        `/cms/category/create?error=${encodeURIComponent(errorMessage)}`
      );
    }

    try {
      const { title, slug, tag_line, parent, content } = req.body;
      const status = req.body.status === "on" ? "active" : "inactive";
      const parentCategory = parent === "None" ? null : parent;

      // Create category with correct `parent` field
      const category = new Category({
        title,
        slug,
        tag_line,
        parent: parentCategory,
        content,
        status,
      });

      // Handle uploaded file (category_image)
      if (req.file) {
        category.featured_image = `/uploads/category/${req.file.filename}`;
      }

      // Save category to the database
      await category.save();

      // Clear the cache (if used)
      await redis.del("/cms/category");

      // Redirect to category page with success message in query parameters
      return res.redirect(
        `/cms/category?success=${encodeURIComponent(
          "Category created successfully!"
        )}`
      );
    } catch (error) {
      console.error("Failed to create category:", error);

      // Redirect back with an error query parameter
      return res.redirect(
        `/cms/category/create?error=${encodeURIComponent(
          "Failed to create category. Please try again."
        )}`
      );
    }
  },
];

//view Category Create page
exports.getCategoryCreatePage = async (req, res) => {
  try {
    let customField = await CustomField.find()
      .populate({
        path: "model", // Populate the 'model' field
        match: { path: "../models/Category" }, // Filter to only include models with the specified path
      })
      .populate({
        path: "target_type", // Populate the 'field' field
      });

    // Fetch all categories
    const categories = await Category.find();

    // Render the view and pass the categories
    res.render("posts/category/category_create_edit", {
      title: "Category Create Page",
      cat: null,
      categories, // Pass categories to view
      formData: {},
      customField,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Server Error");
    res.render("404", {
      errorMessages: "Something is wrong with our side. Please inform us!",
      error: "500",
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { title, slug, tag_line, parent, content } = req.body;

    // Check if a file was uploaded
    let featured_image = req.body.existing_featured_image;
    if (req.file) {
      featured_image = `/uploads/category/${req.file.filename}`;
    }
    const updatedData = {
      title,
      slug,
      tag_line,
      parent: parent === "None" ? null : parent,
      content,
      featured_image, // Set updated image
    };

    const categoryId = req.params.categoryId;
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updatedData,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).send("Category not found");
    }

    await redis.del("/cms/category");
    res.redirect("/cms/category");
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).send("Server Error");
  }
};

exports.deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    // Find the category to be deleted
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found!" });
    }

    // Check if the category is a parent to other categories
    const isParent = await Category.exists({ parent: categoryId });
    if (isParent) {
      return res.status(400).json({
        message:
          "Cannot delete category as it is a parent to one or more categories.",
      });
    }

    // Check if the category is used in any posts
    const isUsedInPosts = await Post.exists({ category: categoryId });
    if (isUsedInPosts) {
      return res.status(400).json({
        message:
          "Cannot delete category as it is assigned to one or more posts.",
      });
    }

    // If not a parent and not used in posts, proceed to delete
    await category.deleteOne();
    await redis.del("/cms/category");

    res.status(200).json({ message: "Category deleted successfully!" });
  } catch (error) {
    console.error("Failed to delete category:", error);
    res.status(500).json({ message: "Failed to delete category", error });
  }
};

//view Category Edit page
exports.getCategoryEditPage = async (req, res) => {
  try {
    let customField = await CustomField.find()
      .populate({
        path: "model", // Populate the 'model' field
        match: { path: "../models/Category" }, // Filter to only include models with the specified path
      })
      .populate({
        path: "target_type", // Populate the 'field' field
      });

    const catId = req.params.categoryId;

    // Find the post by ID
    const cat = await Category.findById(catId);

    if (!cat) {
      return res.status(404).send("Category not found");
    }

    // Pass 'errorMessages' as an empty array if no errors exist
    res.render("posts/category/category_create_edit", {
      title: "Edit Category",
      errorMessages: [], // Default to empty array
      cat,
      formConfig: validationConfig.post,
      customField,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
    res.render("404", {
      errorMessages: "Something is wrong with our side. Please inform us!",
      error: "500",
    });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { title, slug, tag_line, parent, content } = req.body;

    // Check if a file was uploaded
    let featured_image = req.body.existing_featured_image;
    if (req.file) {
      featured_image = `/uploads/category/${req.file.filename}`;
    }
    const updatedData = {
      title,
      slug,
      tag_line,
      parent: parent === "None" ? null : parent,
      content,
      featured_image, // Set updated image
    };

    const categoryId = req.params.categoryId;
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updatedData,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).send("Category not found");
    }

    await redis.del("/cms/category");
    res.redirect("/cms/category");
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).send("Server Error");
  }
};

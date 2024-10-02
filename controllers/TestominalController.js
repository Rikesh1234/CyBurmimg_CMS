const redis = require("../config/redis");
const Testominal = require("../models/Testominal");

//view testomonial page
exports.getTestomonialPage = async (req, res) => {
  try {
    // Fetch all testimonials from the database
    const testimonials = await Testominal.find();
    
    res.render("testomonial/testomonial_listing", {
      title: "Testimonial Page",
      testimonials,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// View testimonial Create page
exports.getTestomonialCreatePage = (req, res) => {
  res.render("testomonial/testomonial_create_edit", {
    title: "Testimonial Create Page",
    testominal: null,
  });
};

//view testomonial Edit page
// Fetch and render the edit page for a specific testimonial
exports.getTestomonialEditPage = async (req, res) => {
  try {
    const testomonialId = req.params.userId; // Assuming `userId` is the correct parameter name

    // Fetch the testimonial from the database using its ID
    const testominal = await Testominal.findById(testomonialId);

    if (!testominal) {
      return res.status(404).send("Testimonial not found");
    }

    // Render the edit page and pass the testimonial data to the template
    res.render("testomonial/testomonial_create_edit", {
      title: "Edit Testimonial",
      testominal, // Pass the testominal object here
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

//cruds for testominal
exports.createTestominal = async (req, res) => {
  try {
    // Extract form data from the request body
    const { name, designation, content, published, published_date } = req.body;

    // Handle featured image upload
    const featured_image = req.files["testimonials_image"]
      ? `/uploads/testominal/${req.files["testimonials_image"][0].filename}`
      : "/images/default.jpg";

    // Create a new testominal object
    const newTestominal = new Testominal({
      name,
      designation,
      content,
      published: published === "on",
      published_date: published_date || Date.now(),
      featured_image,
    });

    // Save the testominal to the database
    await newTestominal.save();

    // Invalidate the cached testominal list
    await redis.del("/cms/testomonial");

    // Redirect to the testominal listing page after successful creation
    res.redirect("/cms/testomonial");
  } catch (err) {
    if (err.name === "ValidationError") {
      const errorMessages = Object.values(err.errors).map(
        (error) => error.message
      );
      res.render("testomonial/testomonial_create_edit", {
        title: "Create Testomonial",
        errorMessages,
        formData: req.body,
        testominal: null,
      });
    } else {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
};

exports.deleteTestominal = async (req, res) => {
  try {
    const testominal = await Testominal.findByIdAndDelete(
      req.params.testomonialId
    );

    if (!testominal) {
      return res.status(404).send("Testominal not found");
    }

    // Invalidate the cached testominal list
    await redis.del("/cms/testomonial");
    // Handle deletion of associated files here if necessary
    res.redirect("/cms/testomonial");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Handle updating a testominal
exports.updateTestominal = async (req, res) => {
  const testimonialId = req.params.testomonialId;
  const { name, designation, content, published, published_date } = req.body;

  // Array to collect validation errors
  const errorMessages = [];

  // Perform manual validation on required fields
  if (!name || name.trim() === "") errorMessages.push("Name is required");
  if (!designation || designation.trim() === "")
    errorMessages.push("Designation is required");
  if (!content || content.trim() === "")
    errorMessages.push("Content is required");

  // If there are validation errors, re-render the form with error messages
  if (errorMessages.length > 0) {
    // Fetch the existing testominal to repopulate the form
    const existingTestominal = await Testominal.findById(testimonialId);
    return res.render("posts/post/post_create_edit", {
      title: "Edit Testoninal",
      errorMessages,
      testominal: {
        ...existingTestominal.toObject(), // Copy existing testominal details
        name, // Preserve user’s current input
        designation,
        content,
        published,
        published_date,
      },
    });
  }

  try {
    // Handle featured image update if provided
    const featured_image = req.files["testimonials_image"]
      ? `/uploads/testominal/${req.files["testimonials_image"][0].filename}`
      : req.body.existing_featured_image;

    // Update the testominal
    const updatedTestominal = await Testominal.findByIdAndUpdate(
      testimonialId,
      {
        name,
        designation,
        content,
        featured_image,
        published: published === "on",
        published_date: published_date || Date.now(),
      },
      { new: true, runValidators: true } // Ensure Mongoose validation is still applied
    );

    if (!updatedTestominal) {
      return res.status(404).send("Testominal not found");
    }

    // Invalidate the cached testominal list
    await redis.del("/cms/testomonial");

    // Redirect after successful update
    res.redirect("/cms/testomonial");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

//end of cruds for testomonial

const Slider = require("../models/Slider");
const redis = require("../config/redis");

//view slider page
exports.getSliderPage = async (req, res) => {
  try {
    // Fetch all sliders from the database
    const sliders = await Slider.find();
    

    // Render the view and pass the sliders to the EJS template
    res.render("slider/slider_listing", { title: "Slider Page", sliders });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


//view slider Create page
// view slider Create page
exports.getSliderCreatePage = (req, res) => {
  // Pass a null slider object when creating
  res.render("slider/slider_create_edit", {
    title: "Slider Create Page",
    slider: null, // Make sure this is set to `null` for create
  });
};


//view slider Edit page
// view slider Edit page
exports.getSliderEditPage = async (req, res) => {
  try {
    const sliderId = req.params.sliderId;
    // Fetch the slider using its ID
    const slider = await Slider.findById(sliderId);

    if (!slider) {
      return res.status(404).send("Slider not found");
    }

    // Pass the fetched slider data to the template for editing
    res.render("slider/slider_create_edit", {
      title: "Slider Edit Page",
      slider,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


//cruds for slider
exports.createSlider = async (req, res) => {
  try {

    // Extract form data from the request body
    const { title, subtitle, published, published_date } = req.body;

    // Handle featured image upload
    const featured_image = req.files["slider_image"]
      ? `/uploads/sliders/${req.files["slider_image"][0].filename}`
      : "/images/default.jpg";

    // Create a new slider object
    const newSlider = new Slider({
      title,
      subtitle,
      published: published === "on",
      published_date: published_date || Date.now(),
      featured_image,
    });

    // Save the slider to the database
    await newSlider.save();

    // Invalidate the cached slider list
    await redis.del("/cms/slider");

    // Redirect to the slider listing page after successful creation
    res.redirect("/cms/slider");
  } catch (err) {
    if (err.name === "ValidationError") {
      const errorMessages = Object.values(err.errors).map(
        (error) => error.message
      );
      res.render("slider/slider_create_edit", {
        title: "Create Slider",
        errorMessages,
        formData: req.body,
        slider: null,
      });
    } else {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
};


exports.deleteSlider = async (req, res) => {
  try {
    const slider = await Slider.findByIdAndDelete(req.params.sliderId);

    if (!slider) {
      return res.status(404).send("Slider not found");
    }

    // Invalidate the cached slider list
    await redis.del("/cms/slider");
    // Handle deletion of associated files here if necessary
    res.redirect("/cms/slider");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.updateSlider = async (req, res) => {
  const sliderId = req.params.sliderId;
  const { title, subtitle, published, published_date } = req.body;

  // Array to collect validation errors
  const errorMessages = [];

  // Perform manual validation on required fields
  if (!title || title.trim() === "") errorMessages.push("Title is required");

  // If there are validation errors, re-render the form with error messages
  if (errorMessages.length > 0) {
    // Fetch the existing slider to repopulate the form
    const existingSlider = await Slider.findById(sliderId);
    return res.render("slider/slider_create_edit", {
      title: "Edit Slider",
      errorMessages,
      slider: {
        ...existingSlider.toObject(), // Copy existing slider details
        title, // Preserve user’s current input
        subtitle,
        published,
        published_date,
      },
    });
  }

  try {
    // Handle featured image update if provided
    const featured_image = req.files["slider_image"]
      ? `/uploads/sliders/${req.files["slider_image"][0].filename}`
      : req.body.existing_featured_image;

    // Update the slider
    const updatedSlider = await Slider.findByIdAndUpdate(
      sliderId,
      {
        title,
        subtitle,
        featured_image,
        published: published === "on",
        published_date: published_date || Date.now(),
      },
      { new: true, runValidators: true } // Ensure Mongoose validation is still applied
    );

    if (!updatedSlider) {
      return res.status(404).send("Slider not found");
    }

    // Invalidate the cached slider list
    await redis.del("/cms/slider");

    // Redirect after successful update
    res.redirect("/cms/slider");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

//end of cruds for slider
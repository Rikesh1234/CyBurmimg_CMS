const redis = require("../config/redis");
const { body, validationResult } = require("express-validator");
const Ads = require("../models/Ads");
const AdPosition = require("../models/AdPosition");
const AdType = require("../models/AdType");

exports.getAdsPage = async (req, res) => {

  const ads = await Ads.find(); 

  if (req.session.user) {
    try {
      res.render("ads/ads-listing", {
        title: "Advertisement Page",
        ads,
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

exports.getAdsCreatePage = async (req, res) => {
  if (req.session.user) {
    try {
      const adPositions = await AdPosition.find().populate("ad_type");

      // Create a map to group positions by their AdType
      const adTypesWithPositions = {};

      adPositions.forEach((position) => {
        const adTypeName = position.ad_type.name; // The AdType name
        const adTypeSlug = position.ad_type.slug; // The AdType slug (for unique grouping)

        // If the AdType doesn't exist in the map, create an array for it
        if (!adTypesWithPositions[adTypeSlug]) {
          adTypesWithPositions[adTypeSlug] = {
            name: adTypeName,
            positions: [],
          };
        }

        // Push the position under the correct AdType
        adTypesWithPositions[adTypeSlug].positions.push(position);
      });

      res.render("ads/ads-create-edit", {
        title: "Create Ads",
        errorMessages: [],
        formData: {},
        ads: null,
        adTypesWithPositions,
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
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

exports.getAdsEditPage = async (req, res) => {};

exports.createAds = async (req, res) => {
  try {
    // Extracting values from the form
    const { title, startDate, expiredDate, published } = req.body;

    const imageLink = req.body["image-link"] ? req.body["image-link"] : null;

    let featuredImage; // Variable to hold the path of the uploaded image

    // Capture selected AdPositions from req.body
    const AdPositions = [];
    Object.keys(req.body).forEach((key) => {
      if (key.startsWith("adPosition_") && req.body[key]) {
        AdPositions.push(req.body[key]);
      }
    });

    // Handle featured image upload
    if (imageLink) {
      featuredImage = imageLink; // Use the image link provided by the user
    } else {
      featuredImage = req.files["ads_image"]
        ? `/uploads/ads/${req.files["ads_image"][0].filename}`
        : "/images/default.jpg";
    }

    // Create a new ad object
    const newAd = new Ads({
      title,
      AdPositions,
      startDate: new Date(startDate),
      expiredDate: new Date(expiredDate),
      featuredImage,
      published: published ? true : false,
      publishedDate: new Date(),
    });

    // Save the new ad to the database
    await newAd.save();

    // Redirect or send success response
    res.redirect("/cms/ads");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.updateAds = async (req, res) => {};

exports.deleteAds = async (req, res) => {};

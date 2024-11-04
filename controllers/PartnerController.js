const Partner = require("../models/Partner");
const redis = require("../config/redis");
const CustomField = require("../models/CustomField");
//view parnters page
exports.getPartnerPage=(req,res)=>{
  const showingpage = "partner";
    res.render('partners/partner_listing',{title:'Partner Page',showingpage});
}

//view parnters Create page
exports.getPartnerCreatePage= async (req,res)=>{
  const showingpage = "partner";
    res.render('partners/partner_create_edit',{title:'Partner Create Page',showingpage});
}

//view parnters Edit page
exports.getPartnerEditPage=(req,res)=>{
  const showingpage = "partner";
    res.render('partners/partner_create_edit',{title:'Partner Edit Page',showingpage});
}

//crud for partner
exports.createPartner = async (req, res) => {
  try {
    // Extract form data from the request body
    const {
      name,
      url,
      published,
      published_date,
    } = req.body;

    // Handle featured image upload
    const featured_image = req.files["featured_image"]
      ? `/uploads/team/${req.files["featured_image"][0].filename}`
      : "/images/default.jpg";

    
    // Create a new team object
    const newPartner = new Partner({
      name,
      url,
      published: published === "on",
      published_date: published_date || Date.now(),
      featured_image,
    });

    // Save the team to the database
    await newPartner.save();

    // Invalidate the cached team list
    await redis.del("/cms/partner");

    // Redirect to the team listing page after successful creation
    res.redirect("/cms/partner");
  } catch (err) {
    if (err.name === "ValidationError") {
      const errorMessages = Object.values(err.errors).map(
        (error) => error.message
      );
      res.render("partners/partner_create_edit", {
        title: "Create Partner",
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

exports.deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.teamId);

    if (!partner) {
      return res.status(404).send("Partner not found");
    }

    // Invalidate the cached team list
    await redis.del("/cms/partner");
    // Handle deletion of associated files here if necessary
    res.redirect("/cms/partner");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

//end of crud for partners
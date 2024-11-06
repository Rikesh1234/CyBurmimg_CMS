const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const homeController = require("../controllers/HomeController");
const cacheMiddleware = require("../middleware/cacheMiddleware");
const authorize = require("../middleware/authorize");

const teamController = require("../controllers/TeamController");
const userController = require("../controllers/UserController");
const packageController = require("../controllers/PackageController");

const postController = require("../controllers/PostController");
const loginController = require("../controllers/LoginController");
// const settingController = require('../controllers/GlobalController');
const partnerController = require("../controllers/PartnerController");
const productController = require("../controllers/ProductController");
const dashboardController = require("../controllers/DashboardController");
const staticPageController = require("../controllers/StaticPageController");
const testomonialController = require("../controllers/TestominalController");
const customFieldController = require("../controllers/CustomFieldController");
const sliderController = require("../controllers/SliderController");

const masterController = require("../controllers/MasterController");

const advertisementController = require("../controllers/AdvertisementController");



// error route
router.get("/forbidden", (req, res) => {
  res.status(403).render("forbidden", { title: "Access Denied" });
});

// login
router.get("/admin/login", loginController.getLoginPage);
router.post("/admin/login", loginController.getAuth);
router.get("/logout", loginController.getLogout);

//dashboard
router.get("/cms/dashboard", dashboardController.getPage);

//post
router.get(
  "/cms/post",
  cacheMiddleware,
  authorize("Post", "Read"),
  postController.getPostPage
);

router.get(
  "/cms/post/create",
  cacheMiddleware,
  authorize("Post", "Create"),
  postController.getPostCreatePage
);
// Route for handling the post creation
router.post(
  "/cms/post/create",
  upload.fields([
    { name: "featured_image", maxCount: 1 },
    { name: "gallery_images", maxCount: 10 },
  ]),
  cacheMiddleware,
  authorize("Post", "Create"),
  postController.createPost
);

router.get(
  "/cms/post/edit/:postId",
  cacheMiddleware,
  authorize("Post", "Update"),
  postController.getPostEditPage
);
// Route to handle the edit (update) request

router.post(
  "/cms/post/edit/:postId",
  upload.fields([
    { name: "featured_image", maxCount: 1 },
    { name: "gallery_images", maxCount: 10 },
  ]),
  cacheMiddleware,
  authorize("Post", "Update"),
  postController.updatePost
);

router.post(
  "/cms/post/delete/:postId",
  cacheMiddleware,
  authorize("Post", "Delete"),
  postController.deletePost
);

// Route to delete an image from the gallery
router.delete("/gallery/image/:id", postController.deleteImage);

// Author
router.get(
  "/cms/author",
  cacheMiddleware,
  authorize("Author", "Read"),
  postController.getAuthorPage
);
router.get("/cms/author/create", postController.getAuthorCreatePage);
router.post(
  "/cms/author/create",
  upload.single("author_image"),
  cacheMiddleware,
  authorize("Author", "Create"),
  postController.createAuthor
);
router.get("/cms/author/edit/:authorId", postController.getAuthorEditPage);
router.post(
  "/cms/author/edit/:authorId",
  upload.single("author_image"),
  cacheMiddleware,
  authorize("Author", "Update"),
  postController.updateAuthor
);
router.post(
  "/cms/author/delete/:authorId",
  cacheMiddleware,
  authorize("Author", "Delete"),
  postController.deleteAuthor
);

//categoey
router.get(
  "/cms/category",
  cacheMiddleware,
  authorize("Category", "Read"),
  postController.getCategoryPage
);

router.post(
  "/cms/category/create",
  upload.single("category_image"),
  cacheMiddleware,
  authorize("Category", "Create"),
  postController.createCategory
);
router.get(
  "/cms/category/create",
  cacheMiddleware,
  authorize("Category", "Create"),
  postController.getCategoryCreatePage
);
router.get(
  "/cms/category/edit/:categoryId",
  cacheMiddleware,
  authorize("Category", "Update"),
  postController.getCategoryEditPage
);
router.post(
  "/cms/category/edit/:categoryId",
  upload.single("category_image"),
  cacheMiddleware,
  authorize("Category", "Update"),
  postController.updateCategory
);

router.post(
  "/cms/category/delete/:categoryId",
  cacheMiddleware,
  authorize("Category", "Delete"),
  postController.deleteCategory
);

//user
router.get(
  "/cms/user",
  cacheMiddleware,
  authorize("User", "Read"),
  userController.getUserPage
);
router.get(
  "/cms/user/create",
  cacheMiddleware,
  authorize("User", "Create"),
  userController.getUserCreatePage
);
router.get(
  "/cms/user/edit/:userId",
  cacheMiddleware,
  authorize("User", "Update"),
  userController.getUserEditPage
);
// Route for handling the user creation
router.post(
  "/cms/user/create",
  upload.fields([{ name: "user_image", maxCount: 1 }]),
  cacheMiddleware,
  authorize("User", "Create"),
  userController.createUser
);

//user edit
router.post(
  "/cms/user/edit/:userId",
  upload.fields([{ name: "user_image", maxCount: 1 }]),
  cacheMiddleware,
  authorize("User", "Update"),
  userController.updateUser
);

//user delete
router.post(
  "/cms/user/delete/:userId",
  cacheMiddleware,
  authorize("User", "Delete"),
  userController.deleteUser
);

//role
router.get(
  "/cms/role",
  cacheMiddleware,
  authorize("Role", "Read"),
  userController.getRolePage
);
router.get(
  "/cms/role/create",
  cacheMiddleware,
  authorize("Role", "Create"),
  userController.getRoleCreatePage
);
router.get(
  "/cms/role/edit/:roleId",
  cacheMiddleware,
  authorize("Role", "Update"),
  userController.getRoleEditPage
);
// Route for handling the user creation
router.post(
  "/cms/role/create",
  cacheMiddleware,
  authorize("Post", "Create"),
  userController.createRole
);
//role edit
router.post(
  "/cms/role/edit/:roleId",
  cacheMiddleware,
  authorize("Role", "Update"),
  userController.updateRole
);

//role delete
router.post(
  "/cms/role/delete/:roleId",
  cacheMiddleware,
  authorize("Role", "Delete"),
  userController.deleteRole
);

//Permission
router.get("/cms/permissions/:roleId", userController.getRolePermissions);
// Update permissions for a specific role
router.post("/cms/permissions/:roleId", userController.updateRolePermissions);

//staticpage
router.get(
  "/cms/static-page",
  cacheMiddleware,
  authorize("StaticPage", "Read"),
  staticPageController.getStaticPagePage
);
router.get(
  "/cms/static-page/create",
  cacheMiddleware,
  authorize("StaticPage", "Create"),
  staticPageController.getStaticPageCreatePage
);
router.get(
  "/cms/static-page/edit/:pageId",
  cacheMiddleware,
  authorize("StaticPage", "Update"),
  staticPageController.getStaticPageEditPage
);
router.get("/cms/static-page", staticPageController.getStaticPagePage);
router.get(
  "/cms/static-page/create",
  cacheMiddleware,
  authorize("StaticPage", "Create"),
  staticPageController.getStaticPageCreatePage
);
router.get(
  "/cms/static-page/edit/:pageId",
  cacheMiddleware,
  authorize("StaticPage", "Update"),
  staticPageController.getStaticPageEditPage
);

//product
router.get("/cms/product", productController.getProductPage);
router.get("/cms/product/create", productController.getProductCreatePage);
router.get("/cms/product/edit/:userId", productController.getProductEditPage);
router.get("/cms/product", productController.getProductPage);
router.get("/cms/product/create", productController.getProductCreatePage);
router.get("/cms/product/edit/:userId", productController.getProductEditPage);

//e-category
router.get("/cms/e-category", productController.getECategoryPage);
router.get("/cms/e-category/create", productController.getECategoryCreatePage);
router.get(
  "/cms/e-category/edit/:userId",
  productController.getECategoryEditPage
);

//testomonials
router.get(
  "/cms/testomonial",
  cacheMiddleware,
  authorize("Testimonial", "Read"),
  testomonialController.getTestomonialPage
);
router.get(
  "/cms/testomonial/create",
  cacheMiddleware,
  authorize("Testimonial", "Create"),
  testomonialController.getTestomonialCreatePage
);
router.get(
  "/cms/testomonial/edit/:userId",
  cacheMiddleware,
  authorize("Testimonial", "Update"),
  testomonialController.getTestomonialEditPage
);
// Route for handling the testimonial creation
router.post(
  "/cms/testomonial/create",
  cacheMiddleware,
  authorize("Testimonial", "Create"),
  upload.fields([{ name: "testimonials_image", maxCount: 1 }]),
  testomonialController.createTestominal
);

router.get(
  "/cms/testomonial/edit/:testomonialId",
  cacheMiddleware,
  authorize("Testimonial", "Update"),
  testomonialController.getTestomonialEditPage
);
// Route to handle the edit (update) request

router.post(
  "/cms/testomonial/edit/:testomonialId",
  cacheMiddleware,
  authorize("Testimonial", "Update"),
  upload.fields([{ name: "testimonials_image", maxCount: 1 }]),
  testomonialController.updateTestominal
);

router.post(
  "/cms/testomonial/delete/:testomonialId",
  cacheMiddleware,
  authorize("Testimonial", "Delete"),
  testomonialController.deleteTestominal
);

//partners
router.get("/cms/partner", partnerController.getPartnerPage);
router.get("/cms/partner/create", partnerController.getPartnerCreatePage);
router.get("/cms/partner/edit/:userId", partnerController.getPartnerEditPage);
router.get("/cms/partner", partnerController.getPartnerPage);
router.get("/cms/partner/create", partnerController.getPartnerCreatePage);
router.get("/cms/partner/edit/:userId", partnerController.getPartnerEditPage);

// Team Routes
router.get(
  "/cms/team",
  cacheMiddleware,
  authorize("Team", "Read"),
  teamController.getTeamPage
);
router.get(
  "/cms/team/create",
  cacheMiddleware,
  authorize("Team", "Create"),
  teamController.getTeamCreatePage
);
router.get(
  "/cms/team/edit/:teamId",
  cacheMiddleware,
  authorize("Team", "Update"),
  upload.fields([{ name: "team_image", maxCount: 1 }]),
  teamController.getTeamEditPage
);

// Create team with image upload
router.post(
  "/cms/team/create",
  (req, res, next) => {
    upload.fields([{ name: "team_image", maxCount: 1 }])(req, res, (err) => {
      if (err) {
        console.error(err);
        return res.status(400).send("File upload error");
      }
      next();
    });
  },
  cacheMiddleware,
  authorize("Team", "Create"),
  teamController.createTeam
);

// Edit team with image upload
router.post(
  "/cms/team/edit/:teamId",
  (req, res, next) => {
    upload.fields([{ name: "team_image", maxCount: 1 }])(req, res, (err) => {
      if (err) {
        console.error(err);
        return res.status(400).send("File upload error");
      }
      next();
    });
  },
  cacheMiddleware,
  authorize("Team", "Update"),
  teamController.updateTeam
);

// Delete team
router.post(
  "/cms/team/delete/:teamId",
  cacheMiddleware,
  authorize("Team", "Delete"),
  teamController.deleteTeam
);

//teamType
router.get("/cms/team-type", teamController.getTeamTypePage);
router.get("/cms/team-type/create", teamController.getTeamTypeCreatePage);
router.get("/cms/team-type/edit/:userId", teamController.getTeamTypeEditPage);
router.get("/cms/team-type", teamController.getTeamTypePage);
router.get("/cms/team-type/create", teamController.getTeamTypeCreatePage);
router.get("/cms/team-type/edit/:userId", teamController.getTeamTypeEditPage);

//setting
// router.get('/cms/setting',settingController.getSettingPage);
// router.get('/cms/setting/create',settingController.getSettingCreatePage);

//custom field
router.get(
  "/cms/custom-field",
  cacheMiddleware,
  authorize("CustomField", "Read"),
  customFieldController.getCustomFieldPage
);

router.get(
  "/cms/custom-field/create",
  cacheMiddleware,
  authorize("CustomField", "Create"),
  customFieldController.getCustomFieldCreatePage
);
// router.post(
//   "/cms/custom-field/create",
//   cacheMiddleware,
//   authorize("CustomField", "Create"),
//   customFieldController.createCustomField
// );

router.get(
  "/cms/custom-field/edit/:fieldId",
  cacheMiddleware,
  authorize("CustomField", "Create"),
  customFieldController.getCustomFieldEditPage
);
router.post(
  "/cms/custom-field/create-edit/:fieldId?",
  cacheMiddleware,
  authorize("CustomField", "Create"),
  customFieldController.createOrUpdateCustomField
);

router.post(
  "/cms/custom-field/delete/:customFieldId",
  cacheMiddleware,
  authorize("CustomField", "Delete"),
  customFieldController.deleteField
);

//slider
router.get(
  "/cms/slider",
  cacheMiddleware,
  authorize("Slider", "Read"),
  sliderController.getSliderPage
);
router.get(
  "/cms/slider/create",
  cacheMiddleware,
  authorize("Slider", "Create"),
  sliderController.getSliderCreatePage
);
// Route for handling the slider creation
router.post(
  "/cms/slider/create",
  upload.fields([{ name: "slider_image", maxCount: 1 }]),
  cacheMiddleware,
  authorize("Slider", "Create"),
  sliderController.createSlider
);

router.get(
  "/cms/slider/edit/:sliderId",
  cacheMiddleware,
  authorize("Slider", "Update"),
  sliderController.getSliderEditPage
);

//slider edit
router.post(
  "/cms/slider/edit/:sliderId",
  upload.fields([{ name: "slider_image", maxCount: 1 }]),
  cacheMiddleware,
  authorize("Slider", "Update"),
  sliderController.updateSlider
);

//slider delete
router.post(
  "/cms/slider/delete/:sliderId",
  cacheMiddleware,
  authorize("Slider", "Delete"),
  sliderController.deleteSlider
);

//package
router.get(
  "/cms/package",
  cacheMiddleware,
  authorize("Package", "Read"),
  packageController.getPackagePage
);
router.get(
  "/cms/package/create",
  cacheMiddleware,
  authorize("Package", "Create"),
  packageController.getPackageCreatePage
);

//Ads
router.get(
  "/cms/ads",
  cacheMiddleware,
  authorize("Advertisement", "Read"),
  advertisementController.getAdsPage
);
router.get(
  "/cms/ads/create",
  cacheMiddleware,
  authorize("Advertisement", "Create"),
  advertisementController.getAdsCreatePage
);
router.get(
  "/cms/ads/edit/:adsId",
  cacheMiddleware,
  authorize("Advertisement", "Update"),
  advertisementController.getAdsEditPage
);

// Route for handling the ads creation
router.post(
  "/cms/ads/create",
  upload.fields([{ name: "ads_image", maxCount: 1 }]),
  cacheMiddleware,
  authorize("Advertisement", "Create"),
  advertisementController.createAds
);

// Static Page - Listing
router.get(
  "/cms/static-page",
  cacheMiddleware,
  authorize("StaticPage", "Read"),
  staticPageController.getStaticPagePage
);

// Static Page - Create Page View
router.get(
  "/cms/static-page/create",
  cacheMiddleware,
  authorize("StaticPage", "Create"),
  staticPageController.getStaticPageCreatePage
);

// Static Page - Create Action
router.post(
  "/cms/static-page/create",
  upload.single("static_page_image"),
  cacheMiddleware,
  authorize("StaticPage", "Create"),
  staticPageController.createStaticPage
);

// Static Page - Edit Page View
router.get(
  "/cms/static-page/edit/:pageId",
  cacheMiddleware,
  authorize("StaticPage", "Update"),
  staticPageController.getStaticPageEditPage
);

// Static Page - Update Action
router.post(
  "/cms/static-page/edit/:pageId",
  upload.single("static_page_image"), // Handle static page image upload
  cacheMiddleware,
  authorize("StaticPage", "Update"),
  staticPageController.updateStaticPage
);

// Static Page - Delete Action
router.post(
  "/cms/static-page/delete/:pageId",
  cacheMiddleware,
  authorize("StaticPage", "Delete"),
  staticPageController.deleteStaticPage
);

//PACKAGE MODULE
router.get(
  "/cms/package",
  cacheMiddleware,
  authorize("Package", "Read"),
  packageController.getPackagePage
);
router.get(
  "/cms/package/create",
  cacheMiddleware,
  authorize("Package", "Create"),
  packageController.getPackageCreatePage
);
router.post(
  "/cms/package/create",
  cacheMiddleware,
  authorize("Package", "Create"),
  packageController.createPackage
);
router.get(
  "/cms/package/edit/:packageId",
  cacheMiddleware,
  authorize("Package", "Update"),
  packageController.getPackageEditPage
);
router.post(
  "/cms/package/edit/:packageId",
  cacheMiddleware,
  authorize("Package", "Update"),
  packageController.updatePackage
);
router.post(
  "/cms/package/delete/:id",
  cacheMiddleware,
  authorize("Package", "Delete"),
  packageController.deletePackage
);

//login user profile
router.get("/cms/user/profile",masterController.getLoginUserData);

router.get("/page/:pageSlug", homeController.getStaticPage);

//mail
router.post("/mail/sendInquiries", masterController.sendInquiries);
router.post("/mail/bookOrder", masterController.bookOrder);

// FALL BACK ROUTE
router.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found",
    error: "404", // Pass a default error value
    errorMessages: "The page you are looking for cannot be found.", // Default error message
  });
});


module.exports = router;

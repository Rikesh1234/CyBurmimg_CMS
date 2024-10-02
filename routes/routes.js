const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const homeController = require("../controllers/HomeController");
const cacheMiddleware = require("../middleware/cacheMiddleware");


const teamController = require('../controllers/TeamController');
const userController = require('../controllers/UserController');
const packageController = require('../controllers/PackageController');


const postController = require('../controllers/PostController');
const loginController = require('../controllers/LoginController');
// const settingController = require('../controllers/GlobalController');
const partnerController = require('../controllers/PartnerController');
const productController = require('../controllers/ProductController');
const dashboardController= require('../controllers/DashboardController');
const staticPageController = require('../controllers/StaticPageController');
const testomonialController = require('../controllers/TestominalController');
const customFieldController = require('../controllers/CustomFieldController');
const sliderController = require('../controllers/SliderController');




// --------------FRONTEND ROUTES
router.get("/", homeController.getPage);
router.get("/page/:slug", homeController.getStaticPage);
router.get("/category/:slug", homeController.getCategoryListingPage);
router.get("/post/:postId", homeController.getPostDetailPage);

router.get('/contact', (req, res) => {
  res.render('theme/goodwill-cleaning/pages/contactPage'); 
});

router.get('/price', (req, res) => {
  res.render('theme/goodwill-cleaning/pages/pricePage'); 
});

router.get("/price", homeController.getPackage);

// --------------FRONTEND ROUTES END



// login
router.get("/admin/login", loginController.getLoginPage);
router.post("/admin/login", loginController.getAuth);
router.get("/logout", loginController.getLogout);

//dashboard
router.get("/cms/dashboard", dashboardController.getPage);

//post
router.get("/cms/post", cacheMiddleware, postController.getPostPage);

router.get("/cms/post/create", postController.getPostCreatePage);
// Route for handling the post creation
router.post(
  "/cms/post/create",
  upload.fields([
    { name: "featured_image", maxCount: 1 },
    { name: "gallery_images", maxCount: 10 },
  ]),
  postController.createPost
);

router.get("/cms/post/edit/:postId", postController.getPostEditPage);
// Route to handle the edit (update) request

router.post(
  "/cms/post/edit/:postId",
  upload.fields([
    { name: "featured_image", maxCount: 1 },
    { name: "gallery_images", maxCount: 10 },
  ]),
  postController.updatePost
);

router.post("/cms/post/delete/:postId", postController.deletePost);



// Author
router.get("/cms/author", postController.getAuthorPage);
router.get("/cms/author/create", postController.getAuthorCreatePage);
router.post(
  "/cms/author/create",
  upload.single("author_image"), 
  postController.createAuthor
);
router.get("/cms/author/edit/:authorId", postController.getAuthorEditPage);
router.post(
  "/cms/author/edit/:authorId",
  upload.single("author_image"), 
  postController.updateAuthor
);
router.post("/cms/author/delete/:authorId", postController.deleteAuthor);


//categoey
router.get("/cms/category", postController.getCategoryPage);

router.post(
  "/cms/category/create",
  upload.single("featured_image"),
  postController.createCategory
);
router.get("/cms/category/create", postController.getCategoryCreatePage);
router.get(
  "/cms/category/edit/:categoryId",
  postController.getCategoryEditPage
);

router.post("/cms/category/delete/:categoryId", postController.deleteCategory);
router.get("/cms/category", postController.getCategoryPage);
router.get("/cms/category",cacheMiddleware, postController.getCategoryPage);

router.post(
  "/cms/category/create",
  upload.single("featured_image"),
  postController.createCategory
);
router.get("/cms/category/create", postController.getCategoryCreatePage);
router.get(
  "/cms/category/edit/:categoryId",
  postController.getCategoryEditPage
);

router.post("/cms/category/delete/:categoryId", postController.deleteCategory);

//user
router.get("/cms/user", userController.getUserPage);
router.get("/cms/user/create", userController.getUserCreatePage);
router.get("/cms/user/edit/:userId", userController.getUserEditPage);
router.get("/cms/user", userController.getUserPage);
router.get("/cms/user/create", userController.getUserCreatePage);
// Route for handling the user creation
router.post(
  "/cms/user/create",
  upload.fields([
    { name: "featured_image", maxCount: 1 },
  ]),
  userController.createUser
);


router.get("/cms/user/edit/:userId", userController.getUserEditPage);
//user edit
router.post(
  "/cms/user/edit/:userId",
  upload.fields([
    { name: "featured_image", maxCount: 1 },
  ]),
  userController.updateUser
);

//user delete
router.post("/cms/user/delete/:userId", userController.deleteUser);


//role
router.get("/cms/role", userController.getRolePage);
router.get("/cms/role/create", userController.getRoleCreatePage);
router.get("/cms/role/edit/:userId", userController.getRoleEditPage);
router.get("/cms/role", userController.getRolePage);
router.get("/cms/role/create", userController.getRoleCreatePage);
// Route for handling the user creation
router.post(
  "/cms/role/create",
  userController.createRole
);

router.get("/cms/role/edit/:roleId", userController.getRoleEditPage);
//role edit
router.post(
  "/cms/role/edit/:roleId",
  userController.updateRole
);

//role delete
router.post("/cms/role/delete/:roleId", userController.deleteRole);



//permission
router.get("/cms/permission/:roleId", userController.getPermissionPage);

//staticpage
router.get("/cms/static-page", staticPageController.getStaticPagePage);
router.get(
  "/cms/static-page/create",
  staticPageController.getStaticPageCreatePage
);
router.get(
  "/cms/static-page/edit/:pageId",
  staticPageController.getStaticPageEditPage
);
router.get("/cms/static-page", staticPageController.getStaticPagePage);
router.get(
  "/cms/static-page/create",
  staticPageController.getStaticPageCreatePage
);
router.get(
  "/cms/static-page/edit/:pageId",
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
router.get("/cms/testomonial", testomonialController.getTestomonialPage);
router.get(
  "/cms/testomonial/create",
  testomonialController.getTestomonialCreatePage
);
router.get(
  "/cms/testomonial/edit/:userId",
  testomonialController.getTestomonialEditPage
);
router.get("/cms/testomonial", testomonialController.getTestomonialPage);
router.get(
  "/cms/testomonial/create",
  testomonialController.getTestomonialCreatePage
);
// Route for handling the testimonial creation
router.post(
  "/cms/testomonial/create",
  upload.fields([{ name: "testimonials_image", maxCount: 1 }]),
  testomonialController.createTestominal
);

router.get(
  "/cms/testomonial/edit/:userId",
  testomonialController.getTestomonialEditPage
);
// Route to handle the edit (update) request

router.post(
  "/cms/testomonial/edit/:testomonialId",
  upload.fields([{ name: "testimonials_image", maxCount: 1 }]),
  testomonialController.updateTestominal
);

router.post("/cms/testomonial/delete/:testomonialId", testomonialController.deleteTestominal);


//partners
router.get("/cms/partner", partnerController.getPartnerPage);
router.get("/cms/partner/create", partnerController.getPartnerCreatePage);
router.get("/cms/partner/edit/:userId", partnerController.getPartnerEditPage);
router.get("/cms/partner", partnerController.getPartnerPage);
router.get("/cms/partner/create", partnerController.getPartnerCreatePage);
router.get("/cms/partner/edit/:userId", partnerController.getPartnerEditPage);

// Team Routes
router.get("/cms/team", teamController.getTeamPage);
router.get("/cms/team/create", teamController.getTeamCreatePage);
router.get("/cms/team/edit/:teamId", teamController.getTeamEditPage);

// Create team with image upload
router.post(
  "/cms/team/create",
  upload.fields([
    { name: "featured_image", maxCount: 1 },
  ]),
  teamController.createTeam
);

// Edit team with image upload
router.post(
  "/cms/team/edit/:teamId",
  upload.fields([
    { name: "featured_image", maxCount: 1 },
  ]),
  teamController.updateTeam
);

// Delete team
router.post("/cms/team/delete/:teamId", teamController.deleteTeam);

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
router.get('/cms/custom-field',customFieldController.getCustomFieldPage);
router.get('/cms/custom-field/create',customFieldController.getCustomFieldCreatePage);

//slider
router.get('/cms/slider',sliderController.getSliderPage);
router.get('/cms/slider/create',sliderController.getSliderCreatePage);
// Route for handling the slider creation
router.post(
  "/cms/slider/create",
  upload.fields([
    { name: "slider_image", maxCount: 1 },
  ]),
  sliderController.createSlider
);


router.get('/cms/slider/edit/:sliderId',sliderController.getSliderEditPage);

//slider edit
router.post(
  "/cms/slider/edit/:sliderId",
  upload.fields([
    { name: "slider_image", maxCount: 1 },
  ]),
  sliderController.updateSlider
);

//slider delete
router.post("/cms/slider/delete/:sliderId", sliderController.deleteSlider);

//package
router.get('/cms/package',packageController.getPackagePage);
router.get('/cms/package/create',packageController.getPackageCreatePage);


// Static Page - Listing
router.get("/cms/static-page",cacheMiddleware, staticPageController.getStaticPagePage);

// Static Page - Create Page View
router.get(
  "/cms/static-page/create",
  staticPageController.getStaticPageCreatePage
);

// Static Page - Create Action
router.post(
  "/cms/static-page/create",
  upload.single("static_page_image"),
  staticPageController.createStaticPage
);

// Static Page - Edit Page View
router.get(
  "/cms/static-page/edit/:pageId",
  staticPageController.getStaticPageEditPage
);

// Static Page - Update Action
router.post(
  "/cms/static-page/edit/:pageId",
  upload.single("static_page_image"), // Handle static page image upload
  staticPageController.updateStaticPage
);

// Static Page - Delete Action
router.post(
  "/cms/static-page/delete/:pageId",
  staticPageController.deleteStaticPage
);

//PACKAGE MODULE
router.get("/cms/package",cacheMiddleware ,packageController.getPackagePage);
router.get("/cms/package/create", packageController.getPackageCreatePage);
router.post("/cms/package/create", packageController.createPackage);
router.get("/cms/package/edit/:packageId", packageController.getPackageEditPage);
router.post("/cms/package/edit/:packageId", packageController.updatePackage);
router.post('/cms/package/delete/:id', packageController.deletePackage);






router.get("/page/:pageSlug", homeController.getStaticPage);

// router.use((req,res)=>{
//     res.status(404).render('404',{title:'Page Not Found'});
// });

// ----------------------------------------------------------------------------------------------
// FRONTEND ROUTES



module.exports = router;
module.exports = router;

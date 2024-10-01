const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const homeController = require("../controllers/HomeController");
const cacheMiddleware = require("../middleware/cacheMiddleware");


const teamController = require('../controllers/TeamController');
const userController = require('../controllers/UserController');
const postController = require('../controllers/PostController');
const loginController = require('../controllers/LoginController');
// const settingController = require('../controllers/GlobalController');
const partnerController = require('../controllers/PartnerController');
const productController = require('../controllers/ProductController');
const dashboardController= require('../controllers/DashboardController');
const staticPageController = require('../controllers/StaticPageController');
const testomonialController = require('../controllers/TestominalController');
const customFieldController = require('../controllers/CustomFieldController');




router.get("/", homeController.getPage);
router.get("/", homeController.getPage);

// login
router.get("/admin/login", loginController.getLoginPage);
router.post("/admin/login", loginController.getAuth);
router.get("/logout", loginController.getLogout);
router.get("/admin/login", loginController.getLoginPage);
router.post("/admin/login", loginController.getAuth);
router.get("/logout", loginController.getLogout);

//dashboard
router.get("/cms/dashboard", dashboardController.getPage);
router.get("/cms/dashboard", dashboardController.getPage);

//post
// router.get('/cms/post',postController.getPostPage);
router.get("/cms/post", cacheMiddleware, postController.getPostPage);
router.get("/cms/post", cacheMiddleware, postController.getPostPage);

router.get("/cms/post/create", postController.getPostCreatePage);
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
router.post(
  "/cms/post/create",
  upload.fields([
    { name: "featured_image", maxCount: 1 },
    { name: "gallery_images", maxCount: 10 },
  ]),
  postController.createPost
);

router.get("/cms/post/edit/:postId", postController.getPostEditPage);
router.get("/cms/post/edit/:postId", postController.getPostEditPage);
// Route to handle the edit (update) request

router.post(
  "/cms/post/edit/:postId",
  upload.fields([
    { name: "featured_image", maxCount: 1 },
    { name: "gallery_images", maxCount: 10 },
    { name: "featured_image", maxCount: 1 },
    { name: "gallery_images", maxCount: 10 },
  ]),
  postController.updatePost
);

router.post("/cms/post/delete/:postId", postController.deletePost);


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



// Author
router.get("/cms/author",cacheMiddleware, postController.getAuthorPage);
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
router.get("/cms/user/edit/:userId", userController.getUserEditPage);

//role
router.get("/cms/role", userController.getRolePage);
router.get("/cms/role/create", userController.getRoleCreatePage);
router.get("/cms/role/edit/:userId", userController.getRoleEditPage);
router.get("/cms/role", userController.getRolePage);
router.get("/cms/role/create", userController.getRoleCreatePage);
router.get("/cms/role/edit/:userId", userController.getRoleEditPage);

//permission
router.get("/cms/permission", userController.getPermissionPage);
router.get("/cms/permission", userController.getPermissionPage);

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
router.get(
  "/cms/testomonial/edit/:userId",
  testomonialController.getTestomonialEditPage
);

//partners
router.get("/cms/partner", partnerController.getPartnerPage);
router.get("/cms/partner/create", partnerController.getPartnerCreatePage);
router.get("/cms/partner/edit/:userId", partnerController.getPartnerEditPage);
router.get("/cms/partner", partnerController.getPartnerPage);
router.get("/cms/partner/create", partnerController.getPartnerCreatePage);
router.get("/cms/partner/edit/:userId", partnerController.getPartnerEditPage);

//team
router.get("/cms/team", teamController.getTeamPage);
router.get("/cms/team/create", teamController.getTeamCreatePage);
router.get("/cms/team/edit/:userId", teamController.getTeamEditPage);
router.get("/cms/team", teamController.getTeamPage);
router.get("/cms/team/create", teamController.getTeamCreatePage);
router.get("/cms/team/edit/:userId", teamController.getTeamEditPage);

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
router.get("/cms/setting", settingController.getSettingPage);
router.get("/cms/setting/create", settingController.getSettingCreatePage);

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

// router.use((req,res)=>{
//     res.status(404).render('404',{title:'Page Not Found'});
// });

module.exports = router;
module.exports = router;

const express=require('express');
const router=express.Router();
const homeController= require('../controllers/HomeController');
const dashboardController= require('../controllers/DashboardController');
const postController = require('../controllers/PostController');
const userController = require('../controllers/UserController');
const staticPageController = require('../controllers/StaticPageController');
const productController = require('../controllers/ProductController');
const testomonialController = require('../controllers/TestominalController');
const partnerController = require('../controllers/PartnerController');
const teamController = require('../controllers/TeamController');
const settingController = require('../controllers/GlobalController');




router.get('/',homeController.getPage);

//dashboard
router.get('/cms/dashboard',dashboardController.getPage);

//post
router.get('/cms/post',postController.getPostPage);
router.get('/cms/post/create',postController.getPostCreatePage);
router.get('/cms/post/edit/:postId',postController.getPostEditPage);

//author
router.get('/cms/author',postController.getAuthorPage);
router.get('/cms/author/create',postController.getAuthorCreatePage);
router.get('/cms/author/edit/:authorId',postController.getAuthorEditPage);

//categoey
router.get('/cms/category',postController.getCategoryPage);
router.get('/cms/category/create',postController.getCategoryCreatePage);
router.get('/cms/category/edit/:categoryId',postController.getCategoryEditPage);

//user
router.get('/cms/user',userController.getUserPage);
router.get('/cms/user/create',userController.getUserCreatePage);
router.get('/cms/user/edit/:userId',userController.getUserEditPage);

//role
router.get('/cms/role',userController.getRolePage);
router.get('/cms/role/create',userController.getRoleCreatePage);
router.get('/cms/role/edit/:userId',userController.getRoleEditPage);

//permission
router.get('/cms/permission',userController.getPermissionPage);

//staticpage
router.get('/cms/static-page',staticPageController.getStaticPagePage);
router.get('/cms/static-page/create',staticPageController.getStaticPageCreatePage);
router.get('/cms/static-page/edit/:userId',staticPageController.getStaticPageEditPage);

//product
router.get('/cms/product',productController.getProductPage);
router.get('/cms/product/create',productController.getProductCreatePage);
router.get('/cms/product/edit/:userId',productController.getProductEditPage);

//e-category
router.get('/cms/e-category',productController.getECategoryPage);
router.get('/cms/e-category/create',productController.getECategoryCreatePage);
router.get('/cms/e-category/edit/:userId',productController.getECategoryEditPage);

//testomonials
router.get('/cms/testomonial',testomonialController.getTestomonialPage);
router.get('/cms/testomonial/create',testomonialController.getTestomonialCreatePage);
router.get('/cms/testomonial/edit/:userId',testomonialController.getTestomonialEditPage);

//partners
router.get('/cms/partner',partnerController.getPartnerPage);
router.get('/cms/partner/create',partnerController.getPartnerCreatePage);
router.get('/cms/partner/edit/:userId',partnerController.getPartnerEditPage);

//team
router.get('/cms/team',teamController.getTeamPage);
router.get('/cms/team/create',teamController.getTeamCreatePage);
router.get('/cms/team/edit/:userId',teamController.getTeamEditPage);

//teamType
router.get('/cms/team-type',teamController.getTeamTypePage);
router.get('/cms/team-type/create',teamController.getTeamTypeCreatePage);
router.get('/cms/team-type/edit/:userId',teamController.getTeamTypeEditPage);

//setting
router.get('/cms/setting',settingController.getSettingPage);
router.get('/cms/setting/create',settingController.getSettingCreatePage);

// router.use((req,res)=>{
//     res.status(404).render('404',{title:'Page Not Found'});
// });


module.exports =router;
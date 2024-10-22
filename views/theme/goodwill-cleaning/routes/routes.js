const express = require("express");

const router = express.Router();
const homeController = require("@/controllers/HomeController");


// --------------FRONTEND ROUTES-------------------------------------
router.get("/", homeController.getPage);
router.get("/page/:slug", homeController.getStaticPage);
router.get("/category/:slug", homeController.getCategoryListingPage);
router.get("/post/:postId", homeController.getPostDetailPage);

router.get('/contact', (req, res) => {
  res.render('theme/goodwill-cleaning/pages/contactPage',{ showingpage: 'contact'}); 
});

router.get('/price', (req, res) => {
  res.render('theme/goodwill-cleaning/pages/pricePage',{showingpage: 'price'}); 
});
router.get("/price", homeController.getPackage);

// --------------FRONTEND ROUTES END---------------------------------

module.exports = router;
//view product page
exports.getProductPage = (req, res) => {
  if (req.session.user) {
    const showingpage = "product";
    res.render("products/product/product_listing", { title: "Product Page",showingpage });
  } else {
    res.render("404", {
      errorMessages: "Looks Like you are lost!",
      error: "404",
    });
  }
};

//view product Create page
exports.getProductCreatePage = (req, res) => {
  if (req.session.user) {
    const showingpage = "product";
    res.render("products/product/product_create_edit", {
      title: "Product Create Page",
      showingpage
    });
  } else {
    res.render("404", {
      errorMessages: "Looks Like you are lost!",
      error: "404",
    });
  }
};

//view product Edit page
exports.getProductEditPage = (req, res) => {
  const showingpage = "product";
  if (req.session.user) {
    res.render("products/product/product_create_edit", {
      title: "Product Edit Page",
      showingpage
    });
  } else {
    res.render("404", {
      errorMessages: "Looks Like you are lost!",
      error: "404",
    });
  }
};

//view e-category page
exports.getECategoryPage = (req, res) => {
  if (req.session.user) {
    const showingpage = "product";
    res.render("products/product_category/product_category_listing", {
      title: "ECategory Page",
      showingpage
    });
  } else {
    res.render("404", {
      errorMessages: "Looks Like you are lost!",
      error: "404",
    });
  }
};

//view e-category Create page
exports.getECategoryCreatePage = (req, res) => {
  if (req.session.user) {
    const showingpage = "product";
    res.render("products/product_category/product_category_create_edit", {
      title: "ECategory Create Page",
      showingpage
    });
  } else {
    res.render("404", {
      errorMessages: "Looks Like you are lost!",
      error: "404",
    });
  }
};

//view e-category Edit page
exports.getECategoryEditPage = (req, res) => {
  if (req.session.user) {
    const showingpage = "product";
    res.render("products/product_category/product_category_create_edit", {
      title: "ECategory Edit Page",
      showingpage
    });
  } else {
    res.render("404", {
      errorMessages: "Looks Like you are lost!",
      error: "404",
    });
  }
};

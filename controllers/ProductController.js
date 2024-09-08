//view product page
exports.getProductPage=(req,res)=>{
    res.render('products/product/product_listing',{title:'Product Page'});
}

//view product Create page
exports.getProductCreatePage=(req,res)=>{
    res.render('products/product/product_create_edit',{title:'Product Create Page'});
}

//view product Edit page
exports.getProductEditPage=(req,res)=>{
    res.render('products/product/product_create_edit',{title:'Product Edit Page'});
}

//view e-category page
exports.getECategoryPage=(req,res)=>{
    res.render('products/product_category/product_category_listing',{title:'ECategory Page'});
}

//view e-category Create page
exports.getECategoryCreatePage=(req,res)=>{
    res.render('products/product_category/product_category_create_edit',{title:'ECategory Create Page'});
}

//view e-category Edit page
exports.getECategoryEditPage=(req,res)=>{
    res.render('products/product_category/product_category_create_edit',{title:'ECategory Edit Page'});
}
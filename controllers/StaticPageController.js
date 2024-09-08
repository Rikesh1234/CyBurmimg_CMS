//view static-page page
exports.getStaticPagePage=(req,res)=>{
    res.render('pages/page_listing',{title:'Static-Page Page'});
}

//view static-page Create page
exports.getStaticPageCreatePage=(req,res)=>{
    res.render('pages/page_create_edit',{title:'Static-Page Create Page'});
}

//view static-page Edit page
exports.getStaticPageEditPage=(req,res)=>{
    res.render('pages/page_create_edit',{title:'Static-Page Edit Page'});
}
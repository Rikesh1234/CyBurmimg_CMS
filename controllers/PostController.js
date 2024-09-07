//view post page
exports.getPostPage=(req,res)=>{
    res.render('posts/post/post_listing',{title:'post Page'});
}

//view post Create page
exports.getPostCreatePage=(req,res)=>{
    res.render('posts/post/post_create_edit',{title:'post Create Page'});
}

//view post Edit page
exports.getPostEditPage=(req,res)=>{
    res.render('posts/post/post_create_edit',{title:'post Edit Page'});
}

//view Author page
exports.getAuthorPage=(req,res)=>{
    res.render('posts/author/author_listing',{title:'Author Page'});
}

//view Author Create page
exports.getAuthorCreatePage=(req,res)=>{
    res.render('posts/author/author_create_edit',{title:'Author Create Page'});
}

//view Author Edit page
exports.getAuthorEditPage=(req,res)=>{
    res.render('posts/author/author_create_edit',{title:'Author Edit Page'});
}

//view Category page
exports.getCategoryPage=(req,res)=>{
    res.render('posts/category/category_listing',{title:'Category Page'});
}

//view Category Create page
exports.getCategoryCreatePage=(req,res)=>{
    res.render('posts/category/category_create_edit',{title:'Category Create Page'});
}

//view Category Edit page
exports.getCategoryEditPage=(req,res)=>{
    res.render('posts/category/category_create_edit',{title:'Category Edit Page'});
}

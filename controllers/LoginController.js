const { getRandomImage } = require('./helper/loginImageHelper');


//view login page
exports.getLoginPage=(req,res)=>{
    try {
        const randomImageUrl = getRandomImage();
        res.render('login/login', { imageUrl: randomImageUrl, title:'Login Page' });
    } catch (error) {
        res.status(500).send('Error occurred: ' + error.message);
    }
}

//other APIs ..

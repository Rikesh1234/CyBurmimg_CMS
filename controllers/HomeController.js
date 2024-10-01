require('dotenv').config();

//view home page
exports.getPage = (req, res) => {
    const theme = process.env.THEME;
    if (!theme) {
        return res.status(500).send('Theme is not defined');
    }
    res.render(`theme/${theme}/index`, { title: 'Home Page' });
};

//other APIs ..

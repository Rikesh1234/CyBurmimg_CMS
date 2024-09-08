require('dotenv').config();


const express =require('express');
const mongoose = require('mongoose');
const path = require('path');
const routes = require('./routes/routes');

const connecionDB= async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology: true,
        });
        console.log('database connected successfully');
    } catch(err){
        console.error('database connection failed: ', err.message);
        process.exit(1);
    }
};

const app = express();
const PORT = process.env.PORT || 3000;

connecionDB();

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use('/',routes);

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})
require('dotenv').config();
const express =require('express');
const expressLayout =require('express-ejs-layouts');

const connectdb=require('./server/config/db');
const app=express();
const PORT =8000 || process.env.PORT;

connectdb();

app.use(expressLayout);
app.use(express.static('public'));
app.set('layout','./layouts/main');
app.set('view engine', 'ejs');


app.use('/', require('./server/routes/main'));



app.listen(PORT,()=>{
    console.log(`listening at port ${PORT}`);
})
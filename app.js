require('dotenv').config();
const express =require('express');
const expressLayout =require('express-ejs-layouts');

const connectdb=require('./server/config/db');
const app=express();
const PORT =8000 || process.env.PORT;

connectdb();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(expressLayout);
app.use(express.static('public'));
app.set('layout','./layouts/main');
app.set('admin','./admin/index');


app.set('view engine', 'ejs');


app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));




app.listen(PORT,()=>{
    console.log(`listening at port ${PORT}`);
})
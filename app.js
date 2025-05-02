require('dotenv').config();
const express =require('express');
const expressLayout =require('express-ejs-layouts');

const connectdb=require('./server/config/db');
const app=express();
const PORT =8000 || process.env.PORT;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
// console.log('Mongo URI:', process.env.MONGODB_URL);  // Make sure it prints your URI correctly

connectdb();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser);
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL, 
        collectionName: 'sessions'
    })
}));
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
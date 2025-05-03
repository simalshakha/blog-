require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectdb = require('./server/config/db');

const { isActiveRoute } = require('./server/helpers/routeHelpers');


const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectdb();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); // ✅ FIXED: Called function
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

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Debug incoming requests
app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

// Start server
app.listen(PORT, () => {
    console.log(`listening at port ${PORT}`);
});

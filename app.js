require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectdb = require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routeHelpers');
// const methodOverride = require('method-override');
// app.use(methodOverride('_method'));

const passport = require('./server/config/passport');

const app = express();

// Session middleware (must come before passport.session())
app.use(session({
  secret: 'your-secret-key', // Change this to a strong secret in production
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


const PORT = process.env.PORT || 5000;

// Connect to DB
connectdb();
// app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
// filepath: app.js
// ...existing code...
app.use(passport.initialize());
app.use(passport.session());
app.use('/', require('./server/routes/oauth'));
// ...existing code...
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

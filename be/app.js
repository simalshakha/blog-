require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectdb = require('./server/config/db');
const passport = require('./server/config/passport');
const methodOverride = require('method-override');

const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// 🔗 Connect to database
connectdb();

// ✅ CORS setup
const corsOptions = {
  origin: 'http://localhost:5173', // removed trailing slash
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
};
app.use(cors(corsOptions));
// app.options('*', cors(corsOptions)); // allow preflight requests

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

// ✅ Session setup (only once!)
app.use(session({
  secret: 'keyboard cat', // use a strong secret in production
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    collectionName: 'sessions'
  })
}));

// ✅ Passport setup (only once!)
app.use(passport.initialize());
app.use(passport.session());

// ✅ EJS + Layouts
app.use(expressLayout);
app.use(express.static('public'));
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// ✅ Logger
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// ✅ Routes
app.use('/', require('./server/routes/oauth'));
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

// ✅ Start server
app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});

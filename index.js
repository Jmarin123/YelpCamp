if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ExpressError = require('./utility/ExpressError');
const campgroundRoute = require('./routes/campgrounds');
const reviewsRoute = require('./routes/reviews');
const authRoute = require('./routes/users');
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('./models/user');
const flash = require('connect-flash');
const session = require('express-session');
const ejsEngine = require('ejs-mate');
const methodOverride = require('method-override');
app.set('view engine', 'ejs'); //Tells us what engine (ejs) we wanna use
app.set('views', path.join(__dirname, 'views')); //How to get the views directory.

app.engine('ejs', ejsEngine);
app.use(express.urlencoded({ extended: true }))//Able to parse the body
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/yelpCamp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});


const sessionConfig = {
    secret: process.env.SESSION_ID,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    if (!['/login', '/', '/aaa', '/javascripts/showPageMap.js'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use('/campgrounds', campgroundRoute);
app.use('/campgrounds/:id/reviews', reviewsRoute);
app.use('/', authRoute);

app.get('/', (_req, res) => {
    res.render('home');
})



app.all('*', (_req, _res, next) => {
    next(new ExpressError('Not a valid route', 404));
})

app.use((err, _req, res, _next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong';
    res.status(status).render('error', { err });
    //res.send("Found bug");
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})
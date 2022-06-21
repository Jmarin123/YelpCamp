const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Review = require('./models/review');
const wrapAsync = require('./utility/wrapAsync');
const ExpressError = require('./utility/ExpressError');
const { reviewSchema } = require('./schema.js');
const campgroundRoute = require('./routes/campgrounds');
const ejsEngine = require('ejs-mate');
const methodOverride = require('method-override');
app.set('view engine', 'ejs'); //Tells us what engine (ejs) we wanna use
app.set('views', path.join(__dirname, 'views')); //How to get the views directory.

app.engine('ejs', ejsEngine);
app.use(express.urlencoded({ extended: true }))//Able to parse the body
app.use(methodOverride('_method'));


mongoose.connect('mongodb://localhost:27017/yelpCamp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});


const validationOfReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.use('/campgrounds', campgroundRoute);

app.get('/', (req, res) => {
    res.render('home');
})

app.post('/campgrounds/:id/reviews', validationOfReview, wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Campground.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Not a valid route', 404));
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong';
    res.status(status).render('error', { err });
    //res.send("Found bug");
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})
const { campgroundJoi, reviewSchema } = require('./schema.js');
const ExpressError = require('./utility/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }
    next();
};

module.exports.validationOfCamp = (req, res, next) => {
    const { error } = campgroundJoi.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    try {
        const campground = await Campground.findById(id);
        if (!campground) {
            req.flash('error', 'Campground does not exist');
            return res.redirect('/campgrounds');
        }
        if (!campground.author.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that');
            return res.redirect(`/campgrounds/${id}`);
        }
        next();
    } catch (e) {
        req.flash('error', 'Campground does not exist');
        return res.redirect('/campgrounds');
    }
};

module.exports.validationOfReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId, id } = req.params;
    try {
        const review = await Review.findById(reviewId);
        //if (!review) {
        //req.flash('error', 'Campground does not exist');
        // return res.redirect('/campgrounds');
        // }
        if (!review.author.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that');
            return res.redirect(`/campgrounds/${id}`);
        }
        next();
    } catch (e) {
        req.flash('error', 'Review does not exist');
        return res.redirect('/campgrounds');
    }
};
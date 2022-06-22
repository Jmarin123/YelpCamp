const express = require('express');
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../schema.js');
const wrapAsync = require('../utility/wrapAsync');
const ExpressError = require('../utility/ExpressError');
const Review = require('../models/review');
const Campground = require('../models/campground');

const validationOfReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post('/', validationOfReview, wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully added review');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Campground.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
}));


module.exports = router;
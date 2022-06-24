const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utility/wrapAsync');
const { validationOfReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const review = require('../controller/reviews');


router.post('/', validationOfReview, isLoggedIn, wrapAsync(review.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(review.deleteReview));


module.exports = router;
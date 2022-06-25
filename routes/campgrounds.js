const express = require('express');
const router = express.Router();
const campgrounds = require('../controller/campgrounds');
const wrapAsync = require('../utility/wrapAsync');
const { isLoggedIn, validationOfCamp, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinaryConfig');
const upload = multer({ storage });

router.route('/')
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validationOfCamp, wrapAsync(campgrounds.createNewCampground));

router.get('/new', isLoggedIn, campgrounds.newForm)

router.route('/:id')
    .get(wrapAsync(campgrounds.showCampground))
    .put(isAuthor, isLoggedIn, upload.array('image'), validationOfCamp, wrapAsync(campgrounds.setEditCampground))
    .delete(isAuthor, isLoggedIn, wrapAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isAuthor, isLoggedIn, wrapAsync(campgrounds.getEditCampground));


module.exports = router;
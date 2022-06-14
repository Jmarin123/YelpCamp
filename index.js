const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const wrapAsync = require('./utility/wrapAsync');
const ExpressError = require('./utility/ExpressError');
const { campgroundJoi } = require('./schema.js');
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


const validationOfCamp = (req, res, next) => {
    const { error } = campgroundJoi.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campgrounds', wrapAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

app.post('/campgrounds', validationOfCamp, wrapAsync(async (req, res, next) => {
    //const addedValue = await 
    //if (!req.body.campground) {
    //throw new ExpressError("Invalid Campground Info", 400);
    // }
    const campground = new Campground(req.body.campground);
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.get('/campgrounds/:id', wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
}));

app.get('/campgrounds/:id/edit', wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));

app.put('/campgrounds/:id', validationOfCamp, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
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
const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelper');


mongoose.connect('mongodb://localhost:27017/yelpCamp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

const grabElement = arr => arr[Math.floor(Math.random() * arr.length)];


const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 60; i++) {
        const valueOfSeeds = Math.floor(Math.random() * 1000)
        const c = new Campground({
            location: `${cities[valueOfSeeds].city}, ${cities[valueOfSeeds].state}`,
            title: `${grabElement(descriptors)} ${grabElement(places)}`
        });
        await c.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close();
});
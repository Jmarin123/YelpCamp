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
        const valueOfSeeds = Math.floor(Math.random() * 1000);
        const randomPrice = Math.floor(Math.random() * 30);
        const c = new Campground({
            author: '62b2b0e97f7761b08f6a70e7',
            location: `${cities[valueOfSeeds].city}, ${cities[valueOfSeeds].state}`,
            title: `${grabElement(descriptors)} ${grabElement(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic magnam exercitationem quaerat cumque doloribus ea ipsum nam asperiores aliquam quam, architecto, alias, eius quas minima nisi sint? Illo, rerum voluptas.',
            price: randomPrice,
            geometry: {
                type: 'Point',
                coordinates: [-153.180996665583, 64.6358675746]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dvdmwk3rm/image/upload/v1656054607/YelpCamp/xvphn15hai8azxeugnre.jpg',
                    filename: 'YelpCamp/xvphn15hai8azxeugnre'
                },
                {
                    url: 'https://res.cloudinary.com/dvdmwk3rm/image/upload/v1656054607/YelpCamp/pupd9na1wzqc05mswy64.jpg',
                    filename: 'YelpCamp/pupd9na1wzqc05mswy64'
                }
            ]
        });
        await c.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close();
});
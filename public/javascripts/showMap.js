
mapboxgl.accessToken = 'pk.eyJ1Ijoid2F0ZXJkdWRlMTIzIiwiYSI6ImNsNHQxaGVpOTFncXAzanBhcHJ6dDk4N3MifQ.ur0DI0wpgPfw4nRe3-i6-A';
console.log(campground.geometry);
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map);
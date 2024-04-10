mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});


const marker = new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25 })
    .setHTML(

       `<H4>${listing.title}</H4><p>Exact Location will be provided after booking</p>`

    )
)
.addTo(map);

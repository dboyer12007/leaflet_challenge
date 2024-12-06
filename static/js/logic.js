// Create the map object
let map = L.map("map").setView([20, 0], 2); // Set center and zoom level

// Add a tile layer (background map)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to determine marker color based on depth
function getColor(depth) {
  return depth > 90 ? "red" :
         depth > 70 ? "orange" :
         depth > 50 ? "yellow" :
         depth > 30 ? "lightgreen" :
         depth > 10 ? "green" :
                      "cyan"; 
}

// URL for earthquake GeoJSON data
let URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the GeoJSON data
fetch(URL)
  .then(response => response.json())
  .then(data => {
    console.log(data); 
    visualizeEarthquakes(data);
  })
  .catch(error => console.error("Error fetching earthquake data:", error));

// Function to add earthquake data to the map
function visualizeEarthquakes(data) {
  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 4, 
        fillColor: getColor(feature.geometry.coordinates[2]), 
        color: "black",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`
        <strong>Location:</strong> ${feature.properties.place}<br>
        <strong>Magnitude:</strong> ${feature.properties.mag}<br>
        <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km
      `);
    }
  }).addTo(map);
}

// Add a legend to the map
let legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  let div = L.DomUtil.create("div", "info legend");
  let depths = [-10, 10, 30, 50, 70, 90];
  let colors = ["cyan", "green", "lightgreen", "yellow", "orange", "red"]; 

  // Loop through depth intervals and generate labels with colored squares
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML +=
      `<i style="background:${colors[i]}"></i> ${depths[i]}${depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+"}`;
  }

  return div;
};

legend.addTo(map);



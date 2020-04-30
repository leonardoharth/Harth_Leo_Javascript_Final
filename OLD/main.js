/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [24, 28],
  zoom: 2
});
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

/* =====================
Initial data import
===================== */

var download_data = $.ajax("https://gist.githubusercontent.com/leonardoharth/cdd2eb8c725abe247e9b688f3f5a8b93/raw/283940b810a249d01b2ec172e814bdea61793a19/volcano.json");

var parsed_dataset = [];
var basemap = L.featureGroup();
var uniqueRegions = [];

/* =====================
Add a base map for initial vizualization, create subregion list
===================== */

download_data.done(function(data) {
  parsed_dataset = JSON.parse(data);
  parsed_dataset.forEach(function(entry) {
    var lat = entry['Latitude'];
    var lon = entry['Longitude'];
    L.circleMarker([lat, lon], {
      radius: 5,
      fillColor: "#bd0026",
      color: "",
      fillOpacity: .4}).bindPopup("Name: " + entry['Name'] + '</br>' + "Epoch: " + entry['Epoch'] + '</br>' + "Type: " + entry['Type'] + '</br>' + "Dominant rock type: " + entry['Dominant_rock_type']).addTo(basemap);
  });
  uniqueRegions = _.unique(_.map(parsed_dataset, function(vulcano) { return vulcano.Region; }));
  _.each(uniqueRegions, function(ddvalue) {
      $('#Region').append('<a>' + ddvalue + '</a>');
    });
  map.addLayer(basemap);
});

/* =====================
Focus on a Region
===================== */

var region;
var region_map = L.featureGroup();

$( "#region-button" ).change(function() {
        region = $("#region-button option:selected").text();
        console.log(region);
        // var filtered_map = _.filter(parsed_dataset, function(volcano){ return volcano.Region == region; });
        // map.removeLayer(basemap);
        // filtered_map.forEach(function(entry) {
        //   var lat = entry['Latitude'];
        //   var lon = entry['Longitude'];
        //   L.circleMarker([lat, lon], {
        //     radius: 8,
        //     fillColor: "#bd0026",
        //     color: "",
        //     fillOpacity: .4}).bindPopup("Name: " + entry['Name'] + '</br>' + "Epoch: " + entry['Epoch'] + '</br>' + "Type: " + entry['Type'] + '</br>' + "Dominant rock type: " + entry['Dominant_rock_type']).addTo(region_map);
        // });
        // map.addLayer(region_map);
        // map.fitBounds(region_map.getBounds());
    });

/* =====================
Use the date ranges
===================== */

var initial_year;
var end_year;

$('#slider1').change(function(e) {
  initial_year = $("#slider1").val();
  console.log(initial_year);
});

$('#slider2').change(function(e) {
  end_year = $("#slider2").val();
  console.log(end_year);
});

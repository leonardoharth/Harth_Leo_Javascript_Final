/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [24, 28],
  zoom: 2
});

// LEAFLET
// var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
//   attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//   subdomains: 'abcd',
//   minZoom: 0,
//   maxZoom: 20,
//   ext: 'png'
// }).addTo(map);

// // MAPBOX
// var Stamen_TonerLite = L.tileLayer('https://api.mapbox.com/styles/v1/leonardoharth/ck9opvgrb199y1ip8zuosa8hv/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGVvbmFyZG9oYXJ0aCIsImEiOiJjazh1bG8ydjkwY2tqM3RxczdnaHozNGpyIn0.fgSBf5Jyjs_Ym4a5-EKWnA', {
//   attribution: '<a href="https://www.mapbox.com/about/maps/">© Mapbox</a> <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a> <a href="https://apps.mapbox.com/feedback/">Improve this map</a>',
//   subdomains: 'abcd',
//   minZoom: 0,
//   maxZoom: 22,
//   ext: 'png'
// }).addTo(map);

// Thunderforest
// var Thunderforest_SpinalMap = L.tileLayer('https://{s}.tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey={apikey}', {
// 	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// 	apikey: '3483edbcf87f4bea9094feacd6f96f74',
// 	maxZoom: 22
// }).addTo(map);

var Esri_WorldPhysical = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
	maxZoom: 22
}).addTo(map);

/* =====================
Initial data import and settings
===================== */

var download_data = $.ajax("https://gist.githubusercontent.com/leonardoharth/cdd2eb8c725abe247e9b688f3f5a8b93/raw/283940b810a249d01b2ec172e814bdea61793a19/volcano.json");

var parsed_dataset = [];
var basemap = L.featureGroup();
var uniqueRegions = [];

$('#slider').hide();
$('.coloring').hide();
$('#reset').hide();
$('#legend_volcano_type').hide();
$('#legend_rock_type').hide();
$('#legend_elevation').hide();
$('#page02').hide();
$('#page03').hide();
$('#page04').hide();

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
      fillOpacity: .4}).bindPopup("Name: " + entry['Name'] + '</br>' + "Epoch: " + entry['Epoch'] + '</br>' + "Type: " + entry['Type'] + '</br>' + "Dominant rock type: " + entry['Dominant_rock_type'] + '</br>' + "Elevation(m): " + entry['Elevation_meters'] + '</br>' + "Year last eruption: " + entry['Year_last_eruption']).addTo(basemap);
  });
  uniqueRegions = _.unique(_.map(parsed_dataset, function(vulcano) { return vulcano.Region; }));
  _.each(uniqueRegions, function(ddvalue) {
      $('#Region').append('<option value="' + ddvalue + '">' + ddvalue + '</option>');
    });
  $('#Region').append('<option value="All regions">All regions</option>');
  map.addLayer(basemap);
});

/* =====================
Focus on a Region
===================== */

var region = "All regions";
var filtered_map;
var region_map = L.featureGroup();

$( "#Region" ).change(function() {
        map.removeLayer(region_map);
        region_map = L.featureGroup();
        map.removeLayer(basemap);
        map.removeLayer(timelinemap);
        region = $("#Region option:selected").text();
        if (region === "All regions") {filtered_map = parsed_dataset} else {
          filtered_map = _.filter(parsed_dataset, function(volcano){ return volcano.Region == region; });
        }
        filtered_map.forEach(function(entry) {
          var lat = entry['Latitude'];
          var lon = entry['Longitude'];
          L.circleMarker([lat, lon], {
            radius: 6,
            fillColor: "#bd0026",
            color: "black",
            weight: 1,
            fillOpacity: .4}).bindPopup("Name: " + entry['Name'] + '</br>' + "Epoch: " + entry['Epoch'] + '</br>' + "Type: " + entry['Type'] + '</br>' + "Dominant rock type: " + entry['Dominant_rock_type'] + '</br>' + "Elevation(m): " + entry['Elevation_meters'] + '</br>' + "Year last eruption: " + entry['Year_last_eruption']).addTo(region_map);
        });
        map.addLayer(region_map);
        map.fitBounds(region_map.getBounds());
        $('#slider').show();
        $('#page02').show();
        $('#page01').hide();
    });

/* =====================
Use the date ranges
===================== */

var initial_year = -10450;
var end_year = 2020;
var timeline_dat;
var timelinemap = L.featureGroup();

$('#slider1').change(function(e) {
  initial_year = $("#slider1").val();
  map.removeLayer(region_map);
  map.removeLayer(basemap);
  map.removeLayer(timelinemap);
  timelinemap = L.featureGroup();
  timeline_dat = _.filter(filtered_map, function(volcano){ return volcano.Register_last_eruption == "Yes" && volcano.Year_last_eruption >= initial_year && volcano.Year_last_eruption <= end_year; });
  timeline_dat.forEach(function(entry) {
    var lat = entry['Latitude'];
    var lon = entry['Longitude'];
    L.circleMarker([lat, lon], {
      radius: 6,
      fillColor: "#bd0026",
      color: "black",
      weight: 1,
      fillOpacity: .4}).bindPopup("Name: " + entry['Name'] + '</br>' + "Epoch: " + entry['Epoch'] + '</br>' + "Type: " + entry['Type'] + '</br>' + "Dominant rock type: " + entry['Dominant_rock_type'] + '</br>' + "Elevation(m): " + entry['Elevation_meters'] + '</br>' + "Year last eruption: " + entry['Year_last_eruption']).addTo(timelinemap);
  });
  map.addLayer(timelinemap);
  map.fitBounds(timelinemap.getBounds());
  $('.coloring').show();
  $('#page03').show();
  $('#page02').hide();
  if (initial_year < 0) {var text_year = initial_year*(-1);} else {var text_year = initial_year;}
  $('#value_slider01').text(text_year);
  if (initial_year >= 0) {$('#Era1').text(" CE");} else {$('#Era1').text(" BCE");}
});

$('#slider2').change(function(e) {
  end_year = $("#slider2").val();
  map.removeLayer(region_map);
  map.removeLayer(basemap);
  map.removeLayer(timelinemap);
  timelinemap = L.featureGroup();
  timeline_dat = _.filter(filtered_map, function(volcano){ return volcano.Register_last_eruption == "Yes" && volcano.Year_last_eruption >= initial_year && volcano.Year_last_eruption <= end_year; });
  timeline_dat.forEach(function(entry) {
    var lat = entry['Latitude'];
    var lon = entry['Longitude'];
    L.circleMarker([lat, lon], {
      radius: 6,
      fillColor: "#bd0026",
      color: "black",
      weight: 1,
      fillOpacity: .4}).bindPopup("Name: " + entry['Name'] + '</br>' + "Epoch: " + entry['Epoch'] + '</br>' + "Type: " + entry['Type'] + '</br>' + "Dominant rock type: " + entry['Dominant_rock_type'] + '</br>' + "Elevation(m): " + entry['Elevation_meters'] + '</br>' + "Year last eruption: " + entry['Year_last_eruption']).addTo(timelinemap);
  });
  map.addLayer(timelinemap);
  map.fitBounds(timelinemap.getBounds());
  $('.coloring').show();
  $('#page03').show();
  $('#page02').hide();
  if (end_year < 0) {var text_year = end_year*(-1);} else {var text_year = end_year;}
  $('#value_slider02').text(text_year);
  if (end_year >= 0) {$('#Era2').text(" CE");} else {$('#Era2').text(" BCE");}
});

/* =====================
Create coloring options
===================== */

$('#coloring').append('<option value="Type">Type</option>');
$('#coloring').append('<option value="Elevation">Elevation</option>');
$('#coloring').append('<option value="Rock_type">Rock_type</option>');

var colormap = L.featureGroup();
var coloring;

// I grouped volcanoes of the same family and the very rare ones under other to improve legibility
var get_color_type = function(entry) {
  if (entry['Type'] === "Maar") { //Maar
      return "#ffffff";
  } else if (entry['Type'] === "Lava dome") { // Lava dome
      return "#ffffe5";
  } else if (entry['Type'] === "Pyroclastic cone") {
      return "#fff7bc";
  } else if (entry['Type'] === "Caldera") {
      return "#fee391";
  } else if (entry['Type'] === "Stratovolcano") {
      return "#fec44f";
  } else if (entry['Type'] === "Complex") {
      return "#fe9929";
  } else if (entry['Type'] === "Submarine") {
      return "#ec7014";
  } else if (entry['Type'] === "Shield") {
      return "#cc4c02";
  } else if (entry['Type'] === "Lava cone") {
      return "#fff7bc";
  } else if (entry['Type'] === "Volcanic field") {
      return "#993404";
  } else if (entry['Type'] === "Explosion crater") {
      return "#000000";
  } else if (entry['Type'] === "Fissure vent") {
      return "#662506";
  } else if (entry['Type'] === "Tuff cone") {
      return "#fff7bc";
  } else if (entry['Type'] === "Pyroclastic shield") {
      return "#cc4c02";
  } else if (entry['Type'] === "Compound") {
      return "#fe9929";
  } else if (entry['Type'] === "Crater rows") {
      return "#000000";
  } else if (entry['Type'] === "Cone") {
      return "#fff7bc";
  } else if (entry['Type'] === "Tuff ring") {
      return "#000000";
  } else if (entry['Type'] === "Subglacial") {
      return "#000000";
  } else {
      return "#41ab5d";
  }
};

var get_color_elevation = function(entry) {
    return entry['Elevation_meters'] > 5000  ? "#fff7bc" :
           entry['Elevation_meters'] > 2500  ? "#fee391" :
           entry['Elevation_meters'] > 1250  ? "#fec44f" :
           entry['Elevation_meters'] > 500   ? "#fe9929" :
           entry['Elevation_meters'] > 0     ? "#ec7014" :
           entry['Elevation_meters'] > -1000 ? "#cc4c02" :
                      "#993404";
};

var get_color_rock = function(entry) {
  if (entry['Dominant_rock_type'] === "Foidite") {
      return "#ffffff";
  } else if (entry['Dominant_rock_type'] === "Basalt / Picro-Basalt") {
      return "#ffffe5";
  } else if (entry['Dominant_rock_type'] === "Trachyte / Trachydacite") {
      return "#fff7bc";
  } else if (entry['Dominant_rock_type'] === "Phono-tephrite /  Tephri-phonolite") {
      return "#fee391";
  } else if (entry['Dominant_rock_type'] === "Phonolite") {
      return "#fec44f";
  } else if (entry['Dominant_rock_type'] === "Trachyandesite / Basaltic Trachyandesite") {
      return "#fe9929";
  } else if (entry['Dominant_rock_type'] === "Rhyolite") {
      return "#ec7014";
  } else if (entry['Dominant_rock_type'] === "Trachybasalt / Tephrite Basanite") {
      return "#cc4c02";
  } else if (entry['Dominant_rock_type'] === "Dacite") {
      return "#993404";
  } else if (entry['Dominant_rock_type'] === "Andesite / Basaltic Andesite") {
      return "#662506";
  } else if (entry['Dominant_rock_type'] === "No_information") {
      return "#000000";
  } else {
      return "#000000";
  }
}

$( "#coloring" ).change(function() {
        $('#slider').hide();
        $('#Region').hide();
        map.removeLayer(region_map);
        map.removeLayer(basemap);
        map.removeLayer(timelinemap);
        map.removeLayer(colormap);
        colormap = L.featureGroup();
        coloring = $("#coloring option:selected").text();
        console.log(coloring);
        var get_color
        if (coloring == "Type") {
          var get_color = get_color_type;
          $('#legend_volcano_type').show();
          $('#legend_rock_type').hide();
          $('#legend_elevation').hide();
        } else if (coloring == "Rock_type") {
          var get_color = get_color_rock;
          $('#legend_volcano_type').hide();
          $('#legend_rock_type').show();
          $('#legend_elevation').hide();
        } else if (coloring == "Elevation") {
          var get_color = get_color_elevation;
          $('#legend_volcano_type').hide();
          $('#legend_rock_type').hide();
          $('#legend_elevation').show();
        }
        timeline_dat.forEach(function(entry) {
          var lat = entry['Latitude'];
          var lon = entry['Longitude'];
          var color = get_color(entry);
          L.circleMarker([lat, lon], {
            radius: 8,
            fillColor: color,
            color: "black",
            weight: 1,
            fillOpacity: .9}).bindPopup("Name: " + entry['Name'] + '</br>' + "Epoch: " + entry['Epoch'] + '</br>' + "Type: " + entry['Type'] + '</br>' + "Dominant rock type: " + entry['Dominant_rock_type'] + '</br>' + "Elevation(m): " + entry['Elevation_meters'] + '</br>' + "Year last eruption: " + entry['Year_last_eruption']).addTo(colormap);
        });
        map.addLayer(colormap);
        $('#reset').show();
        $('#page04').show();
        $('#page03').hide();
    });

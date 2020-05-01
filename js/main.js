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

// TERRAIN
// var Stamen_TonerLite = L.tileLayer('https://api.mapbox.com/styles/v1/leonardoharth/ck9onf1hi5udu1ioj8t46i51i/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGVvbmFyZG9oYXJ0aCIsImEiOiJjazh1bG8ydjkwY2tqM3RxczdnaHozNGpyIn0.fgSBf5Jyjs_Ym4a5-EKWnA', {
//   attribution: '<a href="https://www.mapbox.com/about/maps/">© Mapbox</a> <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a> <a href="https://apps.mapbox.com/feedback/">Improve this map</a>',
//   subdomains: 'abcd',
//   minZoom: 0,
//   maxZoom: 22,
//   ext: 'png'
// }).addTo(map);

// BLUE
var Stamen_TonerLite = L.tileLayer('https://api.mapbox.com/styles/v1/leonardoharth/ck9opvgrb199y1ip8zuosa8hv/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGVvbmFyZG9oYXJ0aCIsImEiOiJjazh1bG8ydjkwY2tqM3RxczdnaHozNGpyIn0.fgSBf5Jyjs_Ym4a5-EKWnA', {
  attribution: '<a href="https://www.mapbox.com/about/maps/">© Mapbox</a> <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a> <a href="https://apps.mapbox.com/feedback/">Improve this map</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 22,
  ext: 'png'
}).addTo(map);

/* =====================
Initial data import
===================== */

var download_data = $.ajax("https://gist.githubusercontent.com/leonardoharth/cdd2eb8c725abe247e9b688f3f5a8b93/raw/283940b810a249d01b2ec172e814bdea61793a19/volcano.json");

var parsed_dataset = [];
var basemap = L.featureGroup();
var uniqueRegions = [];

$('.slider').hide();
$('.coloring').hide();
$('#reset').hide();
$('#legend_volcano_type').hide();
$('#legend_rock_type').hide();
$('#legend_elevation').hide();

/* =====================
Add a base map for initial vizualization, create subregion list
===================== */

download_data.done(function(data) {
  parsed_dataset = JSON.parse(data);
  parsed_dataset.forEach(function(entry) {
    var lat = entry['Latitude'];
    var lon = entry['Longitude'];
    L.circleMarker([lat, lon], {
      radius: 6,
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
        console.log(region);
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
        $('.slider').show();
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
});

/* =====================
Create coloring options
===================== */

$('#coloring').append('<option value="Type">Type</option>');
$('#coloring').append('<option value="Elevation">Elevation</option>');
$('#coloring').append('<option value="Rock_type">Rock_type</option>');

var colormap = L.featureGroup();
var coloring;

var get_color_type = function(entry) {
  if (entry['Type'] === "Maar") {
      return "#fff7f3";
  } else if (entry['Type'] === "Lava dome") {
      return "#fde0dd";
  } else if (entry['Type'] === "Pyroclastic cone") {
      return "#fcc5c0";
  } else if (entry['Type'] === "Caldera") {
      return "#fa9fb5";
  } else if (entry['Type'] === "Stratovolcano") {
      return "#f768a1";
  } else if (entry['Type'] === "Complex") {
      return "#dd3497";
  } else if (entry['Type'] === "Submarine") {
      return "#ae017e";
  } else if (entry['Type'] === "Shield") {
      return "#7a0177";
  } else if (entry['Type'] === "Lava cone") {
      return "#49006a";
  } else if (entry['Type'] === "Volcanic field") {
      return "#000000";
  } else if (entry['Type'] === "Explosion crater") {
      return "#081d58";
  } else if (entry['Type'] === "Fissure vent") {
      return "#253494";
  } else if (entry['Type'] === "Tuff cone") {
      return "#225ea8";
  } else if (entry['Type'] === "Pyroclastic shield") {
      return "#1d91c0";
  } else if (entry['Type'] === "Compound") {
      return "#41b6c4";
  } else if (entry['Type'] === "Crater rows") {
      return "#7fcdbb";
  } else if (entry['Type'] === "Cone") {
      return "#c7e9b4";
  } else if (entry['Type'] === "Tuff ring") {
      return "#edf8b1";
  } else if (entry['Type'] === "Subglacial") {
      return "#ffffd9";
  } else {
      return "#41ab5d";
  }
};

var get_color_elevation = function(entry) {
    return entry['Elevation_meters'] > 5000  ? "#ffffb2" :
           entry['Elevation_meters'] > 2500  ? "#fed976" :
           entry['Elevation_meters'] > 1250  ? "#feb24c" :
           entry['Elevation_meters'] > 500   ? "#fd8d3c" :
           entry['Elevation_meters'] > 0     ? "#f03b20" :
           entry['Elevation_meters'] > -1000 ? "#bd0026" :
                      "#000000";
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
        $('.slider').hide();
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
    });

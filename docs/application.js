$(function(){
    var googleSheetJsonUrl = 'https://spreadsheets.google.com/feeds/list/1__t--zxgGBV4arofMVay2e9F0K1TzkbkuDLKeZw2iLY/od6/public/values?alt=json'

    var attributionHTML = 'Map data &copy; <a href="https://map.playatlas.com/">Grapeshot Games</a>, ';
    attributionHTML += 'Grid map overlay by &copy; <a href="https://game-maps.com/ATLAS/ATLAS-MMO-World-Map.asp">Game-Maps.com</a>';

    var officialMapLayer = L.tileLayer("tiles/{z}/{x}/{y}.png", {
        maxZoom: 6,
        minZoom: 1,
        attribution: attributionHTML,
        bounds: L.latLngBounds([0,0],[-256,256]),
        noWrap: true,
    });

    var gridMapLayer = L.imageOverlay('grid_map.png', [[6.5,-6.5], [-259,256.5]]);

    var map = L.map("map", {
        crs: L.CRS.Simple,
        layers: [officialMapLayer, gridMapLayer],
        maxZoom: 6,
        minZoom: 1
    }).setView([-128, 128], 2);

    L.control.layers({
        "Official Map Tiles": officialMapLayer
    }, {
        "Game-Maps.com Grid": gridMapLayer
    }).addTo(map);

    $.ajax({
        url: googleSheetJsonUrl
    }).done(function(data) {
        console.log('google json', data);
        data.feed.entry.forEach(function(entry){
            var marker = L.marker([entry['gsx$latitude']['$t'], entry['gsx$longitude']['$t']]);
            var markerPopupHtml = "<strong>Type: </strong>" + entry['gsx$group']['$t'];
            markerPopupHtml += "<br><strong>Name: </strong>" + entry['gsx$name']['$t'];
            if (entry['gsx$description']['$t'].length){
                markerPopupHtml += "<br><strong>Description: </strong>" + entry['gsx$description']['$t'];
            }
            marker.bindPopup(markerPopupHtml);
            marker.addTo(map)
        })
    });
});

// TODO
// https://github.com/CliffCloud/Leaflet.EasyButton
// https://github.com/lvoogdt/Leaflet.awesome-markers
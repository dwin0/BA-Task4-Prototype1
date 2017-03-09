window.onload = function () {

    for (var i = 1; i <= 4; i++) {
        document.getElementById('button' + i).addEventListener('click', function () {
            var changeLayer = geomap.getLayers().b[this.name -1];
            changeLayer.setVisible(! changeLayer.getVisible());
        });
    }

    //OpenStreetMap
    drawmap();

    document.getElementById('antennaJSON').addEventListener('click', getAllAntennas);
};

function createPopupText(elementId, name, antennaId) {
    return "<b id=" + elementId + " name='popuptext'>" + name + "<br>ID " + antennaId + "</b>";
}






// Create a GeoAdmin Map
var geomap = new ga.Map({

    // Define the div where the geomap is placed
    target: 'geomap',

    view: new ol.View({

        // Define the default resolution
        // 10 means that one pixel is 10m width and height
        // List of resolution of the WMTS layers:
        // 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1, 0.5, 0.25, 0.1
        resolution: 650,

        // Define a coordinate CH1903 (EPSG:21781) for the center of the view
        center: [660000, 190000]
    })
});

// Create a background layer
var layer1 = ga.layer.create('ch.swisstopo.pixelkarte-farbe');
geomap.addLayer(layer1);

// Create an overlay layer
var layer4 = ga.layer.create('ch.bakom.mobil-antennenstandorte-lte');
var layer3 = ga.layer.create('ch.bakom.mobil-antennenstandorte-umts');
var layer2 = ga.layer.create('ch.bakom.mobil-antennenstandorte-gsm');

geomap.addLayer(layer2);
geomap.addLayer(layer3);
geomap.addLayer(layer4);








//OpenStreetMap-JS
var map;
var layer_mapnik;
var layer_markers;

function drawmap() {

    OpenLayers.Lang.setCode('de');

    // Popup und Popuptext mit evtl. Grafik
    var myPopuptext="<b id='popup'>Antenne<br>ID 9466</b></b><p><img src=\"/images/antenne.png\" width=\"50\" height=\"100\"></p>";

    // Position und Zoomstufe der Karte
    var lon = 8.22876;
    var lat = 46.81886;
    var zoom = 7;

    map = new OpenLayers.Map('map', {
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.LayerSwitcher(),
            new OpenLayers.Control.PanZoomBar()],
        maxExtent:
            new OpenLayers.Bounds(-20037508.34,-20037508.34,
                20037508.34, 20037508.34),
        numZoomLevels: 18,
        maxResolution: 156543,
        units: 'meters'
    });

    layer_mapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
    layer_markers = new OpenLayers.Layer.Markers("Address", { projection: new OpenLayers.Projection("EPSG:4326"),
        visibility: true, displayInLayerSwitcher: false });

    map.addLayers([layer_mapnik, layer_markers]);
    jumpTo(lon, lat, zoom);

    // Position des Markers
    //addMarker(layer_markers, 0, 0, myPopuptext);

}
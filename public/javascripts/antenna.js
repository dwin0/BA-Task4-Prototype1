function getAllAntennas() {

    //TODO: 9466 get Number in an other way
    //TODO: Get all Antenna at once? Thousands of calls --> too expensive
    //TODO: Load texts onClick -> labels at Begin too expensive
    //TODO: Abspeichern in DB und nur check, ob sich etwas verändert hat? --> Server prüft in Abständen DB
    //TODO:      Benutzer lädt dann alles aus DB des Servers


    for(var i = 1; i <= 9466; i += 100) {
        getAntennas(i, i + 100);
    }
}


function getAntennas(from, to) {

    var ressourceString = '';

    for(var i = from; i < to; i++) {
        ressourceString += (i + ',');
    }
    ressourceString += to;

    var url = 'https://api3.geo.admin.ch/rest/services/api/MapServer/ch.bakom.mobil-antennenstandorte-lte/' + ressourceString;
    console.log(url);
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        var status = request.status;

        if(request.readyState == 4 && status == 200) {
            console.log(request.response);

            var allData = JSON.parse(request.responseText).features;
            console.log(allData);

            for (var i = 0; i < allData.length; i++) {

                var data = allData[i].feature;

                var id = data.id;
                var xCoordinate = data.geometry.x;
                var yCoordinate = data.geometry.y;
                var layer = data.layerName;

                console.log(swissToInternationalCoordinates(yCoordinate, xCoordinate));
                var coordinates = swissToInternationalCoordinates(yCoordinate, xCoordinate);
                addMarker(layer_markers, coordinates[0], coordinates[1], createPopupText(id, layer, id));
            }

            popupClear();
        }
    };

    request.open("GET", url);
    request.send();
}

function popupClear() {

    for(var i = 0; i < map.popups.length; i++)
    {
        map.popups[i].hide();
    }
}


function swissToInternationalCoordinates(x1, y1) {

    var x2 = (x1 - 200000) / 1000000;
    var y2 = (y1 - 600000) / 1000000;

    var lambda = 2.6779094
        + 4.728982 * y2
        + 0.791484 * y2 * x2
        + 0.1306   * y2 * x2 * x2
        - 0.0436     * y2 * y2 * y2;
    lambda *= 100/36;

    var phi = 16.9023892
        + 3.238272 * x2
        - 0.270978 * y2 * y2
        - 0.002528 * x2 * x2
        - 0.0447   * y2 * y2 * x2
        - 0.0140   * x2 * x2 * x2;

    phi *= 100/36;

    return [lambda, phi];
}



var map;
var markers = [];

$(document).ready(function(){

    setInterval(function(){
        fetchPortersAndUpdateMap();
    }, 5000);

});

function fetchPortersAndUpdateMap(){

    fetchPorters(function( porters ){

        var latLongNames = [];
        porters.forEach(function( porter ){
            latLongNames.push({ lat: porter.location[1], lng: porter.location[0], name: porter.name });
        });

        updateMap( latLongNames );
    });
}

function fetchPorters( cb ){
    $.ajax({
        url: '/api/user/near-porter',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify({}),       // TODO // Pass in time based expiring key
        success: function(response) {
            //console.log("resp: ", response);
            if( response.result ){

                if(cb && typeof cb == 'function')
                    cb( response.result );

            } else {
                console.log("Err: ", response.message);
            }
        }
    });
}

function updateMap( latLongNames ){

    if( map != null ){
        // Clear previous Markers
        markers.forEach(function( marker ){
            marker.setMap(null);
        });

        markers = [];
        latLongNames.forEach(function( latLongName ){
            markers.push( new google.maps.Marker({
                position: { lat: latLongName.lat, lng: latLongName.lng },
                map: map,
                title: latLongName.name
            }) );
        });
    }
}

function initMap(){

    map = new google.maps.Map(document.getElementById('nearByPortersMap'), {
        zoom: 12,
        center: { lat: 12.9558552, lng: 77.6096096 }
    });

    fetchPortersAndUpdateMap();
}
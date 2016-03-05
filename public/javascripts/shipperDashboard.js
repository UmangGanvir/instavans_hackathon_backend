function getTimeInSecs(clockStr){
    var secs = 0;
    if(clockStr){
        var hrMinArr = clockStr.split(":");
        secs += parseInt(hrMinArr[0])*3600;
        secs += parseInt(hrMinArr[1])*60;
    }
    return secs;
}

var requestTemplate;

$(document).ready(function(){

    //$('#create_request_modal').modal('show');

    requestTemplate = Handlebars.compile( $('#request_container_hbs').html().replace(/[\u200B]/g, '') );
    $('#creator').on('change', function(){
        creator = this.value;
        $.ajax({
            url: '/api/porter-request/shipper',
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify({
                userId: this.value
            }),
            success: function(response) {
                //console.log("resp: ", response);
                if( response.status == "success" ){

                    $('.request-container').remove();
                    var requests = response.result;
                    requests.forEach(function( request ){
                        request.arrivalTimeString =
                            (new Date(request.arrivalTimestamp)).toLocaleTimeString() + " - " +
                            (new Date(request.arrivalTimestamp)).toDateString();
                        $('#requests_container').append( requestTemplate(request) );
                    });

                } else {
                    console.log("Err: ", response.message);
                }
            }
        });
    });

    $('.clockpicker').clockpicker();

    $('#arrivalDay').datepicker({
        altFormat: '@',
        dateFormat: "dd-mm-yy"
    });

    var locations = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=%QUERY&key=AIzaSyCvICOcevpbkslR9j3gvnF0f7CBCDD-cCs',
            wildcard: '%QUERY',
            filter: function(resp){
                //console.log("resp: ", resp);
                return resp.results;
            }
        }
    });

    locations.initialize();

    $('#location_select_input').typeahead({
        hint: true,
        highlight: true,
        minLength: 2
    }, {
        name: 'locations',
        displayKey: function( location ){
            return location.formatted_address;
        },
        source: locations
    });

    var lat = null;
    var long = null;
    var locationText = null;

    $('#location_select_input').on('typeahead:selected', function(evt, item) {

        //console.log("evt: ", evt);
        //console.log("item: ", item);
        lat = item.geometry.location.lat;
        long = item.geometry.location.lng;
        locationText = item.formatted_address;
    });

    $('#user_select_email').css('vertical-align','middle');

    $('#createRequestBtn').click(function(){

        var arrivalDay = parseDate( $('#arrivalDay').val() );
        if( arrivalDay === "invalid date string" )
            arrivalDay = null;

        var arrivalSeconds = getTimeInSecs( $('#arrivalDaySeconds').val() );

        var amountOffered = $('#amountOffered').val();
        var portersRequired = $('#portersRequired').val();


        if( !arrivalDay ){
            raiseError("No arrival day mentioned");
            return;
        }

        if( isNaN( parseInt( amountOffered ) ) ){
            raiseError("No offered amount mentioned");
            return;
        }

        if( creator == "0" ){
            raiseError("No shipper selected for transaction");
            return;
        }

        if( !lat || !long ){
            raiseError("No location selected. ( Lat, Long not received )");
            return;
        }

        if( !locationText || locationText.length == 0 ){
            raiseError("No location selected. ( Location text not received )");
            return;
        }

        if( isNaN( parseInt( portersRequired ) ) ){
            raiseError("Number of porters is not mentioned");
            return;
        }

        var arrivalTime = arrivalDay;
        arrivalTime.setSeconds( arrivalSeconds );

        var arrivalTimestamp = arrivalTime.getTime();

        $.ajax({
            url: '/api/porter-request',
            type: 'PUT',
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify({
                arrivalTimestamp: arrivalTimestamp,
                amountOffered: parseInt( amountOffered ),
                creator: creator,
                lat: lat,
                long: long,
                locationText: locationText,
                portersRequired: parseInt( portersRequired )
            }),
            success: function(response) {
                //console.log("resp: ", response);
                if( response.result ){
                    raiseSuccess(function(){
                        $('#create_request_modal').modal('hide');

                        // clear form data
                        $('#arrivalDay').val('');
                        $('#arrivalDaySeconds').val('');
                        $('#amountOffered').val('');
                        $('#portersRequired').val('');
                        $('#location_select_input').val('');
                    });
                } else {
                    raiseError( response.message );
                }
            }
        });
    });


});

function raiseError( msg ){
    $('#create_request_response').text(msg).css({ color: 'red'}).removeClass('hide');
    setTimeout(function(){
        $('#create_request_response').addClass('hide');
    }, 3000);
}

function raiseSuccess( cb ){
    $('#create_request_response').text("Successfully created the request!").css({ color: 'green'}).removeClass('hide');
    setTimeout(function(){
        $('#create_request_response').addClass('hide');
        if(cb && typeof cb == 'function')
            cb();
    }, 3000);
}

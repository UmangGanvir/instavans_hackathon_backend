var locationVal, location_latitude, location_longitude, portersVal, portersWage, Time, creatorId;
$(document).ready(function(){
    $('.submit-button').click(function(){

        creatorId = $('#creatorId').val();
        locationVal = $('.locationVal').val();
        portersVal = $('.portersVal').val();
        portersWage = $('.timeVal').val();
        wageVal = $('.wageVal').val();
        locationVal = locationVal.replace(' ', '+');
        locationVal = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + locationVal + '&key=AIzaSyCvICOcevpbkslR9j3gvnF0f7CBCDD-cCs'

        $.get(locationVal, function(res, status){
            console.log("res: ", res);
            console.log("status: ", status);
            location_latitude = res.results[0].geometry.location.lat;
            location_longitude = res.results[0].geometry.location.lng;
            console.log([location, portersVal, portersWage, wageVal]);

            $.ajax({
                url: '/api/porter-request',
                type: 'PUT',
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify({
                    reachTimestamp: portersWage,
                    amountOffered: wageVal,
                    creator: creatorId,
                    lat: location_latitude,
                    long: location_longitude,
                    portersRequired: portersVal
                }),
                success: function(response) {
                    console.log("resp: ", response);
                }
            });
        });
    });
});

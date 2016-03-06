var express = require('express');
var router = express.Router();
var Utils = require('../utils');

var UserModel = require('../models/user');

router.post('/', function( req, res, next ){

  var params = Utils.retrieveRequestParams( req );
  console.log("Retrieve users params: ", params);

  var name  = params.post.name;
  if( !name || name.length == 0 ){
    Utils.apiResponse( res, false, "No name mentioned", 400 );
    return;
  }

  UserModel.readUserCRUDbyName( { name: name }, function( err, doc ){

    if( err ){
      Utils.apiResponse( res, false, "Error retrieving this user", 500 );
      return;
    }

    Utils.apiResponse( res, true, doc, 200 );

  });

});

router.post('/update/location', function( req, res, next){

    var params = Utils.retrieveRequestParams( req );
    console.log("Update porter location: ", params);

    var lat = params.post.lat;
    var long = params.post.long;
    var userId = params.post.userId;

    UserModel.updatePorterLocation({
        lat: lat,
        long: long,
        userId: userId
    }, function( err, docs ){

        if( err ){
            console.log("err: ", err);
            Utils.apiResponse( res, false, "Error retrieving near by porters", 500 );
            return;
        }

        Utils.apiResponse( res, true, docs, 200 );

    });
});

router.post('/near-porter', function( req, res, next ){

    var params = Utils.retrieveRequestParams( req );
    console.log("Retrieve nearby porters params: ", params);

    UserModel.fetchNearByPorters({}, function( err, docs ){

        if( err ){
            console.log("err: ", err);
            Utils.apiResponse( res, false, "Error retrieving near by porters", 500 );
            return;
        }

        Utils.apiResponse( res, true, docs, 200 );

    });

});

module.exports = router;

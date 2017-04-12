var express = require('express');
var router = express.Router();
var Utils = require('../utils');

var UserModel = require('../models/user');
var PorterRequestModel = require('../models/porter_request');

router.post('/', function( req, res, next ){

  var params = Utils.retrieveRequestParams( req );
  console.log("Retrieve users params: ", params);

  var userId  = params.post.userId;
  if( !userId || userId.length == 0 ){
    Utils.apiResponse( res, false, "No userId mentioned", 400 );
    return;
  }

  UserModel.readUserCRUDbyId( { userId: userId }, function( err, doc ){

    if( err ){
      Utils.apiResponse( res, false, "Error retrieving this user", 500 );
      return;
    }

//      if(!doc){
//
//      }else{

        Utils.apiResponse( res, true, doc, 200 );
//      }


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

router.post('/mydata', function( req, res, next ){

    var params = Utils.retrieveRequestParams( req );
    var userId = params.post.userId;
    console.log("Retrieve nearby porters params: ", params);

    UserModel.readUserCRUDbyId({userId : userId}, function( err, doc ){

        if( err ){
            console.log("err: ", err);
            Utils.apiResponse( res, false, "Error retrieving user by Id", 500 );
            return;
        }
        if(!doc){
            Utils.apiResponse( res, false, "User does not exists", 400 );
            return;
        }



        PorterRequestModel.fetchPorterFulfilledRequestsForPorter( {
            userId: userId
        }, function( err, docs ){

            if( err ){
                console.log("Err: ", err);
                Utils.apiResponse( res, false, "Error retrieving fulfilled requests for porter", 500 );
                return;
            }
//            console.log("RETURN",docs);
            var score = 0;
            docs.forEach(function(doc2){
                score+=doc2.amountOffered;
            });

            Utils.apiResponse( res, true, {
                score : score,
                name : doc.name
            }, 200 );

        });




    });

});

router.get('/test', function( req, res, next ){

    Utils.apiResponse( res, true, {
        score : 100,
        name : "name"
    }, 200 );
});


module.exports = router;

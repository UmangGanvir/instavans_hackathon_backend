var express = require('express');
var router = express.Router();
var Utils = require('../utils');
var socketClient = require('../clients/socketClient.js');

var PorterRequestModel = require('../models/porter_request');

router.post('/shipper', function( req, res, next ){

  var params = Utils.retrieveRequestParams( req );
  console.log("Retrieve porter requests for porter params: ", params);

  var userId  = params.post.userId;

  PorterRequestModel.fetchPorterRequestsForShipper({
    userId: userId
  }, function( err, docs ){

    if( err ){
      console.log("err: ", err);
      Utils.apiResponse( res, false, "Error retrieving requests for shipper", 500 );
      return;
    }

    console.log("docs: ", docs);
    Utils.apiResponse( res, true, docs, 200 );

  });

});

router.post('/porter', function( req, res, next ){

  var params = Utils.retrieveRequestParams( req );
  console.log("Retrieve porter requests for porter params: ", params);

  var lat  = params.post.lat;
  var long  = params.post.long;
  var radius  = params.post.radius;

  PorterRequestModel.fetchPorterRequestsForPorter({
    lat: lat,
    long: long,
    radius: radius
  }, function( err, docs ){

    if( err ){
      Utils.apiResponse( res, false, "Error retrieving this requests for porters", 500 );
      return;
    }

      console.log("RESULT",docs);
    Utils.apiResponse( res, true, docs, 200 );

  });

});

router.post('/porter/finished', function( req, res, next ){

  var params = Utils.retrieveRequestParams( req );
  console.log("Retrieve porter fulfilled requests params: ", params);

  var userId = params.post.userId;

  PorterRequestModel.fetchPorterRequestsForPorter( {
    lat: lat,
    long: long,
    radius: radius
  }, function( err, docs ){

    if( err ){
      Utils.apiResponse( res, false, "Error retrieving this requests for porters", 500 );
      return;
    }

    Utils.apiResponse( res, true, docs, 200 );

  });

});

router.post('/porter/accept', function( req, res, next ){

  var params = Utils.retrieveRequestParams( req );
  console.log("Retrieve porter fulfilled requests params: ", params);

  var userId = params.post.userId;
  var jobId = params.post.jobId;

  PorterRequestModel.AcceptRequestFromPorter( {
    userId: userId,
    jobId: jobId
  }, function( err, updateAck ){

    if( err ){
      Utils.apiResponse( res, false, "Error accepting this request for porter", 500 );
      return;
    }

    var docModified = updateAck.nModified;
    if( !isNaN( parseInt( docModified ) ) ){
      docModified = parseInt( docModified );
      if( docModified > 0 ){
        if( socketClient.requestNamespace ){
          socket.requestNamespace.emit('requestAccept', { jobId: jobId });
        }
        Utils.apiResponse( res, true, { requestAccepted: true }, 200 );
        return;
      }
    }

    Utils.apiResponse( res, true, { requestAccepted: false }, 200 );

  });

});

router.put('/', function( req, res, next ){

  var params = Utils.retrieveRequestParams( req );
  console.log("Add porter Request params: ", params);

  var arrivalTimestamp = params.post.arrivalTimestamp;
  var amountOffered = params.post.amountOffered;
  var creator = params.post.creator;
  var lat = params.post.lat;
  var long = params.post.long;
  var locationText = params.post.locationText;
  var portersRequired = params.post.portersRequired;

  // TODO check if shipper created this request

  PorterRequestModel.createPorterRequestCRUD({
    arrivalTimestamp: arrivalTimestamp,
    amountOffered: amountOffered,
    creator: creator,
    lat: lat,
    long: long,
    locationText: locationText,
    portersRequired: portersRequired
  }, function( err, doc ){

    if( err ){
      console.log("err: ", err);
      Utils.apiResponse( res, false, "Error creating this request for shipper", 500 );
      return;
    }

    if( socketClient.requestNamespace ){
      socketClient.requestNamespace.emit('requestCreate', doc);
    }

    Utils.apiResponse( res, true, doc, 200 );

  });

});

module.exports = router;

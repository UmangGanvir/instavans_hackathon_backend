var express = require('express');
var router = express.Router();
var Utils = require('../utils');

var UserModel = require('../models/user');
/* Model ( Handling ) */

// Kid
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

module.exports = router;

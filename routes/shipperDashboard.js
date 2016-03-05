var express = require('express');
var router = express.Router();
var Utils = require('../utils');

router.get('/', function( req, res, next ){

  var params = Utils.retrieveRequestParams( req );
  console.log("Home router for shipper dashboard params: ", params);

  res.render('shipperDashBoard', {
    stylesheets : [
        "/stylesheets/utils/bootstrap-clockpicker.min.css",
        "https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css",
        "/stylesheets/utils/typeahead.css",
        "/stylesheets/shipperDashboard.css"
        //"https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.css"
    ],
    javascripts: [
        //"https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js",
        "/javascripts/utils/bootstrap-clockpicker.min.js",
        "https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js",
        "/javascripts/utils/bloodhound.min.js",
        "/javascripts/utils/typeahead.jquery.js",
        "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.3/handlebars.min.js",
        "/javascripts/shipperDashboard.js"
    ]
  });

});

module.exports = router;

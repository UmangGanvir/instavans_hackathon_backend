// Routes ( all product based routes )
var path = require('path');
var config = require('config');
var Utils = require('../utils/index');
var htmlDirOptions = { root: path.join(__dirname, '../public/html') };

var user = require('./user.js');
var audio = require('./audio.js');
var porterRequest = require('./porterRequest.js');
var shipperDashboard = require('./shipperDashboard.js');

var allRoutes = function(app){

  // APIs ( prepended with api )
  app.use( '/sfdata', audio );
  app.use( '/api/porter-request', porterRequest );

  // Services

  // Web server
  app.use( '/web/shipper-dashboard', shipperDashboard );

};

module.exports = allRoutes;
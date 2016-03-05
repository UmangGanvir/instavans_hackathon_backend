// Routes ( all product based routes )
var path = require('path');
var config = require('config');
var Utils = require('../utils/index');
var htmlDirOptions = { root: path.join(__dirname, '../public/html') };

var user = require('./user.js');
var porterRequest = require('./porterRequest.js');

var allRoutes = function(app){

  // APIs ( prepended with api )
  app.use( '/api/user', user );
  app.use( '/api/porter-request', porterRequest );

  // Services

  // Web server
  app.get('/abc.html', function (req, res) {
    res.sendFile('abc.html', htmlDirOptions);
  });
};

module.exports = allRoutes;
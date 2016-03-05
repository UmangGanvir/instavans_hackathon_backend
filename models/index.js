var config = require('config');
var mongoose = require('mongoose');
var mongodbConfig = config.mongodbConfig;

var mainDBUrl = 'mongodb://' + mongodbConfig.host + '/' + mongodbConfig.database;
var mainDBOptions = {
    user: mongodbConfig.username,
    pass: mongodbConfig.password
};

console.log( 'Connecting to DataBase: ', mainDBUrl, mainDBOptions );

var connection = mongoose.createConnection( mainDBUrl, mainDBOptions, function( err ){
    if( err )
        console.error( "MONGO  Main DB ERROR:", err );
});

module.exports = connection;
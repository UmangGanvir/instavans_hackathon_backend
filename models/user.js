var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mainDB = require('./index.js');

var User = new Schema({
    userId: { type: String, required: true },
    name: { type: String },
    userType: {
        type: String,
        enum: [ 'porter', 'shipper'],
        index: true,
        required: true
    },
    location : {
        type: [Number],
        index: { type: '2dsphere' },
        required: true
    }, // longitude, latitude
    locationUpdateTime: { type: Date }
});

User.statics.readUserCRUDbyName = function( params, cb ){

    var name = params.name;
    if( !name || name.length == 0 ){
        cb( "Invalid Name" );
        return;
    }

    name = name.toLowerCase();
    this.findOne({ name : name }).lean().exec(cb);
};
User.statics.createUserCRUDbyName = function( params, cb ){

    var name = params.name;
    if( !name || name.length == 0 ){
        cb( "Invalid Name" );
        return;
    }

    name = name.toLowerCase();
    this.findOne({ name : name }).lean().exec(cb);
};
User.statics.readUserCRUDbyId = function( params, cb ){

    var userId = params.userId;
    if( !userId || userId.length == 0 ){
        cb( "Invalid userId" );
        return;
    }

    this.findOne({ userId : userId }).lean().exec(cb);
};

User.statics.fetchNearByPorters = function( params, cb ){

    //console.log("fetchNearByPorters params: ", params);

    var lat = 12.9558552;       // Bangalore Custom Lat
    var long = 77.6096096;      // Bangalore Custom Lng
    var radius = 30000;         // In metres

    // Validity checks
    if( !lat || isNaN( parseInt( lat ) ) ){
        cb( "Invalid latitude value" );
        return;
    }
    lat = Number( lat );

    if( !long || isNaN( parseInt( long ) ) ){
        cb( "Invalid Longitude value" );
        return;
    }
    long = Number( long );

    radius = !isNaN( parseInt( radius ) ) ? parseInt( radius ) : 10000 ; // in Meters

    var date = new Date();
    var dateWindow = new Date();
    dateWindow.setHours( date.getHours() - 2 );     // 2 hour window

    this.aggregate([
        {
            $geoNear: {
                near: { type: "Point", coordinates: [ long, lat ] },
                distanceField: "distance",
                maxDistance: radius,
                spherical: true
            }
        },
        {
            $match: {
                'locationUpdateTime' : { $gt: dateWindow, $lte: date }
            }
        }
    ]).exec(cb);
};

User.statics.updatePorterLocation = function( params, cb ){

    //console.log("updatePorterLocation params: ", params);

    var lat = params.lat;
    var long = params.long;
    var userId = params.userId;

    // Validity checks
    if( !lat || isNaN( parseInt( lat ) ) ){
        cb( "Invalid latitude value" );
        return;
    }
    lat = Number( lat );

    if( !long || isNaN( parseInt( long ) ) ){
        cb( "Invalid Longitude value" );
        return;
    }
    long = Number( long );

    if( !userId || userId.length == 0 ){
        cb( "Invalid userId passed" );
        return;
    }

    this.update({ userId: userId },{
        $set: {
            location: [ long, lat ],
            locationUpdateTime: new Date()
        }
    }).lean().exec(cb);
};

var UserModel = mainDB.model( 'User', User );

//console.log("UserModel: ", UserModel);


module.exports = UserModel;
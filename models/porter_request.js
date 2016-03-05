var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mainDB = require('./index.js');
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize( mainDB );

var PorterRequest = new Schema({
    //jobId: { type: Number, required: true },      // auto increment handles this
    reachTime: { type: Date, required: true },
    amountOffered: { type: Number, required: true },
    location : {
        type: [Number],
        index: { type: '2dsphere' },
        required: true
    }, // longitude, latitude
    portersRequired: { type: Number, required: true },
    portersFulfilled: { type: [String], default: [], required: [] }         // Porter User Ids
});

PorterRequest.statics.createPorterRequestCRUD = function( params, cb ){

    var reachTimestamp = params.reachTimestamp;
    var amountOffered = params.amountOffered;
    var lat = params.lat;
    var long = params.long;
    var portersRequired = params.portersRequired;
    // Default portersFulfilled

    // Validity checks
    if( isNaN( parseInt( reachTimestamp ) ) ){
        cb( "Invalid timestamp for reach time" );
        return;
    }
    var reachTime = new Date( reachTimestamp );

    if( !lat || isNaN( parseInt( lat ) ) ){
        cb( "Invalid latitude value" );
        return;
    }
    lat = parseInt( lat );

    if( !long || isNaN( parseInt( long ) ) ){
        cb( "Invalid Longitude value" );
        return;
    }
    long = parseInt( long );

    this.create({
        reachTime: reachTime,
        amountOffered: amountOffered,
        location : [ long, lat ], // longitude, latitude
        portersRequired: portersRequired
    }, cb);
};

PorterRequest.statics.fetchPorterRequestsForPorter = function( params, cb ){

    var lat = params.lat;
    var long = params.long;
    var radius = params.radius;

    // Validity checks
    if( !lat || isNaN( parseInt( lat ) ) ){
        cb( "Invalid latitude value" );
        return;
    }
    lat = parseInt( lat );

    if( !long || isNaN( parseInt( long ) ) ){
        cb( "Invalid Longitude value" );
        return;
    }
    long = parseInt( long );

    radius = !isNaN( parseInt( radius ) ) ? parseInt( radius ) : 10000 ; // in Meters

    this.aggregate([
        { $match: {
            'portersRequired': { $gt : 0} },
            'reachTime' : { $lt: new Date() }
        },
        {
            $geoNear: {
                near: { type: "Point", coordinates: [ long, lat ] },
                distanceField: "distance",
                maxDistance: radius,
                spherical: true
            }
        }
    ]).exec(cb);
};

PorterRequest.statics.fetchPorterFulfilledRequestsForPorter = function( params, cb ){

    var userId = params.userId;

    // Validity checks
    if( !userId || userId.length == 0 ){
        cb( "Invalid userId" );
        return;
    }

    this.find({ portersFulfilled: { $in: userId } }).lean().exec(cb);
};

PorterRequest.statics.AcceptRequestFromPorter = function( params, cb ){

    var userId = params.userId;
    var jobId = params.jobId;

    // Validity checks
    if( !userId || userId.length == 0 ){
        cb( "Invalid userId" );
        return;
    }

    if( !jobId || isNaN( parseInt( jobId ) ) ){
        cb( "No or invalid jobId supplied" );
        return;
    }

    // TODO
    // Check if user is porter

    this.update({ jobId: jobId, portersRequired: { $gt: 0 } },{
        $addToSet: {
            portersFulfilled: userId
        },
        $inc: { portersRequired: -1 }
    }).lean().exec(cb);
};

PorterRequest.plugin( autoIncrement.plugin, { model: 'Porter_Request', field: 'jobId' } );

var PorterRequestModel = mainDB.model( 'Porter_Request', PorterRequest );

module.exports = PorterRequestModel;
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
    }
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

//console.log("User: ", User);

var UserModel = mainDB.model( 'User', User );

//console.log("UserModel: ", UserModel);


module.exports = UserModel;
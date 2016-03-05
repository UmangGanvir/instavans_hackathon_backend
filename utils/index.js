var _ = require('underscore');

function Utils(){}

Utils.prototype.retrieveRequestParams = function( req ){

    var requestMethod = req.method.toLowerCase();
    var params = {};

    switch( requestMethod ){

        case 'get':
            params = _.extend( req.params, req.query );
            break;

        case 'post':
            params = _.extend( req.params, req.query );
            params.post = req.body;
            break;

        case 'put':
            params = _.extend( req.params, req.query );
            params.post = req.body;
            break;

        case 'delete':
            params = _.extend( req.params, req.query );
            params.post = req.body;
            break;
    }

    params.requestMethod = requestMethod;
    return params;
};

Utils.prototype.apiResponse = function( res, success, result, statusCode ){ //use this to reply to all API requests
    if( success ){
        res.send({
            status		:	'success',
            message	    :	null,
            result		:	result,
            statusCode  :   statusCode
        });
    } else {
        res.send({
            status		:	'error',
            message	    :	result,
            result		:	null,
            statusCode  :   statusCode
        });
    }
};

module.exports = new Utils();
var instance = {};
var app = "";
var httpServer = require('http').Server(app);
var io = require('socket.io')(httpServer,{path: '/socket.io','heartbeat interval':15, 'heartbeat timeout':40});
var requestNamespaceName = "request";

instance.requestNamespace = io.of( '/' + requestNamespaceName );

instance.requestNamespace.on('connection', function( socket ){
    console.log("Namespace: " + requestNamespaceName + " ---  Client-socket connected : ", socket.id);

    socket.on('disconnect', function () {
        console.log("Namespace: " + requestNamespaceName + " ---  Client-socket disconnected : ", socket.id);
    });

    socket.on('request', function( message ){
        // Broadcasting this event to browser clients and android
        socket.broadcast.emit('request', message);
    });
});

module.exports = instance;
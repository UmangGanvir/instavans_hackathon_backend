var requestNamespaceName = "request";

function SocketClient() {
    this.requestNamespace = null
}

SocketClient.prototype.initializeSocket = function( app ){

    var io  = require('socket.io');
    var server = io.listen(4000);
    server.sockets.on("connection",function(){
        //console.log("COLLNN");
    });

//
//    var httpServer = require('http').Server(app);
//    var io = require('socket.io')(httpServer,{path: '/socket.io','heartbeat interval':15, 'heartbeat timeout':40});
////    var io = require('socket.io')(httpServer);
//
//    io.on('connection', function(socket){
//        console.log('a user connected');
//    });


    this.requestNamespace = server.of( '/' + requestNamespaceName );

    this.requestNamespace.on('connection', function( socket ){
        console.log("Namespace: " + requestNamespaceName + " ---  Client-socket connected : ", socket.id);

        socket.on('disconnect', function () {
            console.log("Namespace: " + requestNamespaceName + " ---  Client-socket disconnected : ", socket.id);
        });

        //socket.on('request', function( message ){
        //    // Broadcasting this event to browser clients and android
        //    socket.broadcast.emit('request', message);
        //});
    });

};

module.exports = new SocketClient();
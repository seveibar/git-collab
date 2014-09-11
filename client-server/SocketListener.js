
var io = require('socket.io-client');

module.exports = {
    connect : function (port){
        port = port || 4444;

        // Connect to the socket controller/server
        var client = io.connect("http://localhost:" + port);
        var connectionID = null;

        // Listen for connection to server
        client.on('connect', function () {
            console.log("Connected to Server");
        });

        // Listen for server indication connectionID
        client.on('youare', function(data){
            console.log("Connected as Client["+data+"]");
            connectionID = parseInt(data);
        });

        // Listen for client disconnecting
        client.on("disconnect", function() {
            console.log("Disconnected");
        });


    }
};

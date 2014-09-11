module.exports = {

    // Starts the socket controller on the given port
    start : function start(port){

        var io = require("socket.io").listen(port || 4444);

        // Tracks all client
        var lastConnectionID = 0;

        // On Client Connection
        io.on('connection', function (socket) {

            // Give this socket it's unique connectionID
            var connectionID = lastConnectionID++;

            // Log client number
            console.log("Client[" + connectionID + "] Connected");

            // Tell the client what their connectionID is
            socket.emit("youare", connectionID);

            // Listen for the client if they want to know what their connection
            // ID is.
            socket.on("whoami", function(data){
                socket.emit("youare", connectionID);
            });

            // Listen for the client's disconnect
            socket.on('disconnect', function () {
                console.log("Client[" + connectionID + "] Disconnected");
            });

        });

        // Log anything the client wants to log
        io.on('log', function(data) {
            console.log(data);
        });

    }
};

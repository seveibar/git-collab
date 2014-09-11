var io = require("socket.io").listen(4444);

var lastConnectionID = 0;

io.on('connection', function (socket) {

    var connectionID = lastConnectionID++;

    console.log("Client[" + connectionID + "] Connected");
    socket.emit("youare", connectionID);

    socket.on("whoami", function(data){
        socket.emit("youare", connectionID);
    });
    socket.on('event', function(data) {
        console.log(data);
    });
    socket.on('disconnect', function () {
        console.log("Disconnection");
    });
});
io.on('event', function(data){
    console.log(data);
});

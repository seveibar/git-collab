var io = require('socket.io-client');

client = io.connect("http://localhost:4444");

var connectionID = null;

client.on('connect', function () {
    console.log("Connected to Server");
});

client.on('youare', function(data){
    console.log("Connected as Client["+data+"]");
    connectionID = parseInt(data);
});

client.on("disconnect", function(){
    console.log("Disconnected");
});

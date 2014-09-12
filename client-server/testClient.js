var client = require("./SocketListener.js");

client.connect(4444, function(){

    client.sendLogMessage("connected to server");

    client.joinSession(1);

});

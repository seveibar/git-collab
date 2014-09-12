var client = require("./SocketListener.js");

client.connect(4444, function(){

    client.sendLogMessage("connected to server");

    client.sendPublicMessage("hello everyone!");

    client.joinSession(1);

    setTimeout(function(){
        client.sendSessionMessage("Hello private session!");
    },1000);

});

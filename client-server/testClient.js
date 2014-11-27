var client = require("./SocketListener.js");

client.connect("http://localhost:4444", function(){

    client.sendLogMessage("connected to server");

    client.sendPublicMessage("hello everyone!");

    client.joinSession(1);

    setTimeout(function(){
        client.sendSessionMessage("Hello session!");
    },1000);

});

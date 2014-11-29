var client = require("./SocketListener.js");

client.connect("http://localhost:4444", function(){

    client.sendLogMessage("connected to server");

    client.sendPublicMessage("hello everyone!");

    var ses = Math.floor(Math.random() * 4);

    client.joinSession(ses);

    client.setSessionDescription(["cat", "dog", "kitty", "puppy"][ses]);

    client.getSessionsInfo(function(data){
        console.log(data);
    });

    setTimeout(function(){
        client.sendSessionMessage("Hello session!");
    },1000);

});

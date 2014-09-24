var controller = require("../client-server/SocketController.js");
var fileMonitor = require("../file-monitor/FileSystemWatch.js");
var patching = require("../patching/Patching.js");
var exec = require("exec");
var util = require("./util.js");

controller.start(4444);

// Setup the tmp folder
util.setup();

var client = require("../client-server/SocketListener.js");

client.connect(4444, function(){

    client.sendLogMessage("connected to server");

    client.sendPublicMessage("hello everyone!");

    client.joinSession(1);

    patching.createPatch("./tmp/a.txt");

    client.addSessionMessageListener(function(data, who){
        if (data.indexOf("patch") != -1){
            patching.applyPatch(
                "./tmp/a.txt",
                patching.deserializePatch(data.substr(5)));
        }
    });

    fileMonitor.watchFile("./tmp/a.txt", function(){
        var patch = patching.createPatch("./tmp/a.txt",1);
        if (patch)
            client.sendSessionMessage("patch " + patching.serializePatch(patch));
    });


}, "Client 1:");

var client2 = require("../client-server/SocketListener.js");

client2.connect(4444, function(){

    client2.sendLogMessage("connected to server");

    client2.sendPublicMessage("hello everyone!");

    client2.joinSession(1);

    patching.createPatch("./tmp/a2.txt");

    client.addSessionMessageListener(function(data, who){
        if (data.indexOf("patch") != -1){
            patching.applyPatch(
                "./tmp/a2.txt",
                patching.deserializePatch(data.substr(5)));
        }
    });

    fileMonitor.watchFile("./tmp/a2.txt", function(){
        var patch = patching.createPatch("./tmp/a2.txt",2);
        if (patch)
            client.sendSessionMessage("patch " + patching.serializePatch(patch));
    });

}, "Client 2:");

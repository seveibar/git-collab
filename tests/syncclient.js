var fileMonitor = require("../file-monitor/FileSystemWatch.js");
var patching = require("../patching/Patching.js");
var exec = require("exec");
var util = require("./util.js");

var syncFileName = process.argv[2];

var client = require("../client-server/SocketListener.js");

client.connect(4444, function(){

    client.sendLogMessage("connected to server");

    client.sendPublicMessage("hello everyone!");

    client.joinSession(1);

    patching.createPatch(syncFileName);

    client.addSessionMessageListener(function(data, who){
        if (data.indexOf("patch") != -1){
            patching.applyPatch(
                syncFileName,
                patching.deserializePatch(data.substr(5)));
        }
    });

    fileMonitor.watchFile(syncFileName, function(){
        var patch = patching.createPatch(syncFileName,1);
        if (patch)
            client.sendSessionMessage("patch " + patching.serializePatch(patch));
    });

}, "Client:");

// TICKER
var lastTick = (new Date()).getTime();
var ticker = lastTick % 1000;
setInterval(function(){
    var time = (new Date()).getTime();
    ticker += (time - lastTick);
    lastTick = time;
    if (ticker > 1000){
        ticker = ticker % 1000;
        // console.log("");
    }
},10);

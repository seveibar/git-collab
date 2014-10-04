var fileMonitor = require("../file-monitor/FileSystemWatch.js");
var patching = require("../patching/Patching.js");
var exec = require("exec");
var fs = require("fs");
var util = require("./util.js");

var syncFileNum = process.argv[2];
var switchTime = process.argv[3];
var randomFactor = process.argv.length == 5 ? process.argv[4] : 0;

var syncFileName = "tmp/stress/" + syncFileNum + ".txt";

// Setup the tmp folder
util.setup();

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

function switchWords(){
    var words = fs.readFileSync(syncFileName,'utf8').split(" ");
    var i1 = Math.floor(Math.random() * words.length);
    var i2 = Math.floor(Math.random() * words.length);
    var swap = words[i1];
    words[i1] = words[i2];
    words[i2] = swap;
    fs.writeFileSync(syncFileName,words.join(" "));
}

function repeatChangeFile(){
    switchWords();
    setTimeout(repeatChangeFile, switchTime + Math.random() * randomFactor - randomFactor/2);
}

setTimeout(repeatChangeFile, switchTime);

// TICKER
var lastTick = (new Date()).getTime();
var ticker = lastTick % 1000;
setInterval(function(){
    var time = (new Date()).getTime();
    ticker += (time - lastTick);
    lastTick = time;
    if (ticker > 1000){
        ticker = ticker % 1000;
        console.log("");
    }
},10);

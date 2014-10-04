var controller = require("../client-server/SocketController.js");
var fileMonitor = require("../file-monitor/FileSystemWatch.js");
var patching = require("../patching/Patching.js");
var exec = require("exec");
var util = require("./util.js");

controller.start(4444);

util.setup();

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

var fsw = require("../file-monitor/FileSystemWatch.js");

if (!process.argv[2]){
    console.log("Please give a file to watch");
    process.exit(1);
}

fsw.watchFile(process.argv[2], function(){
    console.log("CHANGE DETECTED");
});

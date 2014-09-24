var Inotify = require('inotify-plusplus'),
    inotify;

inotify = Inotify.create(true);

module.exports = {
    "watchFile" : function(filePath, callback){
        var directive = {
            close_write: function(){
                callback();
            }
        };
        inotify.watch(directive, filePath, {});
    }
    // TODO watchDirectory
};

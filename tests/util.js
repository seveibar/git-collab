var exec = require("exec");

module.exports = {
    "setup": function(){
        // Teardown previous if it exists
        module.exports.teardown();
        exec("cp -r assets tmp", function(){

        });
    },
    "teardown": function(){
        exec("rm -r tmp", function(){

        });
    }
};

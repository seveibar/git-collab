var exec = require("exec");

module.exports = {
    "setup": function(){
        // Teardown previous if it exists
        module.exports.teardown();
        exec("cp -r assets tmp", function(){
            exec("mkdir tmp/stress",function(){});
            for (var i =0;i<15;i++){
                exec("cp assets/stress.txt tmp/stress/"+i+".txt",function(){});
            }
        });
    },
    "teardown": function(){
        exec("rm -r tmp", function(){

        });
    }
};

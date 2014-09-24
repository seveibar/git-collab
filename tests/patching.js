/*
TEST SUITE: PATCHING

Currently only works on *nix systems b/c of shell calls.
*/

var exec = require("exec");
var fs = require('fs');

var patching = require("../patching/Patching.js");

// First let's copy over the assets
exec("cp -r assets tmp", function(err, stdout, stderr){
    if (err){
        console.log("Error copying test assets, make sure you're in the tests directory");
    }else{
        runTests();
    }
});

var currentTest;
function startTest(name){
    console.log("--------------------------------------");
    console.log(name);
    console.log("--------------------------------------");
    currentTest = name;
}
function endTest(){
}

function resetDir(complete){
    exec("rm -r tmp", function(){
        exec("cp -r assets tmp", complete);
    });
}

function runTests(){
    simplePatch();

    exec("rm -r tmp", function(){

    });
}

function simplePatch(){
    startTest("Simple Patch Test");

    endTest();
}

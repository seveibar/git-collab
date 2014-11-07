
var dmp = new diff_match_patch();
var ta;
var lastValue;
var lastPatch;
var waitForFull = false;


window.onload = function(){

    ta = document.getElementById("textarea");
    lastValue = ta.value = "Hello World!";

    connectToServer();
};

function connectToServer(){

    var port = 4444;
    var addr = "129.161.71.89";

    var clientID; // assigned by server

    gcollab.connect(addr,port);

    gcollab.addPublicMessageListener(function(data){
        if (data.type == "patch"){
            recvPatch(data.patch, data.check);
        }else if (data.type == "full-update"){
            console.log("Received full update");
            ta.value = data.content;
            lastValue = data.content;
            waitForFull = false;
        }
    });

    gcollab.addHostMessageListener(function(data){
        if (data.type == "request-update"){
            sendFullUpdate();
        }
    });

}

function sendPatch(){
    console.log("Sending");
    var patch = dmp.patch_make(lastValue, ta.value);
    var check = checksum(ta.value);
    lastValue = ta.value;
    gcollab.sendPublicMessage({
        "type" : "patch",
        "patch" : patch,
        "check" : checksum(ta.value)
    });
}

function recvPatch(patch, check){
    console.log("RECV", patch, lastPatch);
    if (patch != lastPatch){
        applyPatch(patch,check);
    }
}

function isFailure(results){
    // Any falsy values in results[1] means it was a failure
    var success = true;
    for (var i = 0;i < results[1].length;i++){
        success = success && results[1];
    }
    return !success;
}

function sendFullUpdate(){
    console.log("Sending Full Update", lastValue);
    gcollab.sendPublicMessage({
        "type":"full-update",
        "content": lastValue
    });
}

function sendFullRequest(){
    console.log("Asking for full update");
    gcollab.sendHostMessage({
        "type": "request-update"
    });
}

// TODO Return new caret position after last changes to current
function caretShift(last,current, oldCaret){
    return oldCaret;
}

function applyPatch(patch,check){
    console.log("Applying");

    if (waitForFull){
        return;
    }

    var results = dmp.patch_apply(patch, ta.value);

    if (isFailure(results)){
        console.error("LOCAL FAIL");
        results = dmp.patch_apply(patch, lastValue);
        if (isFailure(results)){
            console.error("PREV FAIL: NEED NEW VERSION");
            waitForFull = true;
            sendFullRequest();
            return;
        }
    }

    console.log(results[0], check);
    if (checksum(results[0]) != check){
        console.error("CHECKSUM FAIL");
        results = dmp.patch_apply(patch, lastValue);
        if (isFailure(results) || checksum(results[0]) != check){
            console.error("PREV FAIL: NEED NEW VERSION");
            waitForFull = true;
            sendFullRequest();
            return;
        }
    }

    // Everything worked perfectly

    // CARET RECOVERY
    // --------------
    // make a note of where the current caret is
    var caretInitial = ta.selectionStart;
    var caretFinal = caretShift(ta.value,results[0],caretInitial);
    // --------------
    ta.value = results[0];
    console.log("Patch applied");

    //setCaretToPos(ta, caretFinal); // set caret back

    lastPatch = patch;
    lastValue = ta.value;
    // TODO send checksum
}

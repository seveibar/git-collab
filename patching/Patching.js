
var diff_match_patch=require('googlediff');
var fs = require('fs');

var dmp = new diff_match_patch();

// {"/file/path":FileContent}
var contents = {};

// {"patch_id":Patch}
var patches = {};


// Patch object, this is serialized, then sent over the network to all the
// connected clients
function Patch(sender, time, data, parent){
    this.sender = sender;
    this.time = time;
    this.data = data;
    this.parent = parent;
    // TODO base 64 patch ids that are hashed
    this.id = sender + time;
}

// Priority determines ordering of patches, patches are first sorted by time
// then by the client with the lowest client id
Patch.prototype.hasPriority = function(otherPatch){
    if (this.time > otherPatch.time)
        return true;
    if (this.time == otherPatch.time && this.sender < otherPatch.sender)
        return true;
    return false;
};

// Serialize the patch into JSON
Patch.prototype.serialize = function(){
    return JSON.stringify({
        "sender": this.sender,
        "time": this.time,
        "data": this.data,
        "parent": this.parent,
        "id": this.id
    },null,4);
};

// path: String file system path
// revision: Patch last patch applied
function FileContent(path, revision){
    this.path = path;
    this.content = fs.readFileSync(path,"utf8");
    this.revision = revision;
}

// Patch the file with the given network patch
// If the patch is unsuccessful, return false otherwise true
FileContent.prototype.patch = function(patch){

    // First, determine whether or not this patch has priority over
    // the current patch
    if (this.revision.hasPriority(patch)){
        // We don't need to do anything, this patch is more recent
        // (discard the other patch)
        return true;
    }

    // Attempt to apply the patch
    var patchResults = dmp.patch_apply(patch.data, this.content);

    // Make sure the patch was applied correctly
    var errors = false;
    // Loop through the success results of each application
    for (var i = 0;i < patchResults[1].length;i++){
        errors &= patchResults[1][i];
    }

    if (errors){
        // TODO send "can't apply patch" message
        // TODO Revert until we find a common parent, then apply upward
        console.log("CAN'T APPLY PATCH OR HANDLE ERRORS (UNIMPLEMENTED)");

        // If we can't find common parents or sync up
        // return false;
    }

    // Patch was successful, now update the current revision
    this.revision = patch;
    this.content = patchResults[0];

    // Update the actual file system
    fs.writeFileSync(this.path, this.content);

    // TODO Send a hash
};

// Get the patch for the file changes and update the file content object
// returns a patch object
FileContent.prototype.update = function(clientID){

    // Get necessary patch parameters
    var time = (new Date()).getTime();
    var sender = clientID;
    var newContent = fs.readFileSync(this.path,"utf8");
    // TODO make a real hash id
    var id = time + sender;
    var parent = this.revision.id || 0;

    // Return null patch if there are no changes
    if (newContent == this.content)
        return null;

    // Generate patch data object
    var data = dmp.patch_make(this.content, newContent);

    // Create Patch object
    var patch = new Patch(sender, time, data, parent);

    // Update this file's contents
    this.revision = patch;
    this.content = newContent;

    return patch;
};

module.exports = {
    createPatch: function(filePath,clientID){
        if (contents[filePath]){
            return contents[filePath].update(clientID);
        }else{
            contents[filePath] = new FileContent(
                filePath,
                new Patch(0,0,0,0));
            return null;
        }
    },
    applyPatch: function(filePath, patch){
        if (contents[filePath]){
            return contents[filePath].patch(patch);
        }else{
            contents[filePath] = new new FileContent(
                filePath,
                new Patch(0,0,0,0));
            return contents[filePath].patch(patch);
        }
    },
    serializePatch: function(patch){
        return patch.serialize();
    },
    deserializePatch: function(patchJSON){
        patchJSON = JSON.parse(patchJSON);
        return new Patch(patchJSON.sender, patchJSON.time,
                         patchJSON.data, patchJSON.parent);
    }
};

/*
// TESTS
// using to FileContents to simulate a client
var ex = require("exec");
function seta(string){
    ex('echo "'+string+'" > ./tests/a.txt', function(){});
    ex("sleep .1;", function(){});
}
function setb(string){
    ex('echo "'+string+'" > ./tests/b.txt', function(){});
    ex("sleep .1;", function(){});
}
function print(){
    console.log(a.content);
    console.log(b.content);
    console.log("-------------");
}
seta("hello world");
setb("hello world");
var a = new FileContent("./tests/a.txt", new Patch(0,0,0,0));
var b = new FileContent("./tests/b.txt", new Patch(0,0,0,0));
print();
seta("helo world");
var p1 = a.update(0);
print();
b.patch(p1);
print();
*/

/*

FileContent

Content classes keep track of file changes.

This is used when doing file syncing WITHOUT synchronous editting.
So one client is editting a file and the other client would just
like to monitor or have the same file on their system.

*/

var diff_match_patch=require('googlediff');
var fs = require('fs');
var Patch = require("./Patch.js").Patch;

var dmp = new diff_match_patch();


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
    FileContent: FileContent
};

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
    if (this.time >= otherPatch.time)
        return true;
    if (this.time == otherPatch.time && this.sender <= otherPatch.sender)
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
    });
};

module.exports = {
    Patch : Patch
};


var Patch = require("./Patch.js").Patch;
var FileContent = require("./FileContent.js").FileContent;

// {"/file/path":FileContent}
var contents = {};

// {"patch_id":Patch}
var patches = {};

module.exports = {
    fileSystem: {
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
                contents[filePath] = new FileContent(
                    filePath,
                    new Patch(0,0,0,0));
                return contents[filePath].patch(patch);
            }
        }
    },
    editor: {
        createPatch: function(filePath,clientID,content){
            if (contents[filePath]){
                return contents[filePath].update(clientID);
            }else{
                contents[filePath] = new EditorContent(
                    filePath,
                    new Patch(0,0,0,0),
                    content);
                return null;
            }
        },
        applyPatch: function(filePath, patch){
            if (contents[filePath]){
                return contents[filePath].patch(patch);
            }else{
                contents[filePath] = new EditorContent(
                    filePath,
                    new Patch(0,0,0,0));
                return contents[filePath].patch(patch);
            }
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

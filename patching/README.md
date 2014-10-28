# Patching

Patching library retains the previous "master" version of file and patches the current file.

It can create and apply patches.

## API

### fileSystem.createPatch(filePath, clientID)

Returns a patch marked with the current client's clientID if the file has been changed.

### fileSystem.applyPatch(filePath, patch)

Applies patch to file on file system

### editor.createPatch(filePath, clientID)

Returns a patch marked with the current client's clientID if the file within the editor has been changed.

### editor.applyPatch(filePath, patch)

Applies patch to file within editor, this can propogate to the file system.

### serializePatch(patch)

Converts patch to JSON object

### deserializePatch(patchJSON)

Converts json to patch object

## Objects

### Patch
Contains the following properties
* sender = Client that sent the patch
* time = Time patch was created
* data = Diff-Match-Patch data i.e. how to patch the content
* parent = The parent patch ID
* id = The patch ID

### File Content
Stores file content for a client syncing a filesystem
* path = Path to file
* content = Current file content
* revision = last patch applied

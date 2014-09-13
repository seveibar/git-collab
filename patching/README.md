# Patching

Patching library retains the previous "master" version of file and patches the current file.

It can create and apply patches.

## API

### trackFile(filePath)

Mark file to be tracked for patching and store base "master" state

### markChanges() => patchData

Return file changes as patch and mark this patch as patch appending approval

### patchApproved()

Set base state to last markChanges state

### patchFile(patchData)

Updates file with patch and set base state to patched file

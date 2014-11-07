# Client-Server

Each client on the git collab network is capable of hosting or joining a server. There is always exactly one host for all git collab sessions. If the client who is currently hosting leaves, another client will step up to be the host.

# SocketController

The SocketController is the server that clients connect to.

## Example Code

This code will start a git-collab server instance on localhost:4444.

```javascript
var controller = require("path/to/SocketController.js");

controller.start(4444);
```

## Public Methods

Start a server on a port

```javascript
start(port)
```

# SocketListener

A client wrapper for clients that support NodeJS.

## Example Code

## Public Methods

Connect to a local server at the specified port. `logHeader` is text that will be written before every console message (this is to distinguish multiple clients running on the same terminal)

```javascript
connect(port, [connectionCallback], [logHeader])
```

Join the session with the given `session_id`, if the session does not exist, it will be created and the only client will be the newly connected client.
```javascript
joinSession(session_id)
```

### Sending Messages

Send a message to everyone on the server.

```javascript
sendPublicMessage(message)
```

Send a message to everyone in the session.
```javascript
sendSessionMessage(message)
```

Send a message for the server to log.
```javascript
sendLogMessage(message)
```

## Receiving Messages

Add callbacks to receive different types of messages.

```javascript
addPrivateMessageListener(callback)
addPublicMessageListener(callback)
addSessionMessageListener(callback)
```

Remove callbacks.

```javascript
removePrivateMessageListener(callback)
removePublicMessageListener(callback)
removeSessionMessageListener(callback)
```

## Misc

Set the log header to the desired string

```javascript
setLogHeader(headerString)
```

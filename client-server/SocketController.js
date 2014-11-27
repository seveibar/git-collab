
// Relates sessionIDs to a list of all sockets currently in session
var sessionMembers = {
    0:[]
};

// Remove client from previous session
function removeFromSession(clientSocket, sessionID){
    for (var i = 0;i < sessionMembers[sessionID].length; i++){
        if (sessionMembers[sessionID][i] == clientSocket){
            sessionMembers[sessionID].splice(i,1);
            return true;
        }
    }
    return false;
}

// Get the session host
function getSessionHost(sessionID){
    var lowest = sessionMembers[sessionID][0];
    for (var i = 0;i < sessionMembers[sessionID].length; i++){
        if (sessionMembers[sessionID][i].connectionID < lowest.connectionID){
            lowest = sessionMembers[sessionID][i];
        }
    }
    return lowest;
}

module.exports = {

    // Starts the socket controller on the given port
    start : function start(port){

        console.log("Starting Git-Collab Server on http://localhost:" + port);

        var io = require("socket.io").listen(port || 4444);

        // Tracks all client
        var lastConnectionID = 0;

        // On Client Connection
        io.on('connection', function (socket) {

            // Give this socket it's unique connectionID
            var connectionID = socket.connectionID = lastConnectionID++;

            // Current session client is in
            var sessionID = 0;

            // Add client to default session
            sessionMembers[sessionID].push(socket);

            // Log client number
            console.log("Client[" + connectionID + "] Connected");

            // Tell the client what their connectionID is
            socket.emit("youare", connectionID);

            // Listen for the client if they want to know what their connection
            // ID is.
            socket.on("whoami", function(data){
                socket.emit("youare", connectionID);
            });

            // Listen for all public messages
            socket.on("public", function(data){
                console.log("public["+connectionID+"]>", data);
                socket.broadcast.emit("public", data);
            });

            // Listen for all messages to be directed to the host
            socket.on("host", function(data){
                console.log("host["+connectionID+"]", data);
                console.log(sessionMembers[sessionID].length);
                console.log(getSessionHost(sessionID).connectionID);
                getSessionHost(sessionID).emit("host", data);
            });

            // Listen for all private client messages
            socket.on("private", function(data){
                console.log("private["+connectionID+"]>", data);
                console.log("TODO implement private");
            });

            // Listen for client change session message
            socket.on("change session" , function(data){
                console.log("change_session["+connectionID+"]>", data);

                // Remove client from previous session
                removeFromSession(socket, sessionID);

                // Add client to new session
                sessionID = parseInt(data);

                // Create session member list if it doesn't already exist
                if (!sessionMembers[sessionID])
                    sessionMembers[sessionID] = [];

                // Add client to new session
                sessionMembers[sessionID].push(socket);

            });

            // Listen for client session messages
            socket.on("session", function(data){
                console.log("session["+connectionID+"]->s["+sessionID+"]>",data);

                // Send message to all people in session
                for (var i = 0;i < sessionMembers[sessionID].length;i++){
                    sessionMembers[sessionID][i].emit("session", data);
                }
            });

            // Log anything the client wants to log
            socket.on('log', function(data) {
                console.log("log["+connectionID+"]>",data);
            });

            // Listen for the client's disconnect
            socket.on('disconnect', function () {
                console.log("Client[" + connectionID + "] Disconnected");

                // Remove client from current session
                console.log(removeFromSession(socket, sessionID));
            });

        });

    }
};

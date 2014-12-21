
var io = require('socket.io-client');

// Listeners for various events, each event has a list of function callbacks
// that will be called when the event occurs
var listeners = {
    // Each function takes (data, who)
    onPrivateMessage : [],
    // Each function takes (data, who)
    onPublicMessage  : [],
    // Each function takes (data, who)
    onSessionMessage : []
};

// Session ID of session client is currently in
var sessionID = 0;

function callAllListeners(listenerList, data){
    for (var i = 0;i < listenerList.length; i++){
        listenerList[i](data);
    }
}

var client, connectionID;

// Consolidate session specific variables into a class that can be cleared
var sessionData;

var onJoinSession;

module.exports = {

    // Call to connect to server at url
    connect : function (url, connectionCallback, logHeader){

        console.log("Attempting to connect to Git-Collab server at " + url);

        // Every log message is prefaced with this
        // (for multiple clients on a single cpu)
        logHeader = logHeader || "";

        // Connect to the socket controller/server
        client = io.connect(url);
        connectionID = null;

        // Listen for connection to server
        client.on('connect', function () {
            console.log("Connected to Server");
            client.emit("session info");
            onJoinSession = connectionCallback;
        });

        // Listen for server indication connectionID
        client.on('youare', function(data){
            console.log(logHeader, "Connected as Client["+data+"]");

            // Remove previous connection listener
            if (connectionID != null){
                client.removeAllListeners("client" + connectionID);
            }

            connectionID = parseInt(data);

        });

        // Listen for session size information
        client.on("session info", function(data){
            console.log("Session Info: ", data);
            sessionData = data;
            if (onJoinSession){
                onJoinSession(sessionData);
                onJoinSession = null;
            }
        });

        // Listen for session id information
        // (Server telling you what your ID is)
        client.on("session id", function(data){
            console.log("New Session ID:", data);
            sessionID = data;
        });

        // Listen for private messages
        client.on('private', function(data){
            console.log(logHeader, "private>", data);
            callAllListeners(listeners.onPrivateMessage, data);
        });

        // Listen for public messages
        client.on("public", function(data){
            console.log(logHeader, "public>", data);
            callAllListeners(listeners.onPublicMessage, data);
        });

        // Listen for all session messages
        client.on("session", function(data){
            console.log(logHeader, "session>", data);
            callAllListeners(listeners.onSessionMessage,data);
        });

        // Listen for client disconnecting
        client.on("disconnect", function() {
            console.log(logHeader, "Disconnected");
        });
    },

    // ------------------------------------------------------------------------
    // BASIC MESSAGES
    // ------------------------------------------------------------------------

    // Send a public message to everyone connected to the socket
    sendPublicMessage: function(message){
        client.emit("public", message);
    },

    // Sends a message to everyone in the session
    sendSessionMessage: function(message){
        client.emit("session", message);
    },

    // Sends a message to the server log
    sendLogMessage: function(message){
        client.emit("log", message);
    },

    // ------------------------------------------------------------------------
    // BASIC ACTIONS
    // ------------------------------------------------------------------------

    joinSession: function(session_id, onJoin){
        sessionID = session_id;
        onJoinSession = onJoin;

        client.emit("change session", sessionID);

        sessionData = null;
        client.emit("session info");

        // TODO ask for members, current patches, info etc.

    },

    getSessionSize: function(){
        return sessionData.sessionSize;
    },
    getStateRevision: function(){
        return sessionData.stateRevision;
    },
    getSessionID: function(){
        return sessionID;
    },

    getSessionsInfo: function(infoCallback){
        client.emit("sessions info");

        function onSessionInfo(data){

            infoCallback(data);

            client.removeListener("sessions info", onSessionInfo);
        }

        client.on("sessions info", onSessionInfo);

    },

    setSessionDescription: function(description){
        client.emit("session description", description);
    },

    // ------------------------------------------------------------------------
    // LISTENER LOGIC
    // ------------------------------------------------------------------------

    // Add function listener for private messages to this client
    addPrivateMessageListener: function(callback){
        listeners.onPrivateMessage.push(callback);
    },

    // Add function listener for public messages to this client
    addPublicMessageListener: function(callback){
        listeners.onPublicMessage.push(callback);
    },

    // Add function listener for session messages to this client
    addSessionMessageListener: function(callback){
        listeners.onSessionMessage.push(callback);
    },

    // Remove function listener for private messages to this client
    removePrivateMessageListener: function(callback){
        for (var i = 0; i < listeners.onPrivateMessage.length; i ++){
            if (listeners[i] == callback){
                listeners.splice(i,1);
            }
        }
    },

    // Remove function listener for public messages to this client
    removePublicMessageListener: function(callback){
        for (var i = 0; i < listeners.onPublicMessage.length; i ++){
            if (listeners[i] == callback){
                listeners.splice(i,1);
            }
        }
    },

    // Remove function listener for session messages to this client
    removeSessionMessageListener: function(callback){
        for (var i = 0; i < listeners.onSessionMessage.length; i ++){
            if (listeners[i] == callback){
                listeners.splice(i,1);
            }
        }
    },


    // Sets the log header to preface log messages with
    setLogHeader: function(header){
        logHeader = header;
    }
};

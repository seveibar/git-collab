// gcollab is a client module for use with git-collab

var gcollab = function(){

    // Listeners for various events, each event has a list of function callbacks
    // that will be called when the event occurs
    var listeners = {
        // Each function takes (data, who)
        onPrivateMessage : [],
        onPublicMessage  : [],
        onSessionMessage : [],
        onHostMessage : []
    };

    // Session ID of session client is currently in
    var sessionID = 0;

    function callAllListeners(listenerList, data){
        for (var i = 0;i < listenerList.length; i++){
            listenerList[i](data);
        }
    }

    var client, connectionID;

    var gcollab = {

        // Call to connect to server at port
        connect : function (addr, port, connectionCallback, logHeader){
            port = port || 4444;
            connectionCallback = connectionCallback || function(){};

            // Every log message is prefaced with this
            // (for multiple clients on a single cpu)
            logHeader = logHeader || "";

            // Connect to the socket controller/server
            client = io( addr + ":" + port);
            connectionID = null;

            // Listen for connection to server
            client.on('connect', function () {
                console.log("Connected to Server");
                connectionCallback();
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

            // Listen for host messages
            client.on("host", function(data){
                console.log(logHeader, "host>", data);
                callAllListeners(listeners.onHostMessage, data);
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

        // Sends a message to the host
        sendHostMessage: function(message){
            client.emit("host", message);
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

        joinSession: function(session_id){
            sessionID = session_id;

            client.emit("change session", sessionID);

            // TODO ask for members, current patches, info etc.

        },

        // ------------------------------------------------------------------------
        // LISTENER LOGIC
        // ------------------------------------------------------------------------

        // Add function listener for private messages to this client
        addPrivateMessageListener: function(callback){
            listeners.onPrivateMessage.push(callback);
        },

        // Add function listener for host messages to this client
        addHostMessageListener: function(callback){
            listeners.onHostMessage.push(callback);
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

        // Remove function listener for host messages to this client
        removeHostMessageListener: function(callback){
            for (var i = 0; i < listeners.onHostMessage.length; i ++){
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

    return gcollab;
}();

// git-collab server
var controller = require("../../client-server/SocketController.js");
controller.start(4444);

// Web server
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/../web-client'));
app.listen(3000);

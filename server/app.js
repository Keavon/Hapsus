var configuration = require('./config');
configuration.configure();
console .log("Starting Hapsus in " + configuration.config.mode + " mode on port " + configuration.config.port);

var server = require('http').Server();
var io = require('socket.io').listen(server, {log: configuration.config.socket.io.log });

var d = new Date();

io.on('connection', function(socket){
  socket.set('transports', ['websocket']);
  socket.emit("connection", {});
  socket.on('ping', function(data){
    socket.emit("pong", {time_start: data.time_start});
  });
  socket.on('disconnect', function(){});
});
server.listen(configuration.config.port);
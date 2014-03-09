var configuration = require('./config');
configuration.configure();
console .log("Starting Hapsus in " + configuration.config.mode + " mode on port " + configuration.config.port + " at " + (new Date()));

var users = [];

var server = require('http').Server(function(req, res) {
  //This handles the url checking for the server, if it matches the route or the route without a ending slash, display the server info. Example Path= "/game/" this will display server info on "/game" and "/game/"
  if (require('url').parse(req.url).pathname == configuration.config.path.replace(/\/+$/, '') || require('url').parse(req.url).pathname == configuration.config.path.replace(/\/+$/, '') + "/") {
    res.writeHead(200, 'application/json');
    res.end(JSON.stringify({server: "hapsus", name: configuration.config.name, version: require('./package.json').version}));
  } else {
    res.writeHead(404, 'text/plain');
    res.end("404 not found. :'(");
  }
});
var io = require('socket.io').listen(server, {log: configuration.config.socket.io.log });

io.of(configuration.config.path + "socket").on('connection', function(socket){
  socket.set('player', require('./lib/user').add_user(), function() {
    socket.get('player', function(err, name){
      if(err) {
        console.log("Error in Name Retrival: " + err);
      } else {
        socket.emit("connection", {player: name });
      }
    });      
  });
  socket.on('ping', function(data){
    socket.emit("pong", {time_start: data.time_start});
  });
  socket.on('disconnect', function(){
    socket.get('player', function( err, name) {
      if(err) {
        console.log("Err in Name Removal: " + err);
      } else {
        require('./lib/user').remove_user(name);
      }
    });
  });
});

server.listen(configuration.config.port);
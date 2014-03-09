//Configuration Settings for Hapsus Server
//mode: heroku or development
//name: Name of server
//port: server port
//socket.io.log: Socket.io debug mode
//path: Url path to host the server at (eg: /game/). You MUST hava a slash at the end of the path

var config = {};

var configure = function() {
  var on_heroku = process.env.HEROKU  || false;
  config.socket = {};
  config.socket.io = {};

  //If App is on Heroku Use these settings
  if(on_heroku === "true") {
    config.mode = "Heroku";
    config.port = process.env.PORT;
    config.socket.io.log = false;
  } else { //If app is in development mode use these settings.
    config.mode = "Development";
    config.port = 8080;
    config.socket.io.log = false;
  }
};

config.name = "Hapsus Server";
config.path = "/"; 

exports.configure = configure;
exports.config = config;

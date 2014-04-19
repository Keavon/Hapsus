var context = document.getElementById("game");
var context = context.getContext("2d");
var startTime = new Date().getTime();
var lastTime = null;

var socket = io.connect('192.168.1.52:8000/socket');
var connected = false;

var leftFirstRun = true;
var rightFirstRun = true;
var leftFirst = true;
var rightFirst = true;
var stopFirst = true;

var circles = [];
circles[0] = { "x": 300, "y": 200, "r": 100 };
circles[1] = { "x": 800, "y": 400, "r": 50 };

var playerSize = 20;
var playerColor = "#ff0000";
var playerSpeed = 0.4;

var player = {
	"players": [
		{
			"x": 0,
			"y": 0,
			"residence": 0,
			"angle": 0,
			"velocity": 0,
			"angularVelocity": 0,
			"color": "#ff0000"
		}, {
			"x": 0,
			"y": 0,
			"residence": 0,
			"angle": 0,
			"velocity": 0,
			"angularVelocity": 0,
			"color": "#0000ff"
		}
	]
};

var playerPos = {
	"players": []
};

(function () { var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame; window.requestAnimationFrame = requestAnimationFrame; }());

var keyLeft = false;
var keyRight = false;
var keyJump = false;

socket.on('connection', function (data)
{
	connected = true;
	updateFrame();
});

socket.on("moving", function (data)
{
});

socket.on("playerSpawn", function (data)
{
	playerPos.players.push(
	{
		"x": circles[player.players[data.player].residence].x + (circles[player.players[data.player].residence].r + playerSize) * Math.cos(player.players[data.player].angle),
		"y": circles[player.players[data.player].residence].y + (circles[player.players[data.player].residence].r + playerSize) * Math.sin(player.players[data.player].angle)
	});
	console.log(playerPos); //TEST
});

socket.on("playerDisconnect", function (data)
{
});

socket.on("stopped", function (data)
{
});

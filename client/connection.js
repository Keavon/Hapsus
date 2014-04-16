var connected = false;
var socket = io.connect('server.hapsus.com/socket');

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
});

socket.on("playerDisconnect", function (data)
{
	console.log("Goodbye Player " + data.player);
	playerNumber--;
});

socket.on("stopped", function (data)
{

});
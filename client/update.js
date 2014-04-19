var c = document.getElementById("game");
var ctx = c.getContext("2d");

var playerId = 0; // TEMP
var playerSize = 20;
var playerColor = "#ff0000";
var playerSpeed = 25;
var jumpVelocity = 10;

var degToRad = 0.017453292519943295; // pi / 180
var radToDeg = 57.29577951308232; // 180 / pi

var startTime = new Date().getTime();
var lastTime = null;
var deltaT = 0;

var players = {
	"players": [
		{
			"x": 0,
			"y": 0,
			"lastX": 0,
			"lastY": 0,
			"residence": 0,
			"angle": 0,
			"velocity": 0,
			"angularVelocity": 0,
			"color": "#ff0000"
		}, {
			"x": 0,
			"y": 0,
			"lastX": 0,
			"lastY": 0,
			"residence": 0,
			"angle": 10,
			"velocity": 0,
			"angularVelocity": 0,
			"color": "#00ff00"
		}
	]
};
var circles = {
	"circles": [
		{ "x": 300, "y": 200, "r": 100 },
		{ "x": 800, "y": 400, "r": 50 },
		{ "x": 700, "y": 100, "r": 200 }
	]
};

function deltaTime()
{
	if (lastTime === null)
	{
		lastTime = new Date().getTime();
	}
	var dt = new Date().getTime() - lastTime;
	lastTime = new Date().getTime();
	return dt;
}

(function () { var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame; window.requestAnimationFrame = requestAnimationFrame; })();

function updateFrame()
{
	// Get DeltaTime
	deltaT = deltaTime();

	// Clear frame
	ctx.clearRect(0, 0, c.width, c.height);

	checkForJump();

	// Move around edge of circle
	if (players.players[playerId].residence !== null)
	{
		// Modifies the angle from keyboard input
		players.players[playerId].angle += (playerSpeed * keyHandler() * deltaT) / circles.circles[players.players[playerId].residence].r;

		// Turn that angle into XY coordinates and update the player object
		var angle = players.players[playerId].angle;
		var radius = circles.circles[players.players[playerId].residence].r;
		var circleX = circles.circles[players.players[playerId].residence].x;
		var circleY = circles.circles[players.players[playerId].residence].y;

		// Set coordinates to player
		players.players[playerId].x = circleX + ((radius + playerSize) * Math.cos(angle * degToRad));
		players.players[playerId].y = circleY + ((radius + playerSize) * Math.sin(angle * degToRad));
	} else // Move when player is flying
	{
		// Save previous location
		players.players[playerId].lastX = players.players[playerId].x;
		players.players[playerId].lastY = players.players[playerId].y;

		// Calculate position for this frame during flight
		players.players[playerId].x += players.players[playerId].velocity * Math.cos(players.players[playerId].angularVelocity * degToRad);
		players.players[playerId].y += players.players[playerId].velocity * Math.sin(players.players[playerId].angularVelocity * degToRad);

		for (var testNumber = 0; testNumber < circles.circles.length; testNumber++)
		{
			// Checks if the player is within the X and Y viscinity of the tested circle
			//if (players.players[playerId].x > (circles.circles[testNumber].r + playerSize) - circles.circles[testNumber].x && players.players[playerId].x < (circles.circles[testNumber].r + playerSize) + circles.circles[testNumber].x && players.players[playerId].y > (circles.circles[testNumber].r + playerSize) - circles.circles[testNumber].y && players.players[playerId].y < (circles.circles[testNumber].r + playerSize) + circles.circles[testNumber].y)
			//{
				// Checks if the player is within the radius of the player + tested circle to determine if they're touching
				if (Math.sqrt(Math.pow(players.players[playerId].x - circles.circles[testNumber].x, 2) + Math.pow(players.players[playerId].y - circles.circles[testNumber].y, 2)) <= circles.circles[testNumber].r + playerSize)
				{
					players.players[playerId].residence = testNumber;
					players.players[playerId].velocity = 0;

					//var collisionRadius = circles.circles[playerId].r + playerSize;
					players.players[playerId].angle = Math.atan2(players.players[playerId].y - circles.circles[players.players[playerId].residence].y, players.players[playerId].x - circles.circles[players.players[playerId].residence].x) * radToDeg;
				}
			//}
		}
	}

	// Draws world circles
	for (var worldCircles = 0; worldCircles < circles.circles.length; worldCircles++)
	{
		var offsetX = players.players[playerId].x - (c.offsetWidth * 0.5);
		var offsetY = players.players[playerId].y - (c.offsetHeight * 0.5);

		ctx.beginPath();
		ctx.arc(circles.circles[worldCircles].x - offsetX, circles.circles[worldCircles].y - offsetY, circles.circles[worldCircles].r, 0, 2 * Math.PI);
		ctx.fillStyle = "#3b94c7";
		ctx.fill();
	}

	// Draws character
	for (var playerNum = 0; playerNum < 1 /*TEMP*/; playerNum++)
	{
		ctx.beginPath();
		ctx.arc(players.players[playerNum].x - offsetX, players.players[playerNum].y - offsetY, playerSize, 0, 2 * Math.PI);
		ctx.fillStyle = players.players[playerNum].color;
		ctx.fill();
	}

	requestAnimationFrame(updateFrame);
}
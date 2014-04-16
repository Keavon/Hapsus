var c = document.getElementById("game");
var ctx = c.getContext("2d");

var playerId = 0; // TEMP

var deltaT = 0;

var circles = {
	"circles":[
		{ "x": 300, "y": 200, "r": 100 },
		{ "x": 800, "y": 400, "r": 50 }
	]
}

var playerSize = 20;
var playerColor = "#ff0000";
var playerSpeed = 25;
var jumpVelocity = 10;

var circleMaxRadius = 200;
var circleMinRadius = 50;
var maxCirclePlusPlayer = circleMaxRadius + playerSize;

var degToRad = 0.017453292519943295; // pi / 180

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

(function () { var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame; window.requestAnimationFrame = requestAnimationFrame; })();

function updateFrame()
{
	// Get DeltaTime
	deltaT = deltaTime();

	// Clear frame
	ctx.clearRect(0, 0, c.width, c.height);

	// Check for jump
	checkForJump();
	if (players.players[playerId].residence != null)
	{
		// Modifies the angle from keyboard input
		players.players[playerId].angle += (playerSpeed * keyHandler() * deltaT) / circles.circles[players.players[playerId].residence].r;

		// Turn that angle into XY coordinates and update the player object
		var angle = players.players[playerId].angle;
		var radius = circles.circles[players.players[playerId].residence].r;
		var circleX = circles.circles[playerId].x;
		var circleY = circles.circles[playerId].y;
		console.log(angle);
		players.players[playerId].lastX = players.players[playerId].x;
		players.players[playerId].lastY = players.players[playerId].y;
		players.players[playerId].x = circleX + ((radius + playerSize) * Math.cos(angle * degToRad));
		players.players[playerId].y = circleY + ((radius + playerSize) * Math.sin(angle * degToRad));
	}
	else
	{
		players.players[playerId].x += players.players[playerId].velocity * Math.cos(players.players[playerId].angularVelocity * degToRad);
		players.players[playerId].y += players.players[playerId].velocity * Math.sin(players.players[playerId].angularVelocity * degToRad);

		for (var testNumber = 0; testNumber < circles.circles.length; testNumber++)
		{
			// Checks if the player is within the X and Y viscinity of the tested circle
			if (players.players[playerId].x > (circles.circles[testNumber].r + playerSize) - circles.circles[testNumber].x && players.players[playerId].x < (circles.circles[testNumber].r + playerSize) + circles.circles[testNumber].x && players.players[playerId].y > (circles.circles[testNumber].r + playerSize) - circles.circles[testNumber].y && players.players[playerId].y < (circles.circles[testNumber].r + playerSize) + circles.circles[testNumber].y)
			{
				// Checks if the player is within the radius of the player + tested circle to determine if they're touching
				if(Math.sqrt(Math.pow(players.players[playerId].x - circles.circles[testNumber].x, 2) + Math.pow(players.players[playerId].y - circles.circles[testNumber].y, 2)) <= circles.circles[testNumber].r + playerSize)
				{
					players.players[playerId].velocity = 0;
					var stoppedPosition = Math.tan((circles.circles[testNumber].y - players.players[playerId].y) / (circles.circles[testNumber].x - players.players[playerId].x));
					console.log("Touching! " + stoppedPosition);
				}
			}
		}

	}

	// Draws world circles
	for (var worldCircles = 0; worldCircles < circles.circles.length; worldCircles++)
	{
		ctx.beginPath();
		ctx.arc(circles.circles[worldCircles].x, circles.circles[worldCircles].y, circles.circles[worldCircles].r, 0, 2 * Math.PI);
		ctx.fillStyle = "#3b94c7";
		ctx.fill();
	}

	// Draws character
	for (var playerNum = 0; playerNum < 1 /*TEMP*/; playerNum++)
	{
		ctx.beginPath();
		ctx.arc(players.players[playerNum].x, players.players[playerNum].y, playerSize, 0, 2 * Math.PI);
		ctx.fillStyle = players.players[playerNum].color;
		ctx.fill();
	}

	requestAnimationFrame(updateFrame);
}
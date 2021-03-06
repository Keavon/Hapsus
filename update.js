﻿/*JSCS "requireKeywordsOnNewLine": ["else"] */

var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.onresize = function (event)
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};
function requestFullScreen(element)
{
	var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
	if (requestMethod)
	{
		requestMethod.call(element);
	}
	else if (typeof window.ActiveXObject !== "undefined")
	{
		var wscript = new ActiveXObject("WScript.Shell");
		if (wscript !== null)
		{
			wscript.SendKeys("{F11}");
		}
	}
}
canvas.ondblclick = function ()
{
	var elem = document.body;
	requestFullScreen(elem);
};

var degToRad = 0.017453292519943295; // pi / 180
var radToDeg = 57.29577951308232; // 180 / pi

var userIdElement;
var userID = 1397946725450; // Corresponds to player ID
var players = {
	"players": [
		{
			"ID": 1397946725450, // Example value, normally set by server as the number of milliseconds since epoch when client connects
			"x": 0.0,
			"y": 0.0,
			"residence": 0,
			"angle": 0.0,
			"speed": 25.0,
			"currentSpeed": 0,
			"justJumped": false,
			"velocity": 0.0,
			"angularVelocity": 0.0,
			"color": "#ff0000",
			"jumpVelocity": 0.5,
			"size": 20.0
		}, {
			"ID": 1397946730842, // Example value, normally set by server as the number of milliseconds since epoch when client connects
			"x": 0.0,
			"y": 0.0,
			"residence": 2,
			"angle": 0.0,
			"speed": 25.0,
			"currentSpeed": 0,
			"justJumped": false,
			"velocity": 0.0,
			"angularVelocity": 0.0,
			"color": "#00ffff",
			"jumpVelocity": 0.5,
			"size": 20.0
		}
	]
};
var circles = {
	"circles": [
	{
		"x": 300,
		"y": 200,
		"r": 100,
		"capture": []
	}, {
		"x": 800,
		"y": 400,
		"r": 50,
		"capture": []
	}, {
		"x": 700,
		"y": 100,
		"r": 200,
		"capture": []
	}
	]
};

var startTime = new Date().getTime();
var lastTime = null;
var deltaT = 0;

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

context.font = "72px Open Sans, Arial";
context.textAlign = 'center';
context.fillText("Connecting to server...", canvas.offsetWidth * 0.5, canvas.offsetHeight * 0.5);
context.fill();

(function () { var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame; window.requestAnimationFrame = requestAnimationFrame; })();

var userIdElement = -1;

function updateFrame()
{
	// Get DeltaTime
	deltaT = deltaTime();

	// Clear frame
	context.clearRect(0, 0, canvas.width, canvas.height);

	// Find index of the user --- RECALCULATE WHEN PLAYER LEAVES
	if (userIdElement == -1)
	{
		for (var playerId = 0; playerId < players.players.length; playerId++)
		{
			if (players.players[playerId].ID == userID)
			{
				userIdElement = playerId;
				break;
			}
		}
	}

	// Check if user jumps from input
	if (checkForJump())
	{
		players.players[userIdElement].justJumped = true;
	}

	// Get user movement direction from input
	players.players[userIdElement].currentSpeed = keyHandler(userIdElement);

	// Updates player locations
	updatePlayers();

	// Pans camera
	var offsetX = players.players[userIdElement].x - (canvas.offsetWidth * 0.5);
	var offsetY = players.players[userIdElement].y - (canvas.offsetHeight * 0.5);

	// Update world circle capture data
	updateCircles();

	// Draws world circles
	for (var worldCircles = 0; worldCircles < circles.circles.length; worldCircles++)
	{
		var centerX = circles.circles[worldCircles].x - offsetX;
		var centerY = circles.circles[worldCircles].y - offsetY;
		var circleR = circles.circles[worldCircles].r;
		var size = 1;
		var nextSize = 1;

		// Draws all layers of each circle
		for (var i = 0; i < circles.circles[worldCircles].capture.length + 1; i++)
		{
			var color = "";
			if (i < circles.circles[worldCircles].capture.length)
			{
				// Calculate claimed parts
				nextSize -= circles.circles[worldCircles].capture[i].percentage;
				color = players.players.find(function (x) { return x.ID === circles.circles[worldCircles].capture[i].id; }).color; // jshint ignore:line
			}
			else if (nextSize > 0)
			{
				// Calculate unclaimed part
				color = "#cccccc";
			}
			else
			{
				break;
			}

			// Draw
			context.beginPath();
			context.fillStyle = color;
			context.arc(centerX, centerY, circleR * size, 0, 2 * Math.PI);
			context.fill();

			if (nextSize <= 0.00001)
			{
				break;
			}
			else
			{
				size = nextSize;
			}
		}
	}

	// Draws characters
	for (var playerNum = 0; playerNum < players.players.length; playerNum++)
	{
		context.beginPath();
		context.arc(players.players[playerNum].x - offsetX, players.players[playerNum].y - offsetY, players.players[playerNum].size, 0, 2 * Math.PI);
		context.fillStyle = players.players[playerNum].color;
		context.fill();
	}

	// Requests next frame to be rendered
	requestAnimationFrame(updateFrame);
}

function updatePlayers()
{
	for (var playerId = 0; playerId < players.players.length; playerId++)
	{
		if (players.players[playerId].ID == userID)
		{
			// Checks if the user has jumped
			if (players.players[playerId].justJumped)
			{
				// Remove "active" tag from former circle
				for (var captives = 0; captives < circles.circles[players.players[playerId].residence].capture.length; captives++) // Look through each player capturing circle
				{
					if (circles.circles[players.players[playerId].residence].capture[captives].id == players.players[playerId].ID)
					{
						circles.circles[players.players[playerId].residence].capture[captives].active = false;
						break;
					}
				}

				// Remove player from circle
				players.players[playerId].residence = null;
				players.players[playerId].velocity = players.players[playerId].jumpVelocity;
				players.players[playerId].angularVelocity = players.players[playerId].angle;
				players.players[playerId].justJumped = false;
			}
		}

		// Move around edge of circle
		if (players.players[playerId].residence !== null)
		{
			// Modifies the angle
			players.players[playerId].angle += (players.players[playerId].speed * players.players[playerId].currentSpeed * deltaT) / circles.circles[players.players[playerId].residence].r;

			// Turn that angle into XY coordinates and update the player object
			var angle = players.players[playerId].angle;
			var radius = circles.circles[players.players[playerId].residence].r;
			var circleX = circles.circles[players.players[playerId].residence].x;
			var circleY = circles.circles[players.players[playerId].residence].y;

			// Set coordinates to player
			players.players[playerId].x = circleX + ((radius + players.players[playerId].size) * Math.cos(angle * degToRad));
			players.players[playerId].y = circleY + ((radius + players.players[playerId].size) * Math.sin(angle * degToRad));

			// Capture circle
			var occurs = false;
			for (var i = 0; i < circles.circles[players.players[playerId].residence].capture.length; i++)
			{
				if (circles.circles[players.players[playerId].residence].capture[i].id == players.players[playerId].ID)
				{
					occurs = true;
					break;
				}
			}
			if (!occurs)
			{
				circles.circles[players.players[playerId].residence].capture.push({
					"id": players.players[playerId].ID,
					"percentage": 0.0,
					"active": true
				});
			}
			else
			{
				circles.circles[players.players[playerId].residence].capture[i].active = true;
			}
		}
		else // Move when player is flying
		{
			// Calculate position for this frame during flight
			players.players[playerId].x += players.players[playerId].velocity * Math.cos(players.players[playerId].angularVelocity * degToRad) * deltaT;
			players.players[playerId].y += players.players[playerId].velocity * Math.sin(players.players[playerId].angularVelocity * degToRad) * deltaT;

			for (var testNumber = 0; testNumber < circles.circles.length; testNumber++)
			{
				// Checks if the player is within the radius of the player + tested circle to determine if they're touching
				if (Math.sqrt(Math.pow(players.players[playerId].x - circles.circles[testNumber].x, 2) + Math.pow(players.players[playerId].y - circles.circles[testNumber].y, 2)) <= circles.circles[testNumber].r + players.players[playerId].size)
				{
					players.players[playerId].residence = testNumber;
					players.players[playerId].velocity = 0;

					//var collisionRadius = circles.circles[playerId].r + players.players[playerId].size;
					players.players[playerId].angle = Math.atan2(players.players[playerId].y - circles.circles[players.players[playerId].residence].y, players.players[playerId].x - circles.circles[players.players[playerId].residence].x) * radToDeg;
				}
			}
		}
	}
}

function updateCircles()
{
	// Repeat for every circle
	for (var checkedCircle = 0; checkedCircle < circles.circles.length; checkedCircle++)
	{
		var totalCaptured = 0.0;

		for (var ii = 0; ii < circles.circles[checkedCircle].capture.length; ii++)
		{
			totalCaptured += circles.circles[checkedCircle].capture[ii].percentage;
		}

		// Repeat for every capturing player
		for (var i = 0; i < circles.circles[checkedCircle].capture.length; i++)
		{
			// If it's active, grow circle
			if (circles.circles[checkedCircle].capture[i].active && totalCaptured < 1)
			{
				circles.circles[checkedCircle].capture[i].percentage += deltaT / circles.circles[checkedCircle].r * 0.05;
				if (circles.circles[checkedCircle].capture[i].percentage > 1)
				{
					circles.circles[checkedCircle].capture[i].percentage = 1;
				}
			}
			// If it's not active, shrink circle
			else if (!circles.circles[checkedCircle].capture[i].active)
			{
				circles.circles[checkedCircle].capture[i].percentage -= deltaT / circles.circles[checkedCircle].r * 0.01;

				if (circles.circles[checkedCircle].capture[i].percentage < 0)
				{
					// Remove old capturer
					circles.circles[checkedCircle].capture.splice(i, 1);
				}
			}
		}
	}
}
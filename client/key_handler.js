var keyLeft = false;
var keyRight = false;
var keyJump = false;

var firstLeft = true;
var firstRight = true;
var firstStop = true;
var firstJump = true;

function keyHandler()
{
	if (!keyLeft && !keyRight) // None down
	{
		firstLeft = true;
		firstRight = true;

		if (firstStop)
		{
			socket.emit("stopMovement", { "angle": players.players[playerId].angle });
			firstStop = false;
		}

		return 0;
	}
	else if (keyLeft && !keyRight) // Left down
	{
		firstStop = true;

		if (firstLeft)
		{
			socket.emit("startMovement", { "movingLeft": true, "angle": players.players[playerId].angle });
			firstLeft = false;
		}

		return -1;
	}
	else if (!keyLeft && keyRight) // Right down
	{
		firstStop = true;

		if (firstRight)
		{
			socket.emit("startMovement", { "movingLeft": false, "angle": players.players[playerId].angle });
			firstRight = false;
		}

		return 1;
	}
	else if (keyLeft && keyRight) // Both down
	{
		firstLeft = true;
		firstRight = true;

		if (firstStop)
		{
			socket.emit("stopMovement", { "angle": players.players[playerId].angle });
			firstStop = false;
		}

		return 0;
	}
}
function checkForJump()
{
	if (keyJump && firstJump)
	{
		//var playerResidence = players.players[playerId].residence;
		//var x1 = circles[playerResidence].x;
		//var x2 = players.players[playerId].x;
		//var y1 = circles[playerResidence].y;
		//var y2 = players.players[playerId].y;
		//var degToRad = 0.017453292519943295; // pi / 180
		//var velocityAngle = tan(((y2 - y1) / (x2 - x1)) * degToRad);

		console.log("jumped");
		players.players[playerId].residence = null;
		players.players[playerId].velocity = jumpVelocity;
		players.players[playerId].angularVelocity = players.players[playerId].angle;
		firstJump = false;
	}
}

document.onkeydown = function (e)
{
	e = e || window.event;
	if (e.charCode || e.keyCode == 37) // Left down
	{
		keyLeft = true;
	}
	if (e.charCode || e.keyCode == 39) // Right down
	{
		keyRight = true;
	}
	if (e.charCode || e.keyCode == 38) // Right down
	{
		keyJump = true;
	}
}
document.onkeyup = function (e)
{
	e = e || window.event;
	if (e.charCode || e.keyCode == 37) // Left up
	{
		keyLeft = false;
	}
	if (e.charCode || e.keyCode == 39) // Right up
	{
		keyRight = false;
	}
	if (e.charCode || e.keyCode == 38) // Right up
	{
		keyJump = false;
	}
};
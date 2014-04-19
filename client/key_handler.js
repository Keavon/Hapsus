var keyLeft = false;
var keyRight = false;
var keyJump = false;

var firstLeft = true;
var firstRight = true;
var firstStop = true;
var firstJump = true;

function keyHandler(pId)
{
	if (!keyLeft && !keyRight) // None down
	{
		firstLeft = true;
		firstRight = true;

		if (firstStop)
		{
			socket.emit("stopMovement", { "angle": players.players[pId].angle });
			firstStop = false;
		}

		return 0;
	} else if (keyLeft && !keyRight) // Left down
	{
		firstStop = true;

		if (firstLeft)
		{
			socket.emit("startMovement", { "movingLeft": true, "angle": players.players[pId].angle });
			firstLeft = false;
		}

		return -1;
	} else if (!keyLeft && keyRight) // Right down
	{
		firstStop = true;

		if (firstRight)
		{
			socket.emit("startMovement", { "movingLeft": false, "angle": players.players[pId].angle });
			firstRight = false;
		}

		return 1;
	} else if (keyLeft && keyRight) // Both down
	{
		firstLeft = true;
		firstRight = true;

		if (firstStop)
		{
			socket.emit("stopMovement", { "angle": players.players[pId].angle });
			firstStop = false;
		}

		return 0;
	}
}
function checkForJump(pId)
{
	if (keyJump && firstJump)
	{
		players.players[pId].residence = null;
		players.players[pId].velocity = players.players[pId].jumpVelocity;
		players.players[pId].angularVelocity = players.players[pId].angle;
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
};
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
		firstJump = true;
	}
};
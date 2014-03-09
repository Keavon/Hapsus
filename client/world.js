var c = document.getElementById("game");
var ctx = c.getContext("2d");

var circles = new Array();
circles[0] = { "x": 300, "y": 200, "r": 100 };
circles[1] = { "x": 800, "y": 400, "r": 50 };

var playerSize = 20;
var playerColor = "#ff0000";

var playerResidence = 0;
var playerResidenceAngle = 0.0;

var playerX = 0;
var playerY = 0;

var keyLeft = false;
var keyRight = false;
var keyJump = false;

(function (){var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame; window.requestAnimationFrame = requestAnimationFrame;})();

window.addEventListener("load", function ()
{
	updateFrame();
});

function updateFrame()
{
	ctx.clearRect(0, 0, c.width, c.height);

	if ((!keyLeft && keyRight) || keyLeft && !keyRight)
	{
		if (keyLeft)
		{
			playerResidenceAngle += 0.1;
		}
		if (keyRight)
		{
			playerResidenceAngle -= 0.1;
		}
	}
	if (keyJump)
	{
		if (playerResidence + 1 == circles.length)
		{
			playerResidence = 0;
		}
		else
		{
			playerResidence++;
		}
		keyJump = false;
	}

	playerX = circles[playerResidence].x + (circles[playerResidence].r + playerSize) * Math.cos(playerResidenceAngle);
	playerY = circles[playerResidence].y + (circles[playerResidence].r + playerSize) * Math.sin(playerResidenceAngle);
	drawFrame();
}

function drawFrame()
{
	for (var circleIteration = 0; circleIteration < circles.length; circleIteration++)
	{
		ctx.beginPath();
		ctx.arc(circles[circleIteration].x, circles[circleIteration].y, circles[circleIteration].r, 0, 2 * Math.PI);
		ctx.fillStyle = "#3b94c7";
		ctx.fill();
	}

	ctx.beginPath();
	ctx.arc(playerX, playerY, playerSize, 0, 2 * Math.PI);
	ctx.fillStyle = playerColor;
	ctx.fill();

	requestAnimationFrame(updateFrame);
}

document.onkeydown = function (e)
{
	e = e || window.event;

	if (e.charCode || e.keyCode == 37)
	{
		keyLeft = true;
	}
	if (e.charCode || e.keyCode == 39)
	{
		keyRight = true;
	}
	if (e.charCode || e.keyCode == 38)
	{
		keyJump = true;
	}
};
document.onkeyup = function (e)
{
	e = e || window.event;

	if (e.charCode || e.keyCode == 37)
	{
		keyLeft = false;
	}
	if (e.charCode || e.keyCode == 39)
	{
		keyRight = false;
	}
	if (e.charCode || e.keyCode == 38)
	{
		keyJump = false;
	}
};
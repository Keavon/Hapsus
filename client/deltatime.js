var startTime = new Date().getTime();
var lastTime = null;

function deltaTime()
{
	if (lastTime == null)
	{
		lastTime = new Date().getTime();
	}
	var dt = new Date().getTime() - lastTime;
	lastTime = new Date().getTime();
	return dt;
}
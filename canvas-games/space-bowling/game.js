$(document).ready(function(){
	var canvas = $("#gameCanvas");
	var context = canvas.get(0).getContext("2d");

	var canvasWidth = canvas.width();
	var canvasHeight = canvas.height();

	var playGame;

	var platformX,
		platformY,
		platformOuterRadius,
		platformInnerRadius;

	var asteroids;

	var player;
	var playerOriginalX;
	var playerOriginalY;

	var playerSelected;
	var playerMaxAbsVelocity;
	var playerVelocityDampener;
	var powerX;
	var powerY;
	var score;



	var uiIntro = $("#gameIntro"),
		uiStats = $("#gameStats"),
		uiComplete = $("#gameComplete"),
		uiPlay = $("#gamePlay"),
		uiReset = $(".gameReset"),
		uiRemaining = $("#gameRemaining"),
		uiScore = $("#gameScore"),
		uiWinScore = $(".gameScore");

	var Asteroid = function(x, y, radius, mass, friction) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.mass = mass;
		this.friction = friction;
		this.vX = 0;
		this.vY = 0;
		this.player = false;
	}
	function resetPlayer(){
		player.x = playerOriginalX;
		player.y = playerOriginalY;
		player.vX = 0;
		player.vY = 0;
	}

	function startGame(){
		uiScore.html("0");
		uiStats.show();
		playGame = false;
		platformX = canvasWidth/2;
		platformY = 150;
		platformOuterRadius = 100;
		platformInnerRadius = 75;

		asteroids = new Array();

		playerSelected = false;
		playerMaxAbsVelocity = 30;
		playerVelocityDampener = 0.3;
		powerX = -1;
		powerY = -1;
		score = 0;


		var pRadius = 15;
		var pMass = 10;
		var pFriction = 0.97;
		playerOriginalX = canvasWidth/2;
		playerOriginalY = canvasHeight - 150;
		player = new Asteroid(playerOriginalX, playerOriginalY, pRadius, pMass, pFriction);
		player.player = true;
		asteroids.push(player);

		var outerRing = 8;
		var ringCount = 3;
		var ringSpacing = (platformInnerRadius/(ringCount-1));
		for(var r=0;r<ringCount;r++){
			var currentRing = 0;
			var angle = 0;
			var ringRadius = 0;
			if(r == ringCount-1){
				currentRing = 1;
			} else {
				currentRing = outerRing - (r*3);
				angle = 360/currentRing;
				ringRadius = platformInnerRadius - (ringSpacing * r);
			}
			for(var a=0;a<currentRing;a++){
				var x = 0;
				var y = 0;
				if(r == ringCount-1){
					x = platformX;
					y = platformY;
				} else {
					x = platformX + (ringRadius * Math.cos((angle * a) * (Math.PI/180)));
					y = platformY + (ringRadius * Math.sin((angle * a) * (Math.PI/180)));
				}
				var radius = 10;
				var mass = 5;
				var friction = 0.95;
				asteroids.push(new Asteroid(x, y, radius, mass, friction));
			}
		}
		uiRemaining.html(asteroids.length - 1);

		$(window).mousedown(function(e){
			if(!playerSelected && player.x == playerOriginalX && player.y == playerOriginalY){
				var canvasOffset = canvas.offset();
				var canvasX = Math.floor(e.pageX - canvasOffset.left);
				var canvasY = Math.floor(e.pageY - canvasOffset.top);

				if(!playGame) {
					playGame = true;
					animate();
				}
				var dX = player.x - canvasX;
				var dY = player.y - canvasY;
				var distance = Math.sqrt((dX*dX) + (dY*dY));
				var padding = 5;

				if(distance < player.radius + padding){
					powerX = player.x;
					powerY = player.y;
					playerSelected = true;
				}
			}
		});
		$(window).mousemove(function(e){
			if(playerSelected){
				var canvasOffset = canvas.offset();
				var canvasX = Math.floor(e.pageX - canvasOffset.left)
				var canvasY = Math.floor(e.pageY - canvasOffset.top);

				var dX = canvasX - player.x;
				var dY = canvasY - player.y;
				var distance = Math.sqrt((dX*dX) + (dY*dY));

				if(distance * playerVelocityDampener < playerMaxAbsVelocity){
					powerX = canvasX;
					powerY = canvasY;
				} else {
					var ratio = playerMaxAbsVelocity/(distance * playerVelocityDampener);
					powerX = player.x + (dX * ratio);
					powerY = player.y + (dY * ratio);
				}
			}

		});
		$(window).mouseup(function(e){
			if(playerSelected) {
				var dX = powerX - player.x;
				var dY = powerY - player.y;
				player.vX = -(dX * playerVelocityDampener);
				player.vY = -(dY * playerVelocityDampener);
				uiScore.html(++score);
			}
			playerSelected = false;
			powerX = -1;
			powerY = -1;
		});

		animate();
	}
	function init(){
		uiStats.hide();
		uiComplete.hide();

		uiPlay.click(function(e){
			e.preventDefault();
			uiIntro.hide();
			startGame();
		});
		uiReset.click(function(e){
			e.preventDefault();
			uiComplete.hide();
			startGame();
		});

	}

	function animate(){
		context.clearRect(0,0,canvasWidth,canvasHeight);
		context.fillStyle = "rgb(100,100,100)";
		context.beginPath();
		context.arc(platformX, platformY,platformOuterRadius, 0, Math.PI*2, true);
		context.closePath();
		context.fill();
		if(playerSelected){
			context.strokeStyle = "rgb(255,255,255)";
			context.lineWidth = 3;
			context.beginPath();
			context.moveTo(player.x, player.y);
			context.lineTo(powerX, powerY);
			context.closePath();
			context.stroke();
		}

		context.fillStyle = "rgb(255,255,255)";
		var asteroidsLength = asteroids.length;
		var deadAsteroids = new Array();
		for(var i=0;i<asteroidsLength;i++){
			var tmpAsteroid = asteroids[i];
			for(var j=i+1;j<asteroidsLength;j++){
				var tmpAsteroidB = asteroids[j];
				var dx = tmpAsteroidB.x - tmpAsteroid.x;
				var dy = tmpAsteroidB.y - tmpAsteroid.y;
				var distance = Math.sqrt((dx * dx) + (dy * dy));
				if(distance < tmpAsteroid.radius + tmpAsteroidB.radius){
					var angle = Math.atan2(dy,dx);
					var sine = Math.sin(angle);
					var cosine = Math.cos(angle);
					var x = 0;
					var y = 0;
					var xb = dx * cosine + dy * sine;
					var yb = dy * cosine - dx * sine;
					var vx = tmpAsteroid.vX * cosine + tmpAsteroid.vY * sine;
					var vy = tmpAsteroid.vY * cosine - tmpAsteroid.vX * sine;
					var vxb = tmpAsteroidB.vX * cosine + tmpAsteroidB.vY * sine;
					var vyb = tmpAsteroidB.vY * cosine - tmpAsteroidB.vX * sine;

					/*vx *= -1;
					 vxb *= -1;*/
					var vTotal = vx - vxb;
					vx = ((tmpAsteroid.mass - tmpAsteroidB.mass) * vx + 2 * tmpAsteroidB.mass * vxb)/(tmpAsteroid.mass + tmpAsteroidB.mass);
					vxb = vTotal + vx;
					xb = x + (tmpAsteroid.radius + tmpAsteroidB.radius);

					tmpAsteroid.x = tmpAsteroid.x + (x * cosine - y * sine);
					tmpAsteroid.y = tmpAsteroid.y + (y * cosine + x * sine);
					tmpAsteroidB.x = tmpAsteroid.x + (xb * cosine - yb * sine);
					tmpAsteroidB.y = tmpAsteroid.y + (yb * cosine + xb * sine);
					tmpAsteroid.vX = vx * cosine - vy * sine;
					tmpAsteroid.vY = vy * cosine + vx * sine;
					tmpAsteroidB.vX = vxb * cosine - vyb * sine;
					tmpAsteroidB.vY = vyb * cosine + vxb * sine;
				}
			}
			tmpAsteroid.x += tmpAsteroid.vX;
			tmpAsteroid.y += tmpAsteroid.vY;

			if(Math.abs(tmpAsteroid.vX) > 0.1){
				tmpAsteroid.vX *= tmpAsteroid.friction;
			} else {
				tmpAsteroid.vX = 0;
			}

			if(Math.abs(tmpAsteroid.vY) > 0.1){
				tmpAsteroid.vY *= tmpAsteroid.friction;
			} else {
				tmpAsteroid.vY = 0;
			}
			if(!tmpAsteroid.player) {
				var dXp = tmpAsteroid.x - platformX;
				var dYp = tmpAsteroid.y - platformY;
				var distanceP = Math.sqrt((dXp*dXp) + (dYp*dYp));
				if(distanceP > platformOuterRadius){
					if(tmpAsteroid.radius > 0){
						tmpAsteroid.radius -= 1;
					} else {
						deadAsteroids.push(tmpAsteroid);
					}
				}
			}
			context.beginPath();
			context.arc(tmpAsteroid.x, tmpAsteroid.y, tmpAsteroid.radius, 0, Math.PI*2, true);
			context.closePath();
			context.fill();
		}
		if(player.x != playerOriginalX && player.y != playerOriginalY){
			if(player.vX == 0 && player.vY == 0){
				resetPlayer();
			} else if(player.x + player.radius < 0) {
				resetPlayer();
			} else if(player.x - player.radius > canvasWidth) {
				resetPlayer();
			} else if(player.y + player.radius < 0) {
				resetPlayer();
			} else if(player.y - player.radius > canvasHeight) {
				resetPlayer();
			}
		}
		var deadAsteroidsLength = deadAsteroids.length;
		if(deadAsteroidsLength > 0){
			for(var di=0;di<deadAsteroidsLength;di++){
				var tmpDeadAsteroid = deadAsteroids[di];
				asteroids.splice(asteroids.indexOf(tmpDeadAsteroid),1);
			}
			var remaining = asteroids.length - 1;
			uiRemaining.html(remaining);
			if(remaining == 0){
				playGame = false;
				uiStats.hide();
				uiWinScore.html(score);
				uiComplete.show();
				$(window).unbind("mousedown");
				$(window).unbind("mouseup");
				$(window).unbind("mousemove");
			}
		}


		if(playGame){
			setTimeout(animate, 30);
		}
	}
	init();
});
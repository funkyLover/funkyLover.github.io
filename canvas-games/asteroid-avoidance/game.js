$(document).ready(function() {
	var canvas = $("#gameCanvas");
	var context = canvas.get(0).getContext("2d");

	var canvasWidth = canvas.width();
	var canvasHeight = canvas.height();

	var playGame;

	var asteroids;
	var numAsteroids;
    var player;
    var score;
    var scoreTimeout;

    var arrowUp = 38;
    var arrowRight = 39;
    var arrowDown = 40;



	var uiIntro = $("#gameIntro"),
		uiStats = $("#gameStats"),
		uiComplete = $("#gameComplete"),
		uiPlay = $("#gamePlay"),
		uiReset = $(".gameReset"),
		uiScore = $(".gameScore");

	var Asteroid = function(x, y, radius, vX){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.vX = vX;
	}

    var Player = function(x, y) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.halfWidth = this.width/2;
        this.halfHeight = this.height/2;
        this.vX = 0;
        this.vY = 0;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.flameLength = 20;

    }

	function startGame() {
		uiScore.html("0");
		uiStats.show();

		playGame = false;
		asteroids = new Array();
        score = 0;
		numAsteroids = 10;
        player = new Player(150, canvasHeight/2);

		var radius,
			x,
			y,
			vX;
		for(var i=0;i<numAsteroids;i++){
			radius = 5+(Math.random()*10);
			x = canvasWidth + radius + Math.floor(Math.random() * canvasWidth);
			y = Math.floor(Math.random() * canvasHeight);
			vX = -5 -(Math.random() * 5);
			asteroids.push(new Asteroid(x, y, radius, vX));
		}
        $(window).keydown(function(e) {
            var keyCode = e.which;
            if(!playGame) {
                playGame = true;
                timer();
                animate();
            }
            if(keyCode == arrowRight) {
                player.moveRight = true;
            } else if(keyCode == arrowUp) {
                player.moveUp = true;
            } else if(keyCode == arrowDown) {
                player.moveDown = true;
            }
        });
        $(window).keyup(function(e) {
            var keyCode = e.which;
            if(keyCode == arrowRight) {
                player.moveRight = false;
            } else if(keyCode == arrowUp) {
                player.moveUp = false;
            } else if(keyCode == arrowDown) {
                player.moveDown = false;
            }
        });
		animate();
	}

	function init() {
		uiStats.hide();
		uiComplete.hide();
		uiPlay.click(function(e) {
			e.preventDefault();
			uiIntro.hide();
			startGame();
		});

		uiReset.click(function(e) {
			e.preventDefault();
			uiComplete.hide();
            $(window).unbind("keyup");
            $(window).unbind("keydown");
            clearTimeout(scoreTimeout);
			startGame();
		});
	}

    function timer() {
        if(score % 10 == 0){
            numAsteroids += 5;
        }
        if(playGame) {
            scoreTimeout = setTimeout(function() {
                uiScore.html(++score);
                timer();
            }, 1000);
        }
    }

	function animate() {
		context.clearRect(0, 0, canvasWidth, canvasHeight);
        var asteroidsLength = asteroids.length;
        for(var i=0;i<asteroidsLength;i++){
            var tmpAsteroid = asteroids[i];
            if(tmpAsteroid.x + tmpAsteroid.radius < 0) {
                tmpAsteroid.radius = 5 + (Math.random() * 10);
                tmpAsteroid.x = canvasWidth + tmpAsteroid.radius;
                tmpAsteroid.y = Math.floor(Math.random() * canvasHeight);
                tmpAsteroid.vX = -5 - (Math.random()* 5);
            }
            var dX = player.x - tmpAsteroid.x;
            var dY = player.y - tmpAsteroid.y;
            var distance = Math.sqrt((dX * dX) + (dY * dY));
            if(distance < player.halfWidth + tmpAsteroid.radius){
                playGame = false;
                clearTimeout(scoreTimeout);
                uiStats.hide();
                uiComplete.show();
                $(window).unbind("keyup");
                $(window).unbind("keydown");
            }
            tmpAsteroid.x += tmpAsteroid.vX;
            context.fillStyle = "rgb(255,255,255)";
            context.beginPath();
            context.arc(tmpAsteroid.x, tmpAsteroid.y, tmpAsteroid.radius, 0, Math.PI*2, true);
            context.closePath();
            context.fill();
        }
        player.vX = 0;
        player.vY = 0;
        if(player.moveRight) {
            player.vX = 7;
        } else {
            player.vX = -7;
        }
        if(player.moveUp) {
            player.vY = -7;
        }
        if(player.moveDown) {
            player.vY = 7;
        }
        player.x += player.vX;
        player.y += player.vY;
        if(player.moveRight) {
            context.save();
            context.translate(player.x-player.halfWidth, player.y);
            if(player.flameLength == 20) {
                player.flameLength = 15;
            } else {
                player.flameLength = 20;
            }
            context.fillStyle = "orange";
            context.beginPath();
            context.moveTo(0, -5);
            context.lineTo(-player.flameLength, 0);
            context.lineTo(0, 5);
            context.closePath();
            context.fill();
            context.restore();
        }
        if(player.x - player.halfWidth < 20) {
            player.x = 20 + player.halfWidth;
        } else if(player.x + player.halfWidth > canvasWidth - 20) {
            player.x = canvasWidth - 20 - player.halfWidth;
        }
        if(player.y - player.halfHeight < 20) {
            player.y = 20 + player.halfHeight;
        } else if(player.y + player.halfHeight > canvasHeight - 20) {
            player.y = canvasHeight - 20 - player.halfHeight;
        }
        context.fillStyle = "rgb(255,0,0)";
        context.beginPath();
        context.moveTo(player.x+player.halfWidth, player.y);
        context.lineTo(player.x-player.halfWidth, player.y-player.halfHeight);
        context.lineTo(player.x-player.halfWidth, player.y+player.halfHeight);
        context.closePath();
        context.fill();
        while(asteroids.length < numAsteroids){
            radius = 5+(Math.random()*10);
            x = canvasWidth + radius + Math.floor(Math.random() * canvasWidth);
            y = Math.floor(Math.random() * canvasHeight);
            vX = -5 -(Math.random() * 5);
            asteroids.push(new Asteroid(x, y, radius, vX));
        }
		if(playGame) {
			requestAnimationFrame(animate);
		}
	}
	init();
});
$(document).ready(function () {
    $(window).keydown(function (e) {
        if (e.which == 88) {
            birdUp();
        }
    })
});
var fps = 60; // frame per s
var mspf = 1000 / fps;
var birdY;  //高度
var birdVY;//垂直速度
var g = 15 / fps; //重力加速度
var id;      //用于获得存放setInterval的返回值


function startGame() {
    birdY = 200;
    birdVY = 0;
    id = setInterval(birdDown, mspf);
}
function birdUp() {
    birdVY = -6;//按下x时改变速度方向并给予基础速度3
}

function birdDown() {
    $('#log').text('高度: ' + Math.round(200 - birdY));
    birdVY += g;
    birdY = birdY + birdVY;
    if (birdY > 600)
        gameOver();
    $("#bird").css({ top: birdY})
}

function gameOver() {
    clearInterval(id);
    alert("game over");
    //startGame();
}
startGame();

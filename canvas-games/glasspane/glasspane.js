$(document).ready(function(){
    var canvas = $("#canvas");
    var context = canvas.get(0).getContext("2d");
    var canvasWidth = canvas.width();
    var canvasHeight = canvas.height();
    var numBall = 100;//100个球
    var colors = ["#CC3399", "#CCCC00","#FF0000","#FF3300", "#FFFF00", "#66FFCC", "#00FF99", "#3300FF","#00CC00"];
    var flag = true;
    //以上颜色选自bootcss.com中网络安全色,纯粹个人喜欢
    var Ball = function(radius, vx, vy, color){
        this.x = 400;
        this.y = 400;
        //每个球的其实出现坐标都一直
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
    }
    var balls = new Array();
    for(var i=0;i<numBall;i++){
        var radius = 15 + (Math.random() * 10);
        var vx = (Math.random() * 20) - 10;
        var vy = (Math.random() * 20) - 10;
        var index = Math.floor(Math.random() * 10);
        var color = colors[index];
        var ball = new Ball(radius, vx, vy, color);
        balls.push(ball);
    }
    function animate(){
        context.clearRect(0, 0, canvasWidth,canvasHeight);
        for(var i=0;i<balls.length;i++){
            var tmpball;
            tmpball = balls[i];
            if(tmpball.x + tmpball.radius > canvasWidth || tmpball.x - tmpball.radius < 0){
                tmpball.vx = -tmpball.vx;
            }
            if(tmpball.y + tmpball.radius > canvasHeight || tmpball.y - tmpball.radius < 0){
                tmpball.vy = -tmpball.vy;
            }
            //简单的检测边界碰撞
            tmpball.x += tmpball.vx;
            tmpball.y += tmpball.vy;
            context.fillStyle = tmpball.color;
            context.beginPath();
            context.arc(tmpball.x, tmpball.y, tmpball.radius, 0, Math.PI*2, true);
            context.closePath();
            context.fill();
        }
        if(flag){
            requestAnimationFrame(animate);
        }
    }

    $("button").click(function(){
        flag = flag ? false : true;
        //按下按钮改变东环状态
        if(flag){
            animate();
        }
    });
    function bounce(){
        //开波!
        for(var i=0;i<balls.length;i++){
            context.fillStyle = balls[i].color;
            context.beginPath();
            context.arc(balls[i].x, balls[i].y, balls[i].radius, 0, Math.PI*2, true);
            context.closePath();
            context.fill();
        }
        animate();
    }
    bounce();
});
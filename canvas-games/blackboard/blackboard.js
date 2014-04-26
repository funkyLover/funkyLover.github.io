$(document).ready(function(){
    var canvas = $("#canvas");
    var context = $("#canvas").get(0).getContext("2d");
    var eraser = $("#eraser");
    $(window).resize(resizeCanvas);
    function resizeCanvas(){
        canvas.attr("width",$(window).get(0).innerWidth);
        canvas.attr("height",$(window).get(0).innerHeight);
        context.fillRect(0,0,canvas.width(),canvas.height());
    }
    resizeCanvas();
    /*
    * 上面代码为根据窗口大小动态调整canvas大小
    * */

    var flag = false;
    var eraserFlag = false;//两个标志值用户判断擦除动作还是涂鸦动作
    var eraserWidth = eraser.width();//擦除块宽
    var eraserHeight = eraser.height();//擦除块高
    var startX;
    var startY;
    eraser.on("click", function(e) {
        //选中擦除块后判断是选择擦除还是选择涂鸦
        eraserFlag = eraserFlag ? false : true;
        if(eraserFlag){
            $("body").css({
                cursor : "url('http://localhost:63342/canvas-games/image/eraser.cur'), default"
            });
        } else if(!eraserFlag){
            $("body").css({
                cursor : "default"
            });
        }
    });

    canvas.on("mousedown", function(e) {
        flag = true;
        startX = e.clientX;
        startY = e.clientY;
    });
    canvas.on("mousemove", function(e) {
        var endX = e.clientX;
        var endY = e.clientY;
        //如果涂鸦标志值为true且擦除标志值为false即可进行涂鸦
        if(flag && !eraserFlag){
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.strokeStyle = "rgb(255,255,255)"
            context.lineWidth = 4;
            context.lineCap = "round";
            context.stroke();
            startX = endX;
            startY = endY;
        }
        //如果涂鸦标志值为true且擦除标志值为true即可进行擦除
        if(flag && eraserFlag) {
            context.fillStyle = "rgb(0,0,0)";
            context.rect(endX, endY, eraserWidth, eraserHeight);
            context.fill();
        }
    });
    canvas.on("mouseup", function(e) {
        flag = false;
    });
    canvas.on("click", function(e) {
        if(!eraserFlag) {
            context.fillStyle = "rgb(255,255,255)"
            context.beginPath();
            context.arc(e.clientX, e.clientY, 2, 0, Math.PI*2, true);
            context.closePath();
            context.fill();
        }
        if(eraserFlag) {
            context.fillStyle = "rgb(0,0,0)";
            context.rect(e.clientX, e.clientY, eraserWidth, eraserHeight);
            context.fill();
        }
    })
});
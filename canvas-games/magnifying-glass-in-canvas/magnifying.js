$(document).ready(function () {
    var canvas = $("#canvas");
    var context = canvas.get(0).getContext("2d");
    loadImage("../image/example.jpg", function() {
        context.drawImage(this, 0, 0);
        magnifying();
    });
    var imgData = null;
    var multiple = 2;//默认放大两倍
    var radius = 80;//放大镜半径

    var range1 = $("#range1");
    range1.change(function(){
        multiple = range1.val();
    });

    /*
    原本打算添加与用户的交互
    可以让用户调整放大镜的尺寸,
    不过尝试了很久,如果在打开网页之前直接修改radius的值的话
    不会出错,
    当时如果是打开网页让用户动态调整时就会出错
    搞不懂
    var range2 = $("#range2");
    range2.change(function(){
        context.putImageData(imgData, preX - (radius + 1), preY - (radius + 1));
        radius = range2.val();
        imgData = null;

    });*/
    function magnifying() {
        var preX;//用于移动鼠标时恢复canvas
        var preY;
        canvas.on("mousemove", function(e) {
            /*
             * 如果鼠标是第一次移入canvas
             * 则根据坐标获取imgData用于将背景图像恢复到canvas中
             * 如果已有imgData,则用putImageData将图像恢复到canvas中
             *
             * */
            if(imgData) {
                context.putImageData(imgData, preX - (radius + 1), preY - (radius + 1));
                imgData = context.getImageData(e.clientX - (radius + 1), e.clientY - (radius + 1), (radius*2 + 2), (radius*2 + 2));
            } else {
                imgData = context.getImageData(e.clientX - (radius + 1), e.clientY - (radius + 1), (radius*2 + 2), (radius*2 + 2));
            }
            /*
             * 在调用getImageData putImageData 和 drawImage的时候
             * 参数与放大镜本身的尺寸50*50并不相等
             * 原本应该只获取放大镜的最小外接矩形,
             * 但是如果获取到的是最小外接矩形的话
             * 绘制时就会出现误差,这是因为忽略了放大镜圆形区域的边界的宽度,
             * 由于实在想不出更好的办法,所以就只能获取比最小外界矩形稍大的矩形区域
             * */
            context.save();
            //保存canvas状态
            context.strokeStyle = "rgb(255,255,255)";
            context.beginPath();
            context.arc(e.clientX, e.clientY, radius, 0, Math.PI*2, true);
            context.closePath();
            context.stroke();
            context.clip();
            //剪辑放大镜区域
            context.drawImage(canvas.get(0), e.clientX - (radius + 1), e.clientY - (radius + 1), (radius*2 + 2), (radius*2 + 2),
                e.clientX - (radius + 1)*multiple + 6*multiple, e.clientY - (radius + 1)*multiple + 6*multiple,
                (radius*2 + 2)*multiple, (radius*2 + 2)*multiple);
            context.restore();
            //恢复canvas状态
            /*
             * 这里赋值给preX 和 preY
             * 这两个坐标用于调用putImageData将图像
             * 恢复canvas中时的定位
             * */
            preX = e.clientX;
            preY = e.clientY;
        });
    }

    function loadImage(url, callback) {
        var img = new Image(); //创建一个Image对象，实现图片的预下载
        img.src = url;

        if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
            callback.call(img);
            return; // 直接返回，不用再处理onload事件
        }
        img.onload = function () { //图片下载完毕时异步调用callback函数。
            callback.call(img);//将回调函数的this替换为Image对象
        };
    }

});


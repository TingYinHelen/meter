let $ = require("jquery");
$.fn.helenMeter = function(opt) {
  let me = this;
  let meter = $(this).data("meter");
  let displayRad = 0;
  let startRad = (2-7/8)*Math.PI;
  let endRad = ((2-1/8)*Math.PI);
  let ctx = me[0].getContext("2d");
  let numValue = 0;
  if (!meter) {
    meter = {};
  }
  meter.value = opt.value;
  meter.maxValue = opt.maxValue;
  meter.render = function() {
    $("#num").html(Math.round(numValue));
    ctx.fillStyle = "#FF0000";
    let arcX = me.width()/2;
    let arcY = me.height();
    ctx.lineWidth = 50;
    //display环形部分
    ctx.strokeStyle = "#65A0DC";
    ctx.beginPath();
    ctx.arc(arcX, (arcY-10), arcX/2, (2-7/8)*Math.PI, displayRad);
    ctx.stroke();
    ctx.strokeStyle = "#d5d5d5";
    ctx.beginPath();
    ctx.arc(arcX, (arcY-10), arcX/2, displayRad, endRad);
    ctx.stroke();
    //底部圆形
    ctx.strokeStyle="#333";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(arcX, (arcY-10), 2.5, 0, 2*Math.PI);
    ctx.stroke();
    //指针
    ctx.fillStyle = "#333";
    let lineLen = 140;
    let x = arcX + lineLen * Math.cos(2*Math.PI-displayRad);
    let y = (arcY-10) - lineLen * Math.sin(2*Math.PI-displayRad);
    let startX = Math.round(arcX + 5 * Math.cos(displayRad - Math.PI / 2));
    let startY = Math.round(arcY - 10 + 2.5 * Math.sin(displayRad - Math.PI / 2));
    let endX = Math.round(arcX + 5 * Math.cos(displayRad + Math.PI / 2));
    let endY = Math.round(arcY - 10 + 5 * Math.sin(displayRad + Math.PI / 2));
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.fill();
  };
  let diff = 0;
  meter.update = function() {
    let valueDif = (endRad - startRad)*(meter.value/meter.maxValue);
    let singleData = valueDif/36;
    let singleNum = meter.value/36;
    let singleDiff = diff.toFixed(2);
    let singleValueDif = valueDif.toFixed(2);
    if (singleDiff !== singleValueDif) {
      numValue += singleNum;
      ctx.clearRect(0, 0, 300, 150);
      diff += singleData;
      displayRad = startRad + diff;
      window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
      meter.render();
      requestAnimationFrame(meter.update);
      return;
    } else {
      return;
    }
  };
  //使用requestAnimationFrame函数进行动画
  requestAnimationFrame(meter.update);
};
$(function(){
  let option = {value: 49684, maxValue: 58729};
  $("#app").helenMeter(option);
})

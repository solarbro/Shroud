//alert("Entering code");

const updateBGColor = false;
const loadAnimation = 2000;
const unloadAnimation = 1000;

const GameState = { LOADING:0, RUNNING:1, UNLOADING:2 };

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d'); //We just need text draw

var time = 0;
var bgColor = new Color(128, 128, 128);

requestAnimationFrame(loop);

function loop(now) {
    //alert("game loop");
    const deltaTime = now - time;
    time += deltaTime;

    updateState(deltaTime);
    drawScene();

    requestAnimationFrame(loop);
}

function drawScene() {
    //alert("drawing");
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = rgbToHex(bgColor);
    ctx.fill();
    ctx.closePath();

    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Time: "+Math.floor(time/1000)+"s", 8, 20); 
}

function updateState(dt) {
    //alert("Updating");
    if(updateBGColor) {
        bgColor = new Color(Math.abs(Math.sin(time * 0.001)) * 255, Math.abs(Math.cos(time * 0.001)) * 255, 0);
    }
}

//Utils
function rgbToHex(rgb) {
    return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
}

function Color(r=0, g=0, b=0) {
    this.r = r;
    this.g = g;
    this.b = b;
}

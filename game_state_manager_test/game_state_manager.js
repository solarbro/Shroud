//alert("Entering code");

const updateBGColor = false;
const loadAnimation = 2000;
const unloadAnimation = 1000;

const GameState = { INIT:0, LOADING:1, RUNNING:2, UNLOADING:3, EXIT:4 };

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d'); //We just need text draw

var time = 0;
var bgColor = new Color(128, 128, 128);
var state = GameState.INIT;
var nextState = state;
var requestExit = false;

requestAnimationFrame(loop);

function loop(now) {
    //alert("game loop");
    const deltaTime = now - time;
    time += deltaTime;

    updateState(deltaTime);
    drawScene();

    //Update state
    state = nextState;
    //If not exiting, request a new frame
    if(state != GameState.EXIT) {
        requestAnimationFrame(loop);
    }
}

function drawScene() {
    //Draw background/clear screen
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = rgbToHex(bgColor);
    ctx.fill();
    ctx.closePath();

    //Scene logic
    switch (state) {
        case GameState.INIT:
            //Probably nothing to do here
        break;
        case GameState.LOADING:
            drawLoadingAnimation(true);
        break;
        case GameState.RUNNING:
            drawGameScene();
        break;
        case GameState.UNLOADING:
            drawLoadingAnimation(false);
        break;
        case GameState.EXIT:
            //Nothing to draw here either
        break;
        default:
            alert("Something terrible happened x_x");
            nextState = GameState.UNLOADING;
            requestExit = true;
        break;
    }

    //Draw clock
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Time: "+Math.floor(time/1000)+"s", 8, 20); 
}

function updateState(dt) {
    //alert("Updating");
    switch(state) {
        case GameState.INIT:
            initializeApp();
        break;
        case GameState.LOADING:
            loadLevel(dt);
        break;
        case GameState.RUNNING:
            runLevel(dt);
        break;
        case GameState.UNLOADING:
            unloadLevel(dt);
        break;
        case GameState.EXIT:
            alert("Exiting Code");
        break;
        default:
            alert("Something bad happened |0_0|");
            nextState = GameState.UNLOADING;
            requestExit = true;
        break;
    }
}

function initializeApp() {
    nextState = GameState.LOADING;
}

var loadTimer = 0;
function loadLevel(dt) {
    loadTimer += dt;
    if(loadTimer >= loadAnimation) {
        //alert("Done loading");
        loadTimer = 0;
        nextState = GameState.RUNNING;
    }
}

function runLevel(dt) {

}

function unloadLevel(dt) {
    loadTimer += dt;
    if(loadTimer >= unloadAnimation) {
        loadTimer = 0;
        if(requestExit) {
            nextState = GameState.EXIT;
        }
        else {
            nextState = GameState.LOADING;
        }
    }
}

function drawLoadingAnimation(loading) {
    //Draw progress bar
    const maxSize = canvas.width / 2;
    const height = 16;
    const locX = (canvas.width - maxSize) / 2;
    const locY = (canvas.height - height) / 2;
    ctx.beginPath();
    ctx.rect(locX, locY, maxSize, height);
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.closePath();
    var maxTime = loadAnimation;
    if(!loading) { maxTime = unloadAnimation; }
    ctx.beginPath();
    ctx.rect(locX, locY, maxSize * (loadTimer / maxTime), height);
    ctx.fillStyle = "#00ff00";
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = "#000000";
    var text = "Loading";
    if(!loading) { text = "Unloading"; }
    ctx.fillText(text, locX, locY + height);
}

function drawGameScene() {

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

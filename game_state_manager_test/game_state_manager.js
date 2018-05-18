//alert("Entering code");

const updateBGColor = false;
const loadAnimation = 2000;
const unloadAnimation = 1000;

const GameState = { INIT:0, LOADING:1, RUNNING:2, UNLOADING:3, EXIT:4 };

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d'); //We just need text draw

var time = 0;
var bgColor = new Color(0, 0, 0);
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
    //Set up UI content
    const buttonW = 30;
    const buttonH = 10;
    const buttonX = (canvas.width - buttonW) / 2;
    buttons[0] = new Button("Go to next level", buttonX, canvas.height / 2, buttonW, buttonH);
    buttons[1] = new Button("Go to previous level", buttonX, canvas.height / 2 + 2 * buttonH, buttonW, buttonH);
    buttons[2] = new Button("Exit game", buttonX, canvas.height / 2 + 4 * buttonH, buttonW, buttonH);
    levelText[0] = "You are an undead, locked in a cell. You look up and spot someone looking down at you from an opening far above. He's clad in a rusty knight's armor bearing the sigil of Astora. After a moment, he drops a key down to you and leaves.";
    levelText[1] = "You use the key to get out of your cell and make your way out of the Undead Asylum. On the way you pass several mindless undead, hollows. As you approach the exit, you hear an angry growl and are attacked by a great beast bearing a massive club.";
    levelText[2] = "You defeated the guardian of the undead asylum. As you make your way out you realize that the asylum is built on an isolated cliff with no way off. Suddenly, a giant crow swoops down and grabs you by the shoulders and flies away.";
    levelText[3] = "The giant crow flies you to Lordran, and drops you off by a shrine. You're wondering why it did that, and what this place is, when you spot someone seated nearby. He looks like a warrior, but has a crestfallen air about him. You approach hoping that he can answer some of your questions.";
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

var level = 0;
function runLevel(dt) {
    switch(level) {
        case 0:
        break;
        case 1:
        break;
        case 2:
        break;
        case 3:
        break;
        default:
        break;
    }
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
    ctx.strokeStyle = "#ffffff";
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

var levelText = [];
var buttons = [];
function drawGameScene() {
    ctx.fillStyle = "#ffffff";
    const maxWidth = canvas.width / 2;
    //ctx.fillText(levelText[level], canvas.width / 4, canvas.height / 4, maxWidth);
    wrapText(levelText[level], canvas.width / 6, canvas.height / 4, canvas.width / 1.5, 16);
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

const ButtonState = { NORMAL:0, HOVERED:1, CLICKED: 2 };
function Button(label, x, y, w, h) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.state = ButtonState.NORMAL;
}

function wrapText(text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }
  
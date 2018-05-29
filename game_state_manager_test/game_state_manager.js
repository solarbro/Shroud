//alert("Entering code");

const updateBGColor = false;
const loadAnimation = 2000;
const unloadAnimation = 1000;

const GameState = { INIT:0, LOADING:1, RUNNING:2, UNLOADING:3, EXIT:4 };
const Key = {BackSpace:8, Tab:9, Enter:13, Shift:16, Ctrl:17, Alt:18, Pause:19, CapsLk:20, Esc:27, PageUp:33, PageDn:34, End:35, Home:36, ArrowLt:37, ArrowUp:38, ArrowRt:39, ArrowDn:40, Insert:45, Delete:46, Key0:48, Key1:49, Key2:50, Key3:51, Key4:52, Key5:53, Key6:54, Key7:55, Key8:56, Key9:57, A:65, B:66, C:67, D:68, E:69, F:70, G:71, H:72, I:73, J:74, K:75, L:76, M:77, N:78, O:79, P:80, Q:81, R:82, S:83, T:84, U:85, V:86, W:87, X:88, Y:89, Z:90, WindowsLt:91, WindowsRt:92, Select:93, Numpad0:96, Numpad1:97, Numpad2:98, Numpad3:99, Numpad4:100, Numpad5:101, Numpad6:102, Numpad7:103, Numpad8:104, Numpad9:105, Multiply:106, Add:107, Subtract:109, Decimal:110, Divide:111, F1:112, F2:113, F3:114, F4:115, F5:116, F6:117, F7:118, F8:119, F9:120, F10:121, F11:122, F12:123, NumLk:144, ScrollLk:145, SemiColon:186, Equal:187, Comma:188, Dash:189, Period:190, ForwardSlash:191, GraveAccent:192, OpenBracket:219, BackSlash:220, CloseBracket:221, SingleQuote:222};
var keyState = {};

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d'); //We just need text draw

function defaultKeyDownFn(e){ console.log("Key down: " + e.keyCode); }
function defaultKeyUpFn(e){ console.log("Key up: " + e.keyCode); }

var time = 0;
var bgColor = new Color(0, 0, 0);
var state = GameState.INIT;
var nextState = state;
var requestExit = false;
var onKeyDown = defaultKeyDownFn;
var onKeyUp = defaultKeyUpFn;

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
    //Set up input handler
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    //Input handlers
    onKeyDown = handleButtonDown;
    onKeyUp = handleButtonUp;
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

//Input
function keyDownHandler(e) {
    onKeyDown(e);
}

function keyUpHandler(e) {
    onKeyUp(e);
}

var rtDown = false;
var ltDown = false;

function handleButtonDown(e) {
    console.log("Key down!");
    if(e.keyCode == Key.ArrowRt) {
        if(!rtDown) { 
            nextState = GameState.UNLOADING;
            ++level;
        }
        rtDown = true;
    }
    else if(e.keyCode == Key.ArrowLt) {
        if(!ltDown && level > 0) {
            nextState = GameState.UNLOADING;
            --level;
        }
        ltDown = true;
    }
}

function handleButtonUp(e) {
    if(e.keyCode == Key.ArrowRt) { rtDown = false; }
    if(e.keyCode == Key.ArrowLt) { ltDown = false; }
}
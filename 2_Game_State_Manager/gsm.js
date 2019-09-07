// Global states
// Keep track of time
var g_time = 0 
// Total number of levels to play
const numLevels = 3;
// Current level
var currentLevel = 0;

// This is where everything begins!
main();

function main() {
    // Start the loop off by calling initialize
    restartGame();
}

const stallDuration = 1000;
var initTime = 0;
function initialize(now) {
    const dt = g_time == 0 ? 0 : now - g_time;
    initTime += dt;
    g_time = now;
    console.log("Initializing: " + g_time);
    if(initTime > stallDuration) {
        initTime = 0;
        // Change state to loading
        updateVisualization(1);
        window.requestAnimationFrame(load);
    } else {
        window.requestAnimationFrame(initialize);
    }
}

var loadTime = 0;
function load(now) {
    const dt = now - g_time;
    loadTime += dt;
    g_time = now;
    console.log("Loading level " + currentLevel + ": " + g_time);
    if (loadTime > stallDuration) {
        // Reset load timer
        loadTime = 0;
        // Change state to updating
        updateVisualization(2);
        window.requestAnimationFrame(update);
    } else {
        // Stay in the load state
        window.requestAnimationFrame(load);
    }
}

const playDuration = 2000;
var playTime = 0;
function update(now) {
    const dt = now - g_time;
    playTime += dt;
    g_time = now;
    console.log("Playing level " + currentLevel + ": " + g_time);
    if (playTime > playDuration) {
        playTime = 0;
        // Change state to unloading
        updateVisualization(3);
        window.requestAnimationFrame(unload);
    } else {
        window.requestAnimationFrame(update);
    }
}

var unloadTime = 0;
function unload(now) {
    const dt = now - g_time;
    unloadTime += dt;
    g_time = now;
    console.log("Unloading level " + currentLevel + ": " + g_time);
    if (unloadTime > stallDuration) {
        unloadTime = 0;
        // Go to the next level
        ++currentLevel;
        // Check how many levels are left to play
        if (currentLevel < numLevels) {
            // Go back to load state
            updateVisualization(1);
            window.requestAnimationFrame(load);
        } else {
            // Change state to exiting
            updateVisualization(4);
            window.requestAnimationFrame(exit);
        }
    } else {
        window.requestAnimationFrame(unload);
    }
}

var exitTime = 0;
function exit(now) {
    const dt = now - g_time;
    exitTime += dt;
    g_time = now;
    console.log("Exiting: " + g_time);
    if (exitTime > stallDuration) {
        exitTime = 0;
        // And we're done! 
        // The loop will no longer continue after this point.
        updateVisualization(5);
        // Notify game exit
        onGameExit();
    } else {
        window.requestAnimationFrame(exit);
    }
}

function restartGame() {
    document.getElementById("resetButton").disabled = true;
    updateVisualization(0);
    window.requestAnimationFrame(initialize);
}

function onGameExit() {
    document.getElementById("resetButton").disabled = false;
    g_time = 0;
    currentLevel = 0;
}

function updateVisualization(state) {
    const stateBoxIds = ["initBox", "loadBox", "playBox", "unloadBox", "exitBox"]
    for (var i = 0; i < 5; ++i){
        var boxId = stateBoxIds[i];
        var box = document.getElementById(boxId)
        box.style.background = i == state ? "green" : "grey";
    }
}
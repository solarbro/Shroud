// Dictionary mapping button names to the actual elements
var g_buttonElements = {};

function main() {
    console.log("Hello, World!");
    document.addEventListener("keydown", function(e) { 
        console.log("Pressed key " + e.key); 
        processInputEvent(e, true);
    });
    document.addEventListener("keyup", function(e) {
        console.log("Released key " + e.key); 
        processInputEvent(e, false);
    });
    document.addEventListener("mousemove", function(e) { console.log("Mouse at (" + e.clientX + ", " + e.clientY + ")"); });
    document.addEventListener("mousedown", function(e) { console.log("Mouse button pressed " + e.button); });
    document.addEventListener("contextmenu", function(e) { e.preventDefault(); });

    createKeyboard();
}

// Helper function to create a button "group"
function createButtonGroup(row) {
    // This basically just creates a div and appends it to the <body> section
    var div = document.createElement("div");
    div.id = "row" + row;
    document.getElementsByTagName("body")[0].appendChild(div);
    // Return the created div so we can add buttons to it
    return div;
}

// Helper function to create a button
function createButton(group, label, width, height) {
    // This creates a button element
    var button = document.createElement("button");
    // Give it a unique ID
    button.id = "button" + label;
    // Specify button type
    button.type = "button";
    // Set styles
    button.style.width = width;
    button.style.height = height;
    button.style.margin = "5px";
    button.style.textAlign = "left";
    button.style.verticalAlign = "middle";
    // Set label
    button.textContent = label;
    // Add the button to the group (div)
    group.appendChild(button);
    // Return the button so we can store it in our dictionary
    return button;
}

function createKeyboard() {
    // We'll create a separate "button group" for each row of keys
    // Function keys row
    var fkeys = createButtonGroup("func")
    g_buttonElements["Escape"] = createButton(fkeys, "Esc", "50px", "25px");
    for (var i = 1; i < 13; ++i) {
        var buttonLabel = "F" + i;
        g_buttonElements[buttonLabel] = createButton(fkeys, buttonLabel, "50px", "25px");
    }
    g_buttonElements["Insert"] = createButton(fkeys, "Ins", "50px", "25px");
    g_buttonElements["Delete"] = createButton(fkeys, "Del", "50px", "25px");
    // Number keys row
    var numkeys = createButtonGroup("num");
    g_buttonElements["`"] = createButton(numkeys, "`", "35px", "35px");
    for (var i = 0; i < 10; ++i) {
        var n = (i + 1) % 10;
        var label = String(n);
        g_buttonElements[label] = createButton(numkeys, label, "50px", "35px");
    }
    g_buttonElements["-"] = createButton(numkeys, "-", "50px", "35px");
    g_buttonElements["="] = createButton(numkeys, "=", "50px", "35px");
    g_buttonElements["Backspace"] = createButton(numkeys, "Backspace", "125px", "35px");
    // qwerty keys row (1st row of alphabet)
    var qwerty = createButtonGroup("qwerty");
    g_buttonElements["Tab"] = createButton(qwerty, "Tab", "65px", "35px");
    // Since the letters are not in alphabetical order, we create a list
    // so that we can easily loop through them when creating the buttons
    const qwertyLetters = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]"];
    for (var i = 0; i < qwertyLetters.length; ++i) {
        g_buttonElements[qwertyLetters[i].toLowerCase()] = createButton(qwerty, qwertyLetters[i], "50px", "35px");
    }
    // Some buttons need to be done separately since they require a weird size
    g_buttonElements["\\"] = createButton(qwerty, "\\", "95px", "35px");
    // asdfgh keys (2nd row of alphabet)
    var asdfgh = createButtonGroup("asdfgh");
    g_buttonElements["CapsLock"] = createButton(asdfgh, "Caps Lock", "75px", "35px");
    // We use a list again
    const asdfghLetters = ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'"];
    for (var i = 0; i < asdfghLetters.length; ++i) {
        g_buttonElements[asdfghLetters[i].toLowerCase()] = createButton(asdfgh, asdfghLetters[i], "50px", "35px");
    }
    g_buttonElements["Enter"] = createButton(asdfgh, "Enter", "145px", "35px");
    // zxcvb keys (last row of alphabet)
    var zxcvb = createButtonGroup("zxcvb");
    g_buttonElements["ShiftLeft"] = createButton(zxcvb, "Shift", "95px", "35px");
    // List of keys
    const zxcvbLetters = ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"];
    for (var i = 0; i < zxcvbLetters.length; ++i) {
        g_buttonElements[zxcvbLetters[i].toLowerCase()] = createButton(zxcvb, zxcvbLetters[i], "50px", "35px");
    }
    g_buttonElements["ShiftRight"] = createButton(zxcvb, "Shift", "65px", "35px");
    // up arrow
    g_buttonElements["ArrowUp"] = createButton(zxcvb, "UP", "50px", "35px");
    //Bottom row
    var bottom = createButtonGroup("button");
    g_buttonElements["ControlLeft"] = createButton(bottom, "Ctrl", "50px", "35px");
    // We can't handle the Fn and Windows keys so we just put a dummy button
    // to pad out our keyboard
    var disabledButtons = createButton(bottom, "Disabled", "95px", "35px");
    disabledButtons.disabled = true;
    disabledButtons.textContent = "";
    // Alt left
    g_buttonElements["AltLeft"] = createButton(bottom, "Alt", "50px", "35px");
    // Space
    g_buttonElements[" "] = createButton(bottom, "Space", "290px", "35px");
    g_buttonElements["AltRight"] = createButton(bottom, "Alt", "50px", "35px");
    // We also can't handle the context menu button so we add another dummy
    // button to pad that out too
    var otherDisabledButtons = createButton(bottom, "Disabled2", "15px", "35px");
    otherDisabledButtons.disabled = true;
    otherDisabledButtons.textContent = "";
    // Right Ctrl
    g_buttonElements["ControlRight"] = createButton(bottom, "Ctrl", "80px", "35px");
    // And then the remaining arrow keys
    g_buttonElements["ArrowLeft"] = createButton(bottom, "<", "50px", "35px");
    g_buttonElements["ArrowDown"] = createButton(bottom, "Dn", "50px", "35px");
    g_buttonElements["ArrowRight"] = createButton(bottom, ">", "50px", "35px");
}

function processInputEvent(e, down) {
    var color = down ? "green" : "";
    if (e.keyCode == 17) { //Ctrl
        var key = "Control" + (e.location == 1 ? "Left" : "Right");
        console.log(g_buttonElements[key]);
        g_buttonElements[key].style.backgroundColor = color;
    } else if (e.keyCode == 16) { //Shift
        var key = "Shift" + (e.location == 1 ? "Left" : "Right");
        g_buttonElements[key].style.backgroundColor = color;
    } else if (e.keyCode == 18) { //Alt
        var key = "Alt" + (e.location == 1 ? "Left" : "Right");
        g_buttonElements[key].style.backgroundColor = color;
    } else { //All the rest
        g_buttonElements[e.key].style.backgroundColor = color;
    }
}

main();
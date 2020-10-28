// each instruction is an array of 4 elements
// 1: The text to be shown (if any)
// 2: The type of format (image, movie, text, scale)
// 3: Any media needed (can be an empty string)
// 4: Whether to show the response div and what to show (false/"td"/"pr")

var nTrials = 60;
var RED = "#e60000";

var instructions = [
    [
        "This experiment requires you to be using a <b>desktop browser</b>. The program should have automatically detected whether you are using a phone or a tablet. If you are using a phone or tablet and it has still allowed you to continue, please reopen the experiment in a desktop browser now.<br>" +
        "If you can only use a tablet or a phone, and are unable to switch to a desktop browser, please quit the experiment and return the HIT.<br>" +
        "If you are on a desktop browser -- great! Click <b>Next</b> to continue.",
        "", "", false, 3
    ],
    [
        "This experiment requires you to be in <b>full screen</b> mode. The experiment will switch to full screen mode when you press the button below.<br>" +
        "Don't worry, we will return your browser to its normal size later. If you do need to leave in the middle, you can press the ESC key -- but please avoid this;<br>" +
        "your responses are only useful to us if you stay in this mode until the end of the experiment.",
        "fullscreen", "", false, 1
    ],
    [
        "<b>Before we begin, follow the instructions below to setup your display.</b><br><hr />" +
        "<p>Please sit comfortably in front of you monitor and outstretch your arm holding a credit card (or a similary sized ID card). <br>" +
        "<p>Adjust the size of the image using the slider until its <strong>width</strong> matches the width of your credit card (or ID card).",
        "scale", "generic_cc.png", false, 1
    ],
    //[
        //"Please adjust contrast with the slider below so that you can see 7 rectangles as well as possible.",
        //"contrast", "contrast.png", false, 0
    //],
    [
        "In this task, you will observe a series of dots move on the screen.<br>",
        "animation", [1, 0, [], "normal"], false, 0
    ],
    // image with target labels (blue)
    [
        "At the beginning of each trial, you will see <b>4</b> of the <b>8</b> dots highlighted in red "+
        `designating them as <span style="color:${RED};"><b>targets</b></span> <span class="query-dot"></span>.<br>` +
        "Shortly after, the red indication will dissapear and the dots will begin to move.<br>" +
        "Your main task is to keep track of the targets as they move.",
        "animation", [2, 0, [], "just_td"], false, 3
    ],
    [
        `Here is an example of a dynamic scene with <span style=\"color:${RED};\">targets</span> <span class="query-dot"></span>.<br>`,
        "animation", [3, 0, [], "normal"], false, 0
    ],
    [
        `In some trials there will be probes <span class="query-probe"></span> , i.e. a small square may appear on one of the dots as can be seen below.`,
        "animation", [2, 0, [[1, 0]], "just_probe"], false, 3
    ],
    [
        `Whenever you see a probe, you have to click <b>SPACEBAR</b> immediately to indicate that you detected the probe <span class="query-probe"></span> .<br>` +
        `The following scene will have a couple of probes - try to spot them and click <b>SPACEBAR</b> when you see them!<br>` + 
        "Click <b>Next</b> to give it a try.",
        "", "", false, 2
    ],
    [
        "",
        "animation", [5, 0, [[1, 48], [2, 130], [3, 80]], "normal"], false, 0
    ],
    [
        `At the end of each trial, you need to select the <span style="color:#e60000"><b>4 targets</b></span> <span class="query-dot"></span>.<br>` + 
        "Click <b>Next</b> to give it a try.",
        "", "", false, 3
    ],
    [
        "",
        "animation", [6, 0, [], "normal"], true, 0
    ],
    [
        `Remember, the main task is to correctly identify the <span style="color:#e60000"><b>4 targets</b></span> <span class="query-dot"></span>.<br>` +
        `The secondary task is to immediately press the <b>SPACEBAR</b> when you see a probe <span class="query-probe"></span>.<br>` +
        "Click <b>Next</b> to try doing the task (<b>SPACEBAR</b> for probes and indicating targets at the end).",
        "", "", false, 3
    ],
    [
        "",
        "animation", [7, 0, [[1, 66], [2, 120]], "normal"], true, 0
    ],
    [
        "Please maintain this arm-length distance from your monitor for the duration of this experiment (20-25 minutes).",
        "", "", false, 2
    ],
    [
        "After a short check to make sure that you have understood the instructions, " +
        "you will have to make your judgments about " + nTrials + " trials.<br>",
        "", "", false, 2
    ],
];

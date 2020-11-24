// each instruction is an array of 4 elements
// 1: The text to be shown (if any)
// 2: The type of format (image, movie, text, scale)
// 3: Any media needed (can be an empty string)
// 4: Whether to show the response div and what to show (false/"td"/"pr")

var EXP_DURATION = 30;
var N_TRIALS = 40;
var RED = "#eb3434";

var instructions = [
    [
        "Hi! This experiment requires you to be using a <b>desktop browser</b>. The program should have automatically detected whether you are using a phone or a tablet. If you are using a phone or tablet and it has still allowed you to continue, please reopen the experiment in a desktop browser now. " +
        "If you can only use a tablet or a phone, and are unable to switch to a desktop browser, please quit the experiment and return the HIT.<br>" +
        "If you are on a desktop browser -- great! Click <b>Next</b> to continue.",
        "", "", false, 5
    ],
    [
        "Thank you for volunteering to help out with our study.<br>" +
        "<ul>" +
        "<li>Please take a moment to adjust your seating so that you can comfortably watch the monitor and use the keyboard/mouse." +
        "<li>Feel free to dim the lights as well." +
        "<li>Close the door or do whatever is necessary to minimize disturbance during the experiment." +
        "<li>Please also take a moment to silence your phone so that you are not interrupted by any messages mid-experiment." +
        "</ul><br>" +
        "Click <b>Next</b> when you are ready to continue.",
        "", "", false, 8
    ],
    [
        "This experiment requires you to be in <b>full screen</b> mode. The experiment will switch to full screen mode when you press the button below.<br>" +
        "Don't worry, we will return your browser to its normal size later. If you do need to leave in the middle, you can press the ESC key -- but please avoid this. Your responses are only useful to us if you stay in this mode until the end of the experiment.<br>"+
        "Click <b>Switch to full screen</b> and then <b>Next</b> to continue.",
        "fullscreen", "", false, 0
    ],
    [
        "The study is designed to be <i>challenging</i>. Sometimes, you'll be certain about what you saw. Other times, you won't be -- and this is okay! Just give your best guess each time.",
        "", "", false, 3
    ],
    [
        `I know it is also difficult to stay focused for so long, especially when you are doing the same thing over and over. But remember, the experiment will be all over in less than ${EXP_DURATION} minutes. Please do your best to remain focused! Your responses will only be useful to me if you remain focused.`,
        "", "", false, 3
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
        "animation", [54, 0, [], "just_movement"], false, 2
    ],
    // image with target labels (blue)
    [
        "At the beginning of each instance of the task, you will see <b>4</b> of the <b>8</b> dots highlighted in red "+
        `designating them as <span style="color:${RED};"><b>targets</b></span> <span class="query-dot"></span>.<br>` +
        "Shortly after, the red indication will dissapear and the dots will begin to move.<br>" +
        "Your main task is to keep track of the targets as they move.<br>" +
        "Click <b>Next</b> to see an example of a dynamic scene with targets.",
        "animation", [55, 0, [], "just_td"], false, 3
    ],
    [
        "",
        "animation", [56, 0, [], "shorter"], false, 0
    ],
    [
        `At the end of each instance of the task, you need to select the <span style="color:#e60000"><b>4 targets</b></span> <span class="query-dot"></span> by clicking on the dots with your mouse.<br>` + 
        `If you make a mistake in your selection, you can deselect by clicking on the dot again.<br>` +
        `When you hover over the dots, you will be able to see which dot you're selecting/deselecting by a pink border around the dot.<br>` +
        `You need to select all 4 targets to be able to progress. If you lost track of some of the targets, just make your best guess as to which dots are targets.<br>` +
        "Click <b>Next</b> to give it a try.",
        "", "", false, 3
    ],
    [
        "",
        "animation", [57, 0, [], "shorter"], true, 0
    ],
    [
        `Importantly, you also have to indicate <b>how <span style="color:${RED}">difficult</span> it is to track the four targets at each moment</b>. ` +
        `You have to do that by pressing the <b>SPACEBAR</b> throughout the movement: <br>` +
        `1) Increasing the <i>frequency</i> of the presses when tracking is getting more difficult.<br>`+
        `2) Reducing the <i>frequency</i> when tracking is getting easier.<br>` +
        `The border of the screen will turn more or less red according to the frequency of your presses, giving you a sense of the difficulty you are reporting at each moment.`,
        "", "", false, 5
    ],
    [
        "In other words, simply press SPACEBAR more frequently when tracking gets difficult, and press SPACEBAR less frequently when tracking gets easier.<br>" +
        "Click <b>Next</b> to give it a try.",
        "", "", false, 2
    ],
    [
        "",
        "animation", [59, 0, [], "shorter"], false, 1
    ],
    [
        `Remember, the <i>main task</i> is to correctly identify the <span style="color:#e60000"><b>4 targets</b></span> <span class="query-dot"></span>.<br>` +
        `The secondary task is to press <b>SPACEBAR</b> throughout the movement to indicate how <b>difficult</b> tracking currently is.<br>` +
        "Click <b>Next</b> to try doing the task (pressing SPACEBAR for difficulty and indicating targets at the end).",
        "", "", false, 3
    ],
    [
        "",
        "animation", [58, 0, [], "normal"], true, 0
    ],
    [
        `Please maintain this arm-length distance from your monitor for the duration of this experiment (${EXP_DURATION-10}-${EXP_DURATION-5} minutes).`,
        "", "", false, 2
    ],
    [
        "After a short check to make sure that you have understood the instructions, " +
        "you will have to make your judgments about " + N_TRIALS + " instances of the task.<br>",
        "", "", false, 2
    ],
];

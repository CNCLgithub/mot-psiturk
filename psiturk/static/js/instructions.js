// each instruction is an array of 4 elements
// 1: The text to be shown (if any)
// 2: The type of format (image, movie, text, scale)
// 3: Any media needed (can be an empty string)
// 4: Whether to show the response div and what to show (false/"td"/"pr")

var EXP_DURATION = 20;
var N_TRIALS = 30;
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
        "animation", [1, [], "just_movement"], false, 2
    ],
    // image with target labels (blue)
    [
        "At the beginning of each instance of the task, you will see some dots highlighted in red "+
        `designating them as <span style="color:${RED};"><b>targets</b></span> <span class="query-dot"></span>.<br>` +
        "Shortly after, the red indication will dissapear and the dots will begin to move.<br>" +
        "Your task is to keep track of the targets as they move.<br>" +
        "Click <b>Next</b> to see an example of a dynamic scene with targets.",
        "animation", [1, [], "just_td"], false, 3
    ],
    [
        "",
        "animation", [1, [], "shorter"], false, 0
    ],
    [
        `At the end of each instance of the task, you need to select the <span style="color:#e60000"><b>targets</b></span> <span class="query-dot"></span> by clicking on the dots with your mouse.<br>` + 
        `To select a bunch of targets faster, you can hold down the left mouse key and drag your cursor over the targets.<br>` +
        `If you make a mistake in your selection, you can deselect by clicking on the dots.<br>` +
        `When you hover over the dots, you will be able to see which dot you're selecting/deselecting by a pink border around the dot.<br>` +
        `You need to select all targets to be able to progress -- it will be indicated how many targets you still need to select at the bottom of the screen.<br>` +
        `If you lost track of some of the targets, just make your best guess as to which dots are targets.<br>` +
        "Click <b>Next</b> to give it a try.",
        "", "", false, 5
    ],
    [
        "",
        "animation", [3, 0, [], "shorter"], true, 0
    ],
    //[
        //`Sometimes during movement there will be probes <span class="query-probe"></span>, i.e. a very dim small square may appear for a very short time on one of the dots as illustrated below.`,
        //"animation", [2, 0, [[1, 0]], "just_probe"], false, 3
    //],
    //[
        //`Whenever you see a probe, you have to press <b>SPACEBAR</b> immediately to indicate that you detected the probe <span class="query-probe"></span>.<br>` +
        //`We recommend that you keep one of your fingers on SPACEBAR throughout the experiment, so that you can press it immediately after seeing the probe.<br>` +
        //`When you press SPACEBAR, a black border will appear to indicate that your press has been registered.<br>` +
        //`The following scene will have a couple of probes - try to spot them and press SPACEBAR when you see them!<br>` + 
        //"Click <b>Next</b> to give it a try.",
        //"", "", false, 2
    //],
    //[
        //"",
        //"animation", [5, 0, [[1, 48], [2, 140], [4, 104], [3, 80]], "shorter"], false, 0
    //],
    //[
        //`Remember, the <i>main task</i> is to correctly identify the <span style="color:#e60000"><b>4 targets</b></span> <span class="query-dot"></span>.<br>` +
        //`The secondary task is to immediately press <b>SPACEBAR</b> whenever you see a probe <span class="query-probe"></span>.<br>` +
        //"Click <b>Next</b> to try doing the task (pressing SPACEBAR for probes and indicating targets at the end).",
        //"", "", false, 3
    //],
    [
        "Click <b>Next</b> to try two more instances of the task.",
        "", "", false, 3
    ],
    [
        "",
        "animation", [4, [], "normal"], true, 0
    ],
    [
        "",
        "animation", [1, [], "normal"], true, 0
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

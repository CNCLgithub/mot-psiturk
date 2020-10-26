// each instruction is an array of 4 elements
// 1: The text to be shown (if any)
// 2: The type of format (image, movie, text, scale)
// 3: Any media needed (can be an empty string)
// 4: Whether to show the response div and what to show (false/"td"/"pr")

var nTrials = 120;
var RED = "#e60000";

var instructions = [
    [
    "In this task, you will observe a series of dots move on the screen.<br>" +
        "Click <b>Next</b> to give it a try.",
    "", "", false, 2
    ],
 [
   "In this task, you will observe a series of dots move on the screen.<br>",
   "animation", [10, 88, [], "normal"], false, 0
 ],
 // image with target labels (blue)
 [
   "At the beginning of each trial, you will see <b>4</b> of the <b>8</b> dots highlighted in red "+
     `designating them as <span style="color:${RED};"><b>targets</b></span> <span class="query-dot"></span>.<br>` +
     "Shortly after, the red indication will dissapear and the dots will begin to move.<br>" +
     "Your main task is to keep track of the targets as they move.",
   "animation", [10, 88, [], "just_td"], false, 3
 ],
 [
   `Here is an example of a dynamic scene with <span style=\"color:${RED};\">targets</span> <span class="query-dot"></span>.<br>`,
   "animation", [10, 98, [], "normal"], false, 0
 ],
 [
   `In some trials there will be a probe <span class="query-probe"></span> , i.e. there will appear a small square on one of the dots as can be seen below.`,
   "animation", [8, 178, [[1, 0]], "just_probe"], false, 3
 ],
 [
    `Whenever you see a probe, you have to click <b>SPACEBAR</b> immediately to indicate that you detected the probe <span class="query-probe"></span> .<br>` +
   `The following scene is with a probe - try to spot it and click <b>SPACEBAR</b> when you see it!<br>` + 
    "Click <b>Next</b> to give it a try.",
   "", "", false, 2
 ],
 [
   "",
   "animation", [9, 129, [[1, 40]], "normal"], false, 0
 ],
 [
   "At the end of each trial, <b>1</b> of the <b>8</b> dots will be highlighted in yellow" +
     ".<br>-> Your first task is to judge whether <i>that dot</i> was one of the <span style=\"color:blue;\">targets</span>.<br>" +
     "-> Your second task is to say whether you saw a <span style=\"color:#e09b88\">probe</span>, i.e. whether one of the dots briefly changed color during movement.",
   "movie", "intro/intro_query_snap.mp4", false, 3
 ],
 [
   "You will be able to record your response by clicking on the check boxes shown below.<br>" +
     "<hr /><i>Note</i>: You will <b>NOT</b> be able to progress to the next trial until you have submitted both responses.",
   "", "", true, 0
 ],
 [
   "Remember, the main task is to say whether highlighted dot is one of the <span style=\"color:blue;\">targets</span>.<br>" + 
   "The secondary task is to say whether you saw a <span style=\"color:#e09b88\">probe</span>.<br>" +
   "Click <b>Next</b> to try recording your response after the video is completed.",
   "", "", false, 3
 ],
 [
   "Remember, the main task is to say whether highlighted dot is one of the <span style=\"color:blue;\">targets</span>.<br>" + 
   "The secondary task is to say whether you saw a <span style=\"color:#e09b88\">probe</span>.<br>",
   "movie", "intro/intro_full.mp4", true, 0
 ],
    [
    "<b>Before we begin, follow the instructions below to setup your display.</b><br><hr />" +
        "<p>Please sit comfortably in front of you monitor and outstretch your arm holding a credit card (or a similary sized ID card). <br>" +
        "<p>Adjust the size of the image using the slider until its <strong>width</strong> matches the width of your credit card (or ID card).",
    "scale", "generic_cc.png", false, 1
    ],
 [
   "Please maintain this arm-length distance from your monitor for the duration of this experiment (20-25 minutes).",
   "", "", false, 2
 ],
 ["After a short check to make sure that you have understood the instructions, " +
   "you will have to make your judgments about " + nTrials + " trials.<br>",
   "", "", false, 2
 ],

];

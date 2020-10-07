// each instruction is an array of 4 elements
// 1: The text to be shown (if any)
// 2: The type of format (image, movie, text, scale)
// 3: Any media needed (can be an empty string)
// 4: Whether to show the response div and what to show (false/"td"/"pr")

var nTrials = 120

var instructions = [
    [
    "In this task, you will observe a series of dots move on the screen.<br>" +
        "Click <b>Next</b> to give it a try.",
    "", "", false, 2
    ],
 [
   "In this task, you will observe a series of dots move on the screen.<br>",
   "movie", "intro/intro_no_label.mp4", false, 0
 ],
 // image with target labels (blue)
 [
   "At the beginning of each trial, you will see <b>4</b> of the <b>8</b> dots highlighted with blue "+
     "dashed circles designating them as <span style=\"color:blue;\"><b>targets</b></span>.<br>" +
     "Shortly after, the blue labels will dissapear and the dots will begin to move.<br>" +
     "Your main task is to keep track of the targets as they move.",
   "movie", "intro/intro_target_designation_snap.mp4", false, 3
 ],
 [
   "Here is an example of a dynamic scene with <span style=\"color:blue;\">targets</span>.<br>",
   "movie", "intro/intro_target_designation.mp4", false, 0
 ],
 [
   "In some trials there will be a <span style=\"color:#e09b88\"><b>probe</b></span>, i.e. the color of one of the dots will change <i>slightly</i> for a very short time as can be seen below.",
   "movie", "intro/intro_probe_snap.mp4", false, 3
 ],
 [
   "The following scene is with a <span style=\"color:#e09b88\">probe</span> - try to spot it!<br>" +
    "Click <b>Next</b> to give it a try.",
   "movie", "intro/intro_probe_snap.mp4", false, 2
 ],
 [
   "The following scene is with a <span style=\"color:#e09b88\">probe</span> - try to spot it!<br>",
   "movie", "intro/intro_probe.mp4", false, 0
 ],
 [
   "At the end of each trial, <b>1</b> of the <b>8</b> dots will be highlighted in yellow" +
     ".<br>-> Your first task is to judge whether <i>that dot</i> was one of the <span style=\"color:blue;\">targets</span>.<br>" +
     "-> Your second task is to say whether you saw a <span style=\"color:#e09b88\">probe</span>, i.e. whether one of the dots briefly changed color during movement.",
   "movie", "intro/intro_td_snap.mp4", false, 3
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

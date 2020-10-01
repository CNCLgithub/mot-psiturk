// each instruction is an array of 4 elements
// 1: The text to be shown (if any)
// 2: The type of format (image, movie, text, scale)
// 3: Any media needed (can be an empty string)
// 4: Whether to show the response div and what to show ("none"/"td"/"pr")

var nTrials = 120

var instructions = [
    [
    "In this task, you will observe a series of dots move on the screen.<br>" +
        "Click <b>Next</b> to give it a try.",
    "", "", "none"
    ],
 [
   "In this task, you will observe a series of dots move on the screen.<br>",
   "movie", "intro/intro_no_label.mp4", "none"
 ],
 // image with target labels (blue)
 [
   "At the beginning of each trial, you will see <b>4</b> of the <b>8</b> dots highlighted with blue "+
     "dashed circles designating them as <span style=\"color:blue;\"><b>targets</b></span>.<br>" +
     "Shortly after, the blue labels will dissapear and the dots will begin to move.<br>" +
     "Your main task is to keep track of the targets as they move.",
   "movie", "intro/intro_target_designation_snap.mp4", "none"
 ],
 [
   "Here is an example of a dynamic scene with <span style=\"color:blue;\">targets</span>.<br>",
   "movie", "intro/intro_target_designation.mp4", "none"
 ],
 [
   "In some trials there will be a <span style=\"color:#e09b88\"><b>probe</b></span>, i.e. the color of one of the dots will change <i>slightly</i> for a very short time as can be seen below.",
   "movie", "intro/intro_probe_snap.mp4", "none"
 ],
 [
   "The following scene is with a <span style=\"color:#e09b88\">probe</span> - try to spot it!<br>" +
    "Click <b>Next</b> to give it a try.",
   "movie", "intro/intro_probe_snap.mp4", "none"
 ],
 [
   "The following scene is with a <span style=\"color:#e09b88\">probe</span> - try to spot it!<br>",
   "movie", "intro/intro_probe.mp4", "none"
 ],
 [
   "In half of the trials, at the end of the trial, <b>1</b> of the <b>8</b> dots will be circled in yellow.<br>" +
     "In this case your task is to judge whether <i>that dot</i> is one of the <span style=\"color:blue;\">targets</span>.<br>",
   "movie", "intro/intro_td_snap.mp4", "none"
 ],
 [
   "In the other half of the trials, no dot will be highlighted at the end.<br>" +
     "In that case your task is simply to say whether or not you saw a <span style=\"color:#e09b88\">probe</span>,<br>" +
     "i.e. whether you saw one of the dots briefly changing color during movement.",
   "movie", "intro/intro_pr_snap.mp4", "none"
 ],
 [
   "Click <b>Next</b> to try recording your response in the first kind of trial<br>"+
    "(judging whether the highlighted dot is a <span style=\"color:blue;\">target</span>).",
   "", "", "none"
 ],
 [
   " ",
   "movie", "intro/intro_td.mp4", "td"
 ],
 [
   "Click <b>Next</b> to try recording your response in the second kind of trial<br>"+
    "(saying whether you saw a <span style=\"color:#e09b88\">probe</span>).",
   "", "", "none"
 ],
 [
   "",
   "movie", "intro/intro_pr.mp4", "pr"
 ],
 [
     "Imporantly, you will not know in advance which kind of trial you are in.<br>" +
     "But remember that the <i>main task</i> is to track the targets in both kinds of trials." +
   "", "", "none"
 ],
    [
    "<b>Before we begin, follow the instructions below to setup your display.</b><br><hr />" +
        "<p>Please sit comfortably in front of you monitor and outstretch your arm holding a credit card (or a similary sized ID card). <br>" +
        "<p>Adjust the size of the image using the slider until its <strong>width</strong> matches the width of your credit card (or ID card).",
    "scale", "generic_cc.png", "none"
    ],
 [
   "Please maintain this arm-length distance from your monitor for the duration of this experiment (20-25 minutes).",
   "text", "", "none"
 ],
 ["After a short check to make sure that you have understood the instructions, " +
   "you will have to make your judgments about " + nTrials + " trials.<br>",
   "", "", "none"
 ],

];

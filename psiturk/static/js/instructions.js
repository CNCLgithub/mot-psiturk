// each instruction is an array of 4 elements
// 1: The text to be shown (if any)
// 2: The type of format (image, movie, text, scale)
// 3: Any media needed (can be an empty string)
// 4: Whether to show the response div (true/false)

var nTrials = 128

var instructions = [
[
  "In this task, you will observe a series of dots move on the screen.<br>" +
    "Click <b>Next</b> to give it a try.",
  "", "", false
],
[
  "In this task, you will observe a series of dots move on the screen.<br>",
  "movie", "intro_dots_moving.mp4", false
],
// image with target labels (red)
[
  "At the beginning of each trial, you will see <b>4</b> of the <b>8</b> dots highlighted <span style=\"color:red;\">red</span> "+
    "designating them as <b>targets</b>.<br>" +
    "Shortly after, the <span style=\"color:red;\">red</span> labels will dissapear and the dots will begin to move.<br>" +
    "Your main task is to keep track of the targets as they move.",
  "image", "labelled_targets.png", false
],
[
  "Here is an example of a dynamic scene with targets.<br>",
  "movie", "intro_targets.mp4", false
],
[
  "In some trials there will be a <b>probe</b>, i.e. the ring color of one of the dots will change for a very short time as can be seen below.",
  "image", "intro_probe_still.png", false
],
[
  "Here is an example of a scene with a probe -- try to spot it!<br>",
  "movie", "intro_probe.mp4", false
],
[
  "At the end of each trial, <b>1</b> of the <b>8</b> dots will be highlighted in <span style=\"color:blue;\">blue</span>" +
    ".<br>-> Your first task is to judge whether <i>that dot</i> was one of the <b>targets</b>.<br>" +
    "-> Your second task is to say whether you saw the <b>probe</b>, i.e. one of the rings changing color during the trial.",
  "", "", false
],
[
  "At the end of each trial, <b>1</b> of the <b>8</b> dots will be highlighted in <span style=\"color:blue;\">blue</span>" +
    ".<br>-> Your first task is to judge whether <i>that dot</i> was one of the <b>targets</b>.<br>" +
    "-> Your second task is to say whether you saw one of the rings changing color.",
  "movie", "intro_full.mp4", false
],
[
  "You will be able to record your response by clicking on the check boxes shown below.<br>" +
    "<hr /><i>Note</i>: You will <b>NOT</b> be able to progress to the next trial until you have submitted both responses.",
  "", "", true
],
[
  "You will <b>NOT</b> be able to record your response until the video has <b>completed</b>",
  "movie", "intro_full.mp4", true
],
[
  "<b>Before we begin, follow the instructions below to setup your display.</b><br><hr />" +
    "<p>Please sit comfortably in front of you monitor and outstretch your arm holding a credit card (or a similary sized ID card). <br>" +
    "<p>Adjust the size of the image using the slider until its <strong>width</strong> matches the width of your credit card (or ID card).",
  "scale", "generic_cc.png", false
],
[
  "Please maintain this arm-length distance from your monitor for the duration of this experiment (20-25 minutes).",
  "text", "", false
],
["After a short check to make sure that you have understood the instructions, " +
  "you will have to make your judgments about " + nTrials + " trials.<br>",
  "", "", false
],

];

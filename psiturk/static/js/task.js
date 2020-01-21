/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

// Names of elements used in the experiment
var MOVIESCREEN = "moviescreen";
var DRAGBOX = "dragbox"
var NEXTBUTTON = "nextbutton";
var PROGRESS = "progress";
var RELOAD = "reloadbutton";
var INS_INSTRUCTS = "instruct";
var INS_HEADER = "instr_header";
var PAGESIZE = 500;

var IMG_TIME = 100 // time to display images in ms

var SCALE_COMPLETE = false; // users do not need to repeat scaling

// All pages to be loaded
var pages = [
  "instructions/instructions.html",
  "instructions/instruct-1.html",
  "quiz.html",
  "restart.html",
  "stage.html",
  "postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
  "instructions/instruct-1.html"
];


// used to shuffle the array of trials
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};


var black_div = function() {
  return '<div style=\"background-color: black; width: 1280px; height: 720px;\"></div>'
}

var cut2black = function() {
  var sc = document.getElementById(MOVIESCREEN);
  sc.innerHTML = make_img("mask.png", true, false) + "<br>";
}

var make_img = function(imgname, is_intro, freeze) {
  if (typeof(is_intro) === 'undefined') is_intro = false;
  if (typeof(freeze) === 'undefined') freeze = true
  var mcl = "movieobj"
  if (is_intro) {
    mcl = "movieobj_sm"
  }
  var r = "<image id=\"thisimg\" "
  if (freeze) {
    r += "onload=\"cut2black()\" "
  }
  r += `class="${mcl}" src="static/data/${imgname}" alt="Movie" style="height: auto; width: ${PAGESIZE}">`
  return r
};

var make_mov = function(movname, is_intro, has_ctr) {
  if (typeof(is_intro) === 'undefined') is_intro = false;
  if (typeof(has_ctr) === 'undefined') has_ctr = true;
  var mcl = "movieobj";
  var ctr = "";
  var fmovnm = "static/data/movies/" + movname;
  var foggnm = fmovnm.substr(0, fmovnm.lastIndexOf('.')) + ".ogg";
  var ret = `<video id="thisvideo" class="${mcl}\${ctr}" width="${PAGESIZE}px" height="${PAGESIZE}px">` +
      `<source src="${fmovnm}" type="video/mp4">` +
      `<source src="${foggnm}" type="video/ogg">` +
      `Your browser does not support HTML5 mp4 video.</video>`;
  return ret;
};

/********************
 * HTML manipulation
 *
 * All HTML files in the templates directory are requested
 * from the server when the PsiTurk object is created above. We
 * need code to get those pages from the PsiTurk object and
 * insert them into the document.
 *
 ********************/

function allowNext() {
  document.getElementById(NEXTBUTTON).disabled = false;
}

function makeCheckBox() {

  return "<div class=\"card\"" +
    "<form id=\"trial_response\" action=\"#\">" +
    "Is the highlighted dot a target?" +
    "<label class=\"radio\"><input id=\"yes_box\" type=\"radio\" name=\"radios\">" +
    "<span class=\"outer\"><span class=\"inner\"></span></span>Yes</label>" +
    "<label class=\"radio\"><input id=\"nay_box\" type=\"radio\" name=\"radios\">" +
    "<span class=\"outer\"><span class=\"inner\"></span></span>No</label>" +
    "</form>" +
    "</div>" +
    "<hr />"
};

function scaleSlider() {
  return "<span id=\"qspan\">Move the slider to match the width of your card</span>"+
    "<input id=\"scale_slider\" type=\"range\" min=\"0\" max=\"100\" default=\"50\" width=\"1500\"/>";
};


function responseSlider() {
  return "<span id=\"qspan\">How difficult is this trial? </span>"+
    "<input id=\"response_slider\" type=\"range\" min=\"0\" max=\"100\" default=\"50\" width=\"1500\"/>" +
    "<div id=\"lab-left\"><i>Easy</i></div><div id=\"lab-right\"><i>I Guessed</i></div>";
};


class Page {

  // Handles media presentation and scale handling.

  /*******************
   * Public Methods  *
   *******************/
  constructor(text, mediatype, mediapath, show_response = false) {
    // page specific variables
    this.text = text;
    this.mediatype = mediatype;
    this.mediapath = mediapath;
    this.mask = false;
    this.pageSize = PAGESIZE;
    // html elements
    this.instruct = document.getElementById(INS_INSTRUCTS);
    this.scale_region = document.getElementById("scale_region");
    this.response = document.getElementById("response_region");
    this.showResponse = show_response;
    this.next = document.getElementById(NEXTBUTTON);
    this.next.disable = true;
    this.mvsc = document.getElementById(MOVIESCREEN);
    this.reloadbtn = document.getElementById(RELOAD);
  }

  // Loads content to the page
  // The `callback` argument can be used to handle page progression
  // or subject responses
  showPage(callback) {
    // create callback to progress when done
    this.next.onclick = function() {
      callback();
    };
    this.addText();
    // If there is a slider, then progression is contingent
    // on complete presentation of the media.
    this.addMedia();
  }

  // Returns the placement of each color scaled from [0, 1]
  retrieveResponse() {
    var form = document.getElementById("trial_response");
    return form.value
  }


  /************
   * Helpers  *
   ***********/

  // injects text into page's inner html
  addText() {
    if (this.text !== "") {
      this.instruct.innerHTML = this.text;
    }
  }

  // formats html for media types
  addMedia() {
    if (this.mediatype === 'image') {
      this.mvsc.innerHTML = make_img(this.mediapath, true, false) + "<br>";
      this.showImage();
    } else if (this.mediatype === 'movie') {
      this.mvsc.innerHTML = make_mov(this.mediapath, true);
      this.showMovie();
    } else if (this.mediatype == 'scale'){
      this.mvsc.innerHTML = make_img(this.mediapath, true, false) + "<br>";
      this.scalePage();
    } else {
      this.mvsc.innerHTML = "";
      this.showImage();
    }
  };

  scalePage() {
    if (SCALE_COMPLETE) {
      this.mvsc.innerHTML = "";
      this.instruct.innerHTML = "You have already scaled your monitor";
      this.showImage();

    } else {
      var next = this.next
      next.disabled = true;
      this.scale_region.innerHTML = scaleSlider();
      var slider_value = document.getElementById("scale_slider");
      var scale_img = document.getElementById("thisimg");
      slider_value.oninput = function(e) {
        PAGESIZE = (e.target.value / 50.0) * 500;
        scale_img.width = `${PAGESIZE}px`;
        scale_img.style.width = `${PAGESIZE}px`;
        next.disabled = false;
        SCALE_COMPLETE = true;
        console.log(SCALE_COMPLETE);
      }
    }
  }

  addResponse() {
    this.response.innerHTML = makeCheckBox() + responseSlider();
  }

  // The form will automatically enable the next button
  enableResponse() {
    var slider = document.getElementById("response_slider");
    slider.disabled = true;
    slider.onmousedown = function() {
      allowNext();
    };
    var form = document.getElementById("trial_response");
    var yes = document.getElementById("yes_box");
    yes.value = true;
    yes.onclick = function() {
      form.value = true;
      slider.disabled = false;
    }
    var no = document.getElementById("nay_box");
    no.value = false;
    no.onclick = function() {
      form.value = false;
      slider.disabled = false;
    }
    // var form = document.getElementById("trial_response");
    // form.disabled = false;
  }

  disableResponse() {
    document.getElementById("trial_response").disabled = true;
    document.getElementById("response_slider").disabled = true;
  }

  clearResponse() {
    this.response.innerHTML = "";
    this.scale_region.innerHTML = "";
  }

  // plays movie
  showMovie() {

    this.next.disabled = true;
    var sc = document.getElementById(MOVIESCREEN);
    var mov = document.getElementById('thisvideo');

    let me = this;

    // The "next" botton will only activate after recording a response
    if (this.showResponse) {
      var movOnEnd = function() {
        if (me.mask) {
          cut2black();
        }
        me.addResponse();
        me.enableResponse();
      };
    } else {
      // Otherwise allow next once movie is complete
      var movOnEnd = function() {
        if (me.mask) {
          cut2black();
        }
        me.next.disabled = false;
      };
    }
    mov.oncanplaythrough = function() {
      mov.play();
    };
    mov.onended = movOnEnd;
  }

  showImage() {
    if (this.showResponse) {
      this.next.disabled = true;
      this.addResponse();
      this.enableResponse();
    } else {
      this.next.disabled = false;
    }
  }
};

/****************
 * Instructions  *
 ****************/

var InstructionRunner = function(condlist) {
  psiTurk.showPage('instructions/instructions.html');

  var instruct = document.getElementById(INS_INSTRUCTS);
  var dragbox = document.getElementById(DRAGBOX);
  var mvsc = document.getElementById(MOVIESCREEN);
  var reloadbtn = document.getElementById(RELOAD);
  var nTrials = condlist.length;

  // each instruction is an array of 4 elements
  // 1: The text to be shown (if any)
  // 2: The type of format (image, movie, text, scale)
  // 3: Any media needed (can be an empty string)
  // 4: Whether to show the response div (true/false)

  var instructions = [
    // [
    //   "In this task, you will observe a series of dots move on the screen.<br>",
    //   "image", "test.png", false
    // ],
    // // image with target labels (red)
    // [
    //   "At the beginning of each trial, you will see <b>4</b> of the <b>8</b> dots highlighted <span style=\"color:red;\">red</span> "+
    //     "designating them as <b>targets</b>.<br>" +
    //     "Shortly after, the <span style=\"color:red;\">red</span> labels will dissapear and the dots will begin to move.<br>" +
    //   "image", "test.png", false
    // ],
    // [
    //   "Your task is to keep track of the <b>targets</b> as they move throughout the scene.<br>",
    //   "movie", "test.mp4", false
    // ],
    // [
    //   "At the end of each trial, <b>1</b> of the <b>8</b> dots will be highlighted in <span style=\"color:blue;\">blue</span>" +
    //     ".<br> Your job is to judge whether that dot was one of the <b>targets</b>.",
    //   "movie", "test.mp4", false
    // ],
    // [
    //   "You will be able to record your response by clicking on one of the two check boxes shown below." +
    //     " In addition, you will be asked to rate the difficulty of the trial on a slider." +
    //     "<hr /><i>Note</i>: You will <b>NOT</b> be able to progress to the next trial until you have submitted both responses.",
    //   "", "", true
    // ],
    // [
    //   "You will be able to record your response by clicking on one of the two check boxes shown below. <br>" +
    //     "<hr /><i>Note</i>: You will <b>NOT</b> be able to record your response until the video has <b>completed</b>",
    //   "movie", "test.mp4", true
    // ],
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
    // ["After a short check to make sure that you have understood the instructions, " +
    //   "you will have to make your judgments about " + nTrials + " trials.<br>",
    //   "", "", false
    // ],

  ];
  var ninstruct = instructions.length;

  // Plays next instruction or exits.
  // If there is another page, it is reach via callback in `page.showPage`
  var do_page = function(i) {

    if (i < ninstruct) {
      var page = new Page(...instructions[i]);
      page.showPage(function() {
        page.clearResponse();
        do_page(i + 1);
      });
    } else {
      end();
    }
  };

  var end = function() {
    psiTurk.finishInstructions();
    quiz(function() {
        InstructionRunner(condlist)
      },
      function() {
        currentview = new Experiment(condlist)
      })
  };

  // start the loop
  do_page(0);
};


/*********
 * Quiz  *
 *********/

// Describes the comprehension check
var loop = 1;
var quiz = function(goBack, goNext) {
  function record_responses() {
    var allRight = true;
    $('select').each(function(i, val) {
      psiTurk.recordTrialData({
        'phase': "INSTRUCTQUIZ",
        'question': this.id,
        'answer': this.value
      });
      if (this.id === 'taskDef' && this.value != 'b') {
        allRight = false;
      } else if (this.id === 'trueFalse' && this.value != 'b') {
        allRight = false;
      }
      // }else if(this.id==='densOrder' && this.value != 'second'){
      //     allRight = false;
      // }
    });
    return allRight
  };

  psiTurk.showPage('quiz.html')
  $('#continue').click(function() {
    if (record_responses()) {
      // Record that the user has finished the instructions and
      // moved on to the experiment. This changes their status code
      // in the database.
      psiTurk.recordUnstructuredData('instructionloops', loop);
      psiTurk.finishInstructions();
      console.log('Finished instructions');
      // Move on to the experiment
      goNext();
    } else {
      // Otherwise, replay the instructions...
      loop++;
      psiTurk.showPage('restart.html');
      $('.continue').click(
        function() {
          psiTurk.doInstructions(instructionPages, goBack)
        });
    }
  });
};

/**************
 * Experiment *
 **************/

var Experiment = function(triallist) {
  psiTurk.showPage('stage.html');
  var triallist = shuffle(triallist);
  var screen = document.getElementById(MOVIESCREEN);
  var button = document.getElementById(NEXTBUTTON);
  var prog = document.getElementById(PROGRESS);
  var reloadbtn = document.getElementById(RELOAD);
  var curidx = 0;
  var starttime = -1;

  // uses `Page` to show a single trial
  var runTrial = function(curIdx) {
    // We've reached the end of the experiment
    if (curIdx === triallist.length) {
      end();
    }
    var curtrial = triallist[curIdx];
    show_progress(curIdx);
    var flnm = curtrial[0];
    var colors = map_colors(curtrial[1]);

    starttime = new Date().getTime();
    var pg = new Page("", "movie", flnm, colors, mask = true);
    // `Page` will record the subject responce when "next" is clicked
    // and go to the next trial
    pg.showPage(
      function() {
        register_response(pg, curIdx);
        runTrial(curIdx + 1);
      }
    );
  };

  // Record the subject's response for a given trial.
  var register_response = function(trialPage, cIdx) {
    var rt = new Date().getTime() - starttime;
    var ch = trialPage.responseValue();
    // Records as [trialname, choice of mass, reaction time]
    psiTurk.recordTrialData({
      'TrialName': triallist[cIdx][0],
      'Rating': ch,
      'ReactionTime': rt,
      'IsInstruction': false,
      'TrialOrder': cIdx
    });
    // Clears slider from screen
    trialPage.clearReponse();
  };

  var end = function() {
    psiTurk.saveData();
    new Questionnaire();
  };

  var show_progress = function(cIdx) {
    prog.innerHTML = (cIdx + 1) + " / " + (triallist.length);
  };

  // Let's begin!
  runTrial(0);
};



/****************
 * Questionnaire *
 ****************/

var Questionnaire = function() {

  var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

  record_responses = function() {

    psiTurk.recordTrialData({
      'phase': 'postquestionnaire',
      'status': 'submit'
    });

    $('textarea').each(function(i, val) {
      psiTurk.recordUnstructuredData(this.id, this.value);
    });
    $('select').each(function(i, val) {
      psiTurk.recordUnstructuredData(this.id, this.value);
    });

  };

  prompt_resubmit = function() {
    document.body.innerHTML = error_message;
    $("#resubmit").click(resubmit);
  };

  resubmit = function() {
    document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
    reprompt = setTimeout(prompt_resubmit, 10000);

    psiTurk.saveData({
      success: function() {
        clearInterval(reprompt);
        psiTurk.computeBonus('compute_bonus', function() {
          finish()
        });
      },
      error: prompt_resubmit
    });
  };

  // Load the questionnaire snippet
  psiTurk.showPage('postquestionnaire.html');
  psiTurk.recordTrialData({
    'phase': 'postquestionnaire',
    'status': 'begin'
  });

  $("#next").click(function() {
    record_responses();
    psiTurk.saveData({
      success: function() {
        psiTurk.completeHIT(); // when finished saving compute bonus, the quit
      },
      error: prompt_resubmit
    });
  });


};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/

$(window).load(function() {

  // Load in the conditions
  // TEMPORARY

  function do_load() {
    $.ajax({
      dataType: 'json',
      url: "static/data/condlist.json",
      async: false,
      success: function(data) {
        condlist = shuffle(data[0]);
        InstructionRunner(condlist);
      },
      error: function() {
        setTimeout(500, do_load)
      },
      failure: function() {
        setTimeout(500, do_load)
      }
    });
  };

  do_load();

});

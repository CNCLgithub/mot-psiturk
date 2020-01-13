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
  console.log("here");
  document.getElementById(NEXTBUTTON).disabled = false;
  console.log(document.getElementById(NEXTBUTTON).disable);
}

function makeCheckBox() {

  return "<form action=\"\" method=\"post\" id=\"trial_response\">" +
    "<input type=\"radio\" name=\"yes_box\" value=true onClick=\"allowNext()\"/> Yes" +
    "<input type=\"radio\" name=\"nay_box\" value=false onClick=\"allowNext()\"/> No" +
    "</form>"

};

function makeSlider() {
  return "<span id=\"qspan\">Move the slider to match your card</span>"+
    "<input id=\"scale_slider\" type=\"range\" min=\"0\" max=\"100\" default=\"50\" width=\"1500\"/>";
}


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
    this.response.innerHTML = makeSlider();
    var slider_value = document.getElementById("scale_slider");
    var scale_img = document.getElementById("thisimg");
    slider_value.oninput = function(e) {
      PAGESIZE = (e.target.value / 50.0) * 500;
      scale_img.width = `${PAGESIZE}px`;
      scale_img.style.width = `${PAGESIZE}px`;
    }

  }

  addResponse() {
    this.response.innerHTML = makeCheckBox();
  }

  // The form will automatically enable the next button
  enableResponse() {
    var form = document.getElementById("trial_response");
    form.disabled = false;
  }

  disableResponse() {
    document.getElementById("trial_response").disabled = true;
  }

  clearResponse() {
    this.response.innerHTML = "";
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


  var instructions = [
    ["Instructions go here.",
      "scale", "test.png", false
    ],
    ["Instructions go here.",
      "movie", "test.mp4", false
    ],
    // ["In this task, you will observe <b>three</b> colored balls interact on a ramp.<br>" +
    //   "The color of each ball indicates its weight. " +
    //   "In other words, two balls with the <b>same</b> color have the same mass.<br>" +
    //   "Your job is to compare the weight of each ball in association with its color.",
    //   "none", "none", []
    // ],

    // ["A ball can be colored either <span style=\"color:red;\">red</span>, <span style=\"color:blue;\">blue</span>, or <span style=\"color:green;\">green</span>.<br>" +
    //   "However, the relationship between a particular color and weight can change between scenes.<br>" +
    //   "<br>For example, the <span style=\"color:red;\">red</span> ball on the left is heavier than <span style=\"color:blue;\">blue</span>.<br>" +
    //   "<hr /><i>Note</i>: After the video ends, please press the 'Next' button at the bottom of the screen to move on.",
    //   "movie", "intro_1_t-900.mp4", []
    // ],

    // ["In this case, the <span style=\"color:blue;\">blue</span> ball is heavier than the <span style=\"color:red;\">red</span> one.",
    //   "movie", "intro_2_t-700.mp4", []
    // ],

    // ["To register your decision you will see a scale, like the one below, that will ask you to order the weight of each color<br> " +
    //   "<b>You must drag all the colors into the scale in order to progress.</b><br>" +
    //   "Please try this out before continuing.",
    //   "none", "none", ["red", "blue", "green"]
    // ],

    // ["<b>Not</b> all trials will have all three colors.<br>" +
    //   "The slider will reflect the number of unique colors present in the movie.",
    //   "none", "none", ["blue", "green"]
    // ],

    // ["As soon as the movie ends, the scale will appear beneath it.<br>" +
    //   "You can then drag the balls onto the scale to make your judgments of their weight.<br>" +
    //   "After you are done, press `Next' to move on.",
    //   "movie", "intro_1_t-335.mp4", ["red", "blue", "green"]
    // ],

    // ["Finally, the lights will shut off during or after objects are in motion.<br>" +
    //   "Here, the light go dark after the first collision.<br>" +
    //   "<hr /><i>Note</i>: Do <b>NOT</b> refresh your page. In each trial, you will only observe the video once",
    //   "movie", "intro_1_t-335.mp4", ["red", "blue", "green"], true
    // ],

    // ["To help you keep track of balls associated with each color, the left most ball will always" +
    //   " be <span style=\"color:red;\">red</span>, followed by <span style=\"color:blue;\">blue</span>" +
    //   " and finally, <span style=\"color:green;\">green</span><br>" +
    //   "In addition, the scale will also match this order except from top to bottom" +
    //   "<hr /><i>Note</i>: In the experiment, the video will cut to black, not freeze.",
    //   "movie", "intro_1_t-335.mp4", ["red", "blue", "green"]
    // ],

    // ["Here is the same movie but with the lights shutting off.",
    //   "movie", "intro_1_t-335.mp4", ["red", "blue", "green"], true
    // ],

    // ["If there are several balls with the same color it is possible to have a  <span style=\"color:red;\">red</span>" +
    //   " ball after a <span style=\"color:blue;\">blue</span> one, however, the slider will still preserve the order" +
    //   " showing the <span style=\"color:red;\">red</span> at the top",
    //   "movie", "intro_2_t-700.mp4", ["red", "blue"], true
    // ],

    // ["After a short check to make sure that you have understood the instructions, " +
    //   "you will have to make your judgments about " + nTrials + " trials.<br>",
    //   "none", "none", []
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
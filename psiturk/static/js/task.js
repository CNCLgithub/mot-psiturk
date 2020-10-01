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
var FULL_CONTAINER= "full-container"
var PAGESIZE = 300;

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

// used to pause execution
const sleep = milliseconds => { 
  return new Promise(resolve => setTimeout(resolve, milliseconds)); 
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
  r += `class="${mcl}" src="static/data/${imgname}" alt="Movie" style="height: auto; width: ${PAGESIZE}px">`
  return r
};

var make_mov = function(movname, is_intro, has_ctr) {
  if (typeof(is_intro) === 'undefined') is_intro = false;
  if (typeof(has_ctr) === 'undefined') has_ctr = true;
  var mcl = "movieobj";
  var ctr = "";
  var fmovnm = "static/data/movies/" + movname;
  var foggnm = fmovnm.substr(0, fmovnm.lastIndexOf('.')) + ".ogg";

  var ret = `<video id="thisvideo" class="${mcl}\${ctr}" width="${PAGESIZE*1.05}px" height="${PAGESIZE*1.05}px">` +
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
  var button = document.getElementById(NEXTBUTTON)
  button.disabled = false;
  button.style.display = "block";
}

class Page {

  // Handles media presentation and scale handling.

  /*******************
   * Public Methods  *
   *******************/
  constructor(text, mediatype, mediapath, show_response = "none", mov_angle = 0) {
    // page specific variables

    this.text = text;
    this.mediatype = mediatype;
    this.mediapath = mediapath;
    this.mov_angle = mov_angle;
    this.mask = false;
    this.pageSize = PAGESIZE;
    // html elements
    this.instruct = document.getElementById(INS_INSTRUCTS);
    this.scale_region = document.getElementById("scale_region");
    this.response_region = document.getElementById("response_region");
    this.showResponse = show_response;
    this.next = document.getElementById(NEXTBUTTON);
    this.next.disable = true;
    this.next.style.display = "none";
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
        if (this.mediatype != 'movie') {
            // sleeping for 3.5s to make people not rush through instructions
            sleep(3500).then(() => { 
                document.getElementById(NEXTBUTTON).style.display = 'block';
            });
        }
  }

  retrieveResponse() {
    var response_form = document.getElementById("response_form");
    return response_form.value
  }


  /************
   * Helpers  *
   ***********/

  // injects text into page's inner html
  addText() {
    if (this.text != "") {
      this.instruct.innerHTML = this.text;
    }
  }

  // formats html for media types
  addMedia() {
    if (this.mediatype != 'movie') {
      document.getElementById("moviescreen").style.backgroundColor = 'white';
    }
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
      document.getElementById("moviescreen").style.height = '0px';
      this.mvsc.innerHTML = "";
      this.showImage();
    }
  };

  addResponse() {
    document.getElementById("response_region").style.display = 'block';
    document.getElementById("response_form").style.display = 'block';
    
    console.log("response kind", this.showResponse);
    if (this.showResponse == 'td') {
        document.getElementById("td_question").style.display = 'block';
    } else if (this.showResponse == 'pr') {
        document.getElementById("pr_question").style.display = 'block';
    }
    
    this.next.style.display = 'block';
  }

  // The form will automatically enable the next button
  enableResponse() {

    var yes = document.getElementById("yes");
    var no = document.getElementById("no");

    var response_form = document.getElementById("response_form");

    yes.onclick = function() {
        response_form.value = true;
        allowNext();
    }
    no.onclick = function() {
        response_form.value = false;
        allowNext();
    }
  }

  clearResponse() {
    document.getElementById("response_region").style.display = 'none';
    document.getElementById("td_question").style.display = 'none';
    document.getElementById("pr_question").style.display = 'none';

    document.getElementById("yes").checked = false;
    document.getElementById("no").checked = false;

    if (this.mediatype == 'scale') {
        document.getElementById("scale_region").style.display = 'none';
    }
    //if (this.mediatype == 'movie') {
        //document.getElementById("moviescreen").style.backgroundColor = 'white';
    //}
    //document.getElementById("response_slider").value = document.getElementById("response_slider").defaultValue;
  }

  scalePage() {

    let me = this;

    if (SCALE_COMPLETE) {
      this.mvsc.innerHTML = "";
      this.instruct.innerHTML = "You have already scaled your monitor";
      this.showImage();
    } else {
      document.getElementById("scale_region").style.display = 'block';
      var slider_value = document.getElementById("scale_slider");
      var scale_img = document.getElementById("thisimg");
        slider_value.value = PAGESIZE/500*50;
        slider_value.oninput = function(e) {
            PAGESIZE = (e.target.value / 50.0) * 500;
            scale_img.width = `${PAGESIZE}px`;
            scale_img.style.width = `${PAGESIZE}px`;
            me.scaleMoviescreen(0.6);
            SCALE_COMPLETE = true;
            me.addResponse();
            document.getElementById('response_form').style.display = 'none';
      }
    }
  }

  scaleMoviescreen(scale = 1) {
    var width = PAGESIZE * 1.05;
    console.log("width, height of the movie screen: ", 1.5*width);
    this.mvsc.style.width = `${1.5*width}px`;
    this.mvsc.style.height = `${scale*1.5*width}px`;
    this.mvsc.style.padding = `${0.25*width}px`;
    this.mvsc.style.margin = '0 auto';
  }

  // plays movie
  showMovie() {

    this.next.disabled = true;
    var sc = document.getElementById(MOVIESCREEN);
    var mov = document.getElementById('thisvideo');

    let me = this;

    // The "next" botton will only activate after recording a response
    if (this.showResponse != 'none') {
      this.next.style.display = "none";
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
        sleep(2000).then(() => { 
            me.addResponse();
            document.getElementById('response_form').style.display = 'none';
            me.next.style.display = "block";
        });
        me.next.disabled = false;
      };
    }

    mov.oncanplaythrough = function() {
      mov.play();
    };
    mov.onended = movOnEnd;
    
    // overriding the full container width
    document.getElementById(FULL_CONTAINER).style.width = "100%";
    
    // making sure there is space for rotation
    // (scaling according to PAGESIZE)
    this.scaleMoviescreen();

    // changing to the color of the video background
    this.mvsc.style.background = '#6c7ff0';

    // random rotation
    console.log("rotation angle: ", this.mov_angle);
    mov.style.transform = `rotate(${this.mov_angle}deg)`;
    this.mvsc.style.display = 'block';
  }

  showImage() {
    if (this.showResponse != 'none') {
      this.next.disabled = true;
      this.addResponse();
      this.enableResponse();
    } else {
      this.next.disabled = false;
          console.log("show image");
        sleep(2000).then(() => {
            this.addResponse();
            document.getElementById('response_form').style.display = 'none';
        });
    }


    if (this.mediatype == 'scale') {
        document.getElementById("scale_region").style.display = 'none';
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
  do_page(14);
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
      if (this.id === 'trueFalse1' && this.value != 'c') {
        allRight = false;
      } else if (this.id === 'trueFalse2' && this.value != 'c') {
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
    console.log(triallist);

    // add rotations according to scenes
    var angles = [];
    for (i = 0; i < 12; i++) {
        angles.push(i*30);
    }

    for (scene = 0; scene < 10; scene++) {
        shuffle(angles);
        for (i = 0; i < angles.length; i++) {
            var idx = scene*12+i;
            triallist[idx] = [triallist[idx], angles[i]];
        }
    }

  shuffle(triallist);

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
      console.log(triallist);
    var flnm = triallist[curIdx][0];
    show_progress(curIdx);
    starttime = new Date().getTime();
    var query = flnm.split('_')[4];
      console.log('flnm', flnm, 'query', query);
    var pg = new Page("", "movie", flnm, query, triallist[curIdx][1]);
    // `Page` will record the subject responce when "next" is clicked
    // and go to the next trial
    pg.showPage(
      function() {
        register_response(pg, curIdx);
        // Clears slider from screen
        pg.clearResponse();
        runTrial(curIdx + 1);
      }
    );
  };

  // Record the subject's response for a given trial.
  var register_response = function(trialPage, cIdx) {
    var rt = new Date().getTime() - starttime;
    var rep = trialPage.retrieveResponse();
    psiTurk.recordTrialData({
      'TrialName': triallist[cIdx],
      'Response': rep,
      'ReactionTime': rt,
      'IsInstruction': false,
      'TrialOrder': cIdx
    });
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
        console.log("condition:", condition);
        condlist = data[condition];
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

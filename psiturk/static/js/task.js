/*
 * Requires:
 *     psiturk.js
 *     utils.js
 *     animation.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

// Names of elements used in the experiment
var PROGRESS = "progress";
var FULL_CONTAINER= "full-container";
var PAGESIZE = 500;

// stuff to do with contrast
var INIT_CONTRAST = 73; // this is the reference
var CONTRAST = INIT_CONTRAST; // this is what we'll register from user
var DOT_COLOR = 180; // this is the color of the dot
var PROBE_BASE_DIFFERENCE = 0.07;

var SCALE_COMPLETE = false; // users do not need to repeat scaling


// All pages to be loaded
var pages = [
    "instructions.html",
    "quiz.html",
    "restart.html",
    "stage.html",
    "postquestionnaire.html"
];

psiTurk.preloadPages(pages);


/****************
 * Instructions  *
 ****************/

var InstructionRunner = function(condlist) {
    psiTurk.showPage('instructions.html');


    var start_instruction_page = 0;
    var nTrials = condlist.length;
    var ninstruct = instructions.length;

    // Plays next instruction or exits.
    // If there is another page, it is reach via callback in `page.showPage`
    var show_instruction_page = function(i) {

        if (i < ninstruct) {
            // constructing Page using the the instructions.js
            var page = new Page(...instructions[i]);

            page.showPage(function() {
                page.clearResponse();
                show_instruction_page(i + 1);
            });
        } else {
            end_instructions();
        }
    };

    var end_instructions = function() {
        // TODO skipping quiz for debugging
        //currentview = new Experiment(condlist);
        //return;

        psiTurk.finishInstructions();
        quiz(function() {
            InstructionRunner(condlist);
        },
            function() {
                currentview = new Experiment(condlist);
            })
    };

    // start the loop
    show_instruction_page(start_instruction_page);
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
            //console.log('Finished instructions');
            // Move on to the experiment
            goNext();
        } else {
            // Otherwise, replay the instructions...
            loop++;
            psiTurk.showPage('restart.html');
            $('.continue').click(
                function() {
                    goBack();
                    // psiTurk.doInstructions(instructionPages, goBack) TODO REMOVE?
                });
        }
    });
};

/**************
 * Experiment *
 **************/

var Experiment = function(condlist) {
    psiTurk.showPage('stage.html');

    shuffle(condlist);

    var curidx = 0;
    var starttime = -1;

    // uses `Page` to show a single trial
    var runTrial = function(curIdx) {
        // We've reached the end of the experiment
        if (curIdx === condlist.length) {
            end_experiment();
        }
        
        var scene = condlist[curIdx][0];
        var rot_angle = condlist[curIdx][1];
        var probes = condlist[curIdx][2];
        
        // var pg = new Page("", "movie", filename, true, 0, rot_angle);
        var pg = new Page("", "animation", condlist[curIdx], true, 0);

        pg.showProgress(curIdx, condlist.length);
        // `Page` will record the subject responce when "next" is clicked
        // and go to the next trial

        starttime = new Date().getTime();

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
            'TrialName': condlist[cIdx],
            'Target': rep[0],
            'Probe': rep[1],
            'ReactionTime': rt,
            'IsInstruction': false,
            'TrialOrder': cIdx
        });
    };

    var end_experiment = function() {
        psiTurk.saveData();
        new Questionnaire();
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


// madness TODO fix
var dataset;

$(window).load(function() {
    
    function load_dataset(condlist) {
        $.ajax({
            dataType: 'json',
            url: "static/data/dataset.json",
            async: false,
            success: function(data) {
                dataset = data;
                console.log("dataset", dataset);
                InstructionRunner(condlist);
            },
            error: function() {
                setTimeout(500, do_load);
            },
            failure: function() {
                setTimeout(500, do_load)
            }
        });


    }

    function load_condlist() {
        $.ajax({
            dataType: 'json',
            url: "static/data/condlist.json",
            async: false,
            success: function(data) {
                console.log("condition", condition);
                condlist = data[condition];
                load_dataset(condlist);
            },
            error: function() {
                setTimeout(500, do_load)
            },
            failure: function() {
                setTimeout(500, do_load)
            }
        });

    };
  
    if (isMobileTablet()){
        console.log("mobile browser detected");
        alert(`Sorry, but mobile or tablet browsers are not supported. Please switch to a desktop browser or return the hit.`);
        return;
    }

    load_condlist();
});

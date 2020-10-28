function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
    return 'AssertException: ' + this.message;
};

function assert(exp, message) {
    if (!exp) {
        throw new AssertException(message);
    }
}

// Mean of booleans (true==1; false==0)
function boolpercent(arr) {
    var count = 0;
    for (var i=0; i<arr.length; i++) {
        if (arr[i]) { count++; } 
    }
    return 100* count / arr.length;
}

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

/********************
 * HTML manipulation
 *
 * All HTML files in the templates directory are requested
 * from the server when the PsiTurk object is created above. We
 * need code to get those pages from the PsiTurk object and
 * insert them into the document.
 *
 ********************/

var make_img = function(imgname, size) {
    var r = "<image id=\"img\" "
    r += `class="movieobj" src="static/data/${imgname}" alt="Movie" style="height: auto; width: ${size}px">`
    return r
};

var make_mov = function(movname, size) {
    var fmovnm = "static/data/movies/" + movname;
    var foggnm = fmovnm.substr(0, fmovnm.lastIndexOf('.')) + ".ogg";

    var ret = `<video id="video" class="movieobj" width="${size*1.05}px" height="${size*1.05}px">` +
        `<source src="${fmovnm}" type="video/mp4">` +
        `<source src="${foggnm}" type="video/ogg">` +
        `Your browser does not support HTML5 mp4 video.</video>`;
    return ret;
};

var make_animation = function(n_dots, n_probes, trial_type) {
    var ret = ``;
    for (var i=0; i<n_dots; i++) {
        ret += `<span class="dot" id="dot_${i}"></span>`;
    }
    
    // RANDOM FUNCTION TO CALCULATE HOW MUCH 
    // TODO LINEAR, MAYBE NOT THE RIGHT FUNCTION FOR HOW
    // HUMANS PERCEIVE DIFFERENCE IN LUMINANCE
    var intercept = PROBE_BASE_DIFFERENCE;
    var slope = intercept/INIT_CONTRAST
    var PROBE_DIFFERENCE = slope * (CONTRAST - INIT_CONTRAST) + intercept;

    var pb_c = DOT_COLOR * (1.0 - PROBE_DIFFERENCE);
    
    console.log(DOT_COLOR, pb_c);

    for (var i=0; i<n_probes; i++) {
        ret += `<span class="probe" id="probe_${i}" style="background-color: rgb(${pb_c}, ${pb_c}, ${pb_c})"></span>`;
    }
    //ret += `Frame: <input type="number" id="frame_counter" value="0">`;
    if (trial_type == "just_probe") {
        ret += `<span class="probe-indicator" id="indicator"></span>`;
    }
    return ret;
};


var add_rotation_to_triallist = function(triallist, n_scenes) {
    var n_trials_per_scene = triallist.length/n_scenes;

    // add rotations according to scenes
    var angles = [];
    for (i = 0; i < n_scenes; i++) {
        angles.push(i*360/n_trials_per_scene);
    }

    for (scene = 0; scene < n_scenes; scene++) {
        shuffle(angles);
        for (i = 0; i < angles.length; i++) {
            var idx = scene*n_trials_per_scene+i;
            triallist[idx] = [triallist[idx], angles[i]];
        }
    }

    return triallist
}


var argmax = function(array) {
    var max = array[0];
    var max_i = 0;

    for (var i=0; i<array.length; i++) {
        if (array[i] > max) {
            max = array[i];
            max_i = i;
        }
    }
    
    return max_i;
}

var argmin = function(array) {
    array = array.map(x => -x);
    return argmax(array);
}


// TODO not sure if works appropriately
function rotate(x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        nx = Math.cos(radians) * x + Math.sin(radians) * y,
        ny = Math.cos(radians) * y - Math.sin(radians) * x;
    return [nx, ny];
}


var openFullscreen = function() {
    console.log("going full screen");
    var elem = document.documentElement;

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

function make_fullscreen_button() {
    var ret = `<button type="button" style="margin: 0 auto" id="fullscreen_button">Switch to full screen mode</button>`;
    return ret;
}

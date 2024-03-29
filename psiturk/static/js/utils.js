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
    var ret = `<svg id="polygon_svg"></svg>`;
    ret += "<image id=\"img\" "
    ret += `class="movieobj" src="static/data/${imgname}" alt="Movie" style="height: auto; width: ${size}px">`
    return ret
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

var make_animation = function(n_dots, n_probes, trial_type, polygons) {
    console.log("make_animation start");

    var ret = ``;
    
    // adding the initial polygon structure indication
    // (specifying the actual coordinates in dot_animation.js)
    ret += `<svg id="polygon_svg">`;
    var real_polygons = polygons.filter(x => x > 1); 
    for (var i=0; i < real_polygons.length; i++) {
        ret += `<polyline class="polygon" id="polygon_${i}"></polyline>`;
    }
    ret += `</svg>`;

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
    
    for (var i=0; i<n_probes; i++) {
        ret += `<span class="probe" id="probe_${i}" style="background-color: rgb(${pb_c}, ${pb_c}, ${pb_c})"></span>`;
    }
    //ret += `Frame: <input type="number" id="frame_counter" value="0">`;
    if (trial_type == "just_probe") {
        ret += `<span class="probe-indicator" id="indicator"></span>`;
    }
    console.log("make_animation end");
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

function isMobileTablet(){
    var check = false;
    (function(a){
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
            check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}


function updateQuery(n_selected, n_targets) {
        var query = `
                <b>
                    Select the <span style="color:#e60000">targets <span class="dot" style="background-color:#e60000; position: relative; height: 20px; width: 20px"></span></span>.<br>${n_selected}/${n_targets} dots selected.<br>
                    <span style="color: gray; display: none" id="probe_reminder">
                        (remember to hit SPACEBAR whenever you see a probe <span class="probe" style="position: relative; opacity: 1.0; height: 10px; width: 10px"></span> during the movement)
                    </span>
                <b>
        `
            
        document.getElementById("target_response_region").innerHTML = query;
}

var leftMouseButtonOnlyDown = false;

function setLeftButtonState(e) {
  leftMouseButtonOnlyDown = e.buttons === undefined 
    ? e.which === 1 
    : e.buttons === 1;
}


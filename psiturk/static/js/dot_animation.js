var RED = "#eb3434";
var PINK = "#d45b81";
var GRAY = "#bbb";
var BLACK = "#000000";

var FRAME_DURATION = 41.6667;
var DIFF_BORDER_TIME = FRAME_DURATION;
var DIFF_DOWN = 0.06; // how much difficulty goes down automatically within DIFF_BORDER_TIME
var DIFF_UP = 0.3; // how much difficulty goes up when SPACEBAR pressed

var scale_to_pagesize = function(value, area) {
    return value/area*PAGESIZE;
}

// putting into the correct coordinates
var scale_positions = function(positions, area, rot_angle, y_shift) {
    var scaled_positions = [];

    for (var t = 0; t < positions.length; t++) {
        var scaled_positions_t = [];
        for (var i = 0; i < positions[t].length; i++) {

            var x = scale_to_pagesize(positions[t][i][0], area);
            var y = scale_to_pagesize(-positions[t][i][1]-y_shift, area);

            xy = rotate(x, y, rot_angle);
            xy[1] += PAGESIZE/2;
            scaled_positions_t.push(xy);
        }

        scaled_positions.push(scaled_positions_t);
    }
    return scaled_positions;
}


class DotAnimation {

    constructor(scene = 1, rot_angle = 0, probes = [], type = "normal") {
        let self = this;

        this.scene = scene;
        this.duration = FRAME_DURATION;
        this.positions = dataset[scene-1];

	if (type == "just_movement" || type == "shorter") {
		this.positions = this.positions.slice(0, 160);	
		console.log("shortened trial", this.positions);
	}
        this.area_width = 800;
        this.dot_radius = 20;
        this.pylon_radius = 50;
        this.scaled_positions = scale_positions(this.positions, this.area_width, rot_angle, this.dot_radius);

        this.k = this.positions.length;
        this.n_dots = this.positions[1].length;
        this.n_dots = 8;
        this.n_pylons = 4;
        this.n_targets = 4;

    
    
        // collecting dots as JS objects
        // and initializing the dots
        this.dots = [];
        for (var i = 0; i < this.n_dots; i++) {
            var dot = document.getElementById(`dot_${i}`);
            
            // scaling the size of the dot
            dot.style.width = `${scale_to_pagesize(this.dot_radius*2, this.area_width)}px`;
            dot.style.height = `${scale_to_pagesize(this.dot_radius*2, this.area_width)}px`;
            
            dot.value = false;
            this.dots.push(dot);
        }


        // initializing the pylons
        var pylon_positions = [[[-150,-150],[-150,150],[150,150],[150,-150]]];
        pylon_positions = scale_positions(pylon_positions, this.area_width, rot_angle, this.pylon_radius)
        for (var i = 0; i < this.n_pylons; i++) {
            var pylon = document.getElementById(`pylon_${i}`);
            
            // scaling the size of the dot
            pylon.style.width = `${scale_to_pagesize(this.pylon_radius*2, this.area_width)}px`;
            pylon.style.height = `${scale_to_pagesize(this.pylon_radius*2, this.area_width)}px`;

            anime.set(pylon, {
                translateX: pylon_positions[0][i][0],
                translateY: pylon_positions[0][i][1],
            }, 0)
        }


        // initializing the probe
        this.probe_placements = probes;
        this.probe_pad = 1; // how many frames are probed before and after the probed frame
        this.probe_width = this.dot_radius/2;

        this.probes = [];
        for (var i = 0; i < probes.length; i++) {
            var probe = document.getElementById(`probe_${i}`);

            probe.style.width = `${scale_to_pagesize(this.probe_width, this.area_width)}px`;
            probe.style.height = `${scale_to_pagesize(this.probe_width, this.area_width)}px`;
             
            this.probes.push(probe);
        }
        
        // spacebar spacetime array extravaganza
        this.spacebar = [];
        this.has_ended = false;
        this.type = type;
        this.min_select_distance = scale_to_pagesize(this.dot_radius*4, this.area_width);
        
        // further things we record
        // we record time as class variable when the trial ends
        this.trial_end_time = 0;
        // mouse clicks of the form [timestamp, coordinates, dot_index (0 if no dot selected/deselected),
        // select_deselect (true if selecting, false if deselecting)]
        this.mouseclicks = [];
        // mouse moves of the form [timestamp, coordinates]
        this.mousemoves = [];

        this.difficulty_array = [];
        this.difficulty = 0.0;

        this.mediascreen = document.getElementById("mediascreen");
        this.mediascreen.style.borderWidth = `${PAGESIZE/50}px`;
    }

    play(callback, freeze_time = 2000) {
        let self = this;

        // timeline allows to control what happens after what
        var tl = anime.timeline({
                easing: 'linear',
        });

        // putting the dot into starting position
        for (var i = 0; i < this.n_dots; i++) {
            tl.set(this.dots[i], {
                translateX: this.scaled_positions[0][i][0],
                translateY: this.scaled_positions[0][i][1],
            }, 0)
        }
        
        if (this.type != "just_probe") {
            var starttime = new Date().getTime();

            var update_difficulty_border = function() {
                // console.log((new Date().getTime() - starttime), self.difficulty);
                if (!self.has_ended) {
                    self.difficulty -= DIFF_DOWN
                    self.difficulty = Math.max(self.difficulty, 0.0);
                }
            }
        }


        // initializing the probe
        this.probe_placements = probes;
        this.probe_pad = 1; // how many frames are probed before and after the probed frame
        this.probe_width = this.dot_radius/2;

        this.probes = [];
        for (var i = 0; i < probes.length; i++) {
            var probe = document.getElementById(`probe_${i}`);

            probe.style.width = `${scale_to_pagesize(this.probe_width, this.area_width)}px`;
            probe.style.height = `${scale_to_pagesize(this.probe_width, this.area_width)}px`;
             
            this.probes.push(probe);
        }
        
        // spacebar spacetime array extravaganza
        this.spacebar = [];
        this.has_ended = false;
        this.type = type;
        this.min_select_distance = scale_to_pagesize(this.dot_radius*4, this.area_width);
        
        // further things we record
        // we record time as class variable when the trial ends
        this.trial_end_time = 0;
        // mouse clicks of the form [timestamp, coordinates, dot_index (0 if no dot selected/deselected),
        // select_deselect (true if selecting, false if deselecting)]
        this.mouseclicks = [];
        // mouse moves of the form [timestamp, coordinates]
        this.mousemoves = [];

        this.difficulty_array = [];
        this.difficulty = 0.0;

        this.mediascreen = document.getElementById("mediascreen");
        this.mediascreen.style.borderWidth = `${PAGESIZE/50}px`;
    }

    play(callback, freeze_time = 2000) {
        let self = this;

        // timeline allows to control what happens after what
        var tl = anime.timeline({
                easing: 'linear',
        });

        // putting the dot into starting position
        for (var i = 0; i < this.n_dots; i++) {
            tl.set(this.dots[i], {
                translateX: this.scaled_positions[0][i][0],
                translateY: this.scaled_positions[0][i][1],
            }, 0)
        }
        
        if (this.type != "just_probe") {
            var starttime = new Date().getTime();

            var update_difficulty_border = function() {
                // console.log((new Date().getTime() - starttime), self.difficulty);
                if (!self.has_ended) {
                    self.difficulty -= DIFF_DOWN
                    self.difficulty = Math.max(self.difficulty, 0.0);
                }
                anime({
                    targets: self.mediascreen,
                    borderColor: `rgba(235, 52, 52, ${self.difficulty})`,
                    easing: 'linear',
                    duration: self.has_ended ? 2000 : DIFF_BORDER_TIME,
                    complete: self.has_ended ? function(){return;} : update_difficulty_border
                })
            }

            // indicicating the targets
            var targets = this.dots.slice(0, this.n_targets)
            tl.add({
                targets: targets,
                backgroundColor: RED,
                duration: 1,
                complete: update_difficulty_border,
            })
            if (this.type == "just_td") {
                this.has_ended = true;
                callback();
                return;
            }

            // removing indication
            tl.add({
                targets: targets,
                backgroundColor: GRAY,
                duration: 1,
            }, freeze_time)
            
           
            // preventing from scrolling on space bar click
            window.addEventListener('keydown', function(e) {
                if(e.keyCode == 32 && e.target == document.body) {
                    e.preventDefault();
                }
            });
            
            // adding spacebar handling on press
            if (ENABLE_DIFFICULTY_PRESSES) {
                document.onkeydown = function(event){
                    if (event.keyCode === 32) {
                        event.preventDefault();

                        self.difficulty = Math.min(self.difficulty + DIFF_UP, 1.0);
                        var time = new Date().getTime() - starttime;

                        if (time < freeze_time || self.has_ended) return;
                        if (self.spacebar.length < 500) self.spacebar.push(time-freeze_time);
                    }
                }
            }
            
            var end_function = function() {
                console.log("trial ended");
                self.has_ended = true;
                self.trial_end_time = new Date().getTime();
                callback();
            }
            
            var update_difficulty_array = function() {
                var time = new Date().getTime() - starttime;

                if (time > freeze_time) {
                    self.difficulty_array.push([time-freeze_time, self.difficulty]);
                }
                // if (!self.has_ended) update_difficulty_array(); 
            }

            for (var i = 0; i < this.n_dots; i++) {
                // for the first dot animation, adding a callback at the end
                var complete_function = (i == 0) ? end_function : function() {return;}
                var update_function = (i == 0) ? update_difficulty_array : function() {return;}
                tl.add({
                    targets: this.dots[i],
                    translateX: this.scaled_positions.map(p_t => ({value: p_t[i][0], duration: this.duration})),
                    translateY: this.scaled_positions.map(p_t => ({value: p_t[i][1], duration: this.duration})),
                    complete: complete_function,
                    // update: update_function
                }, freeze_time)
            }

            var frame_values = [];
            for (var t = 0; t < this.scaled_positions.length; t++) {
                frame_values.push({value: t, duration: this.duration});
            }
            tl.add({
                targets: document.getElementById("frame_counter"),
                value: frame_values,
                round: 1,
            }, freeze_time);
        }
        
        var probe_y_offset = scale_to_pagesize(self.dot_radius - self.probe_width/2, self.area_width);
    

        for (var i = 0; i < this.probes.length; i++) {
            // preparing the probe opacities and probe placements
            var probe_opacities = new Array(this.positions.length);
            probe_opacities.fill(0.0);

            var t = this.probe_placements[i][1];
            var dot = this.probe_placements[i][0];

            // setting the probe for the beggining
            tl.set(this.probes[i], {
                translateX: this.scaled_positions[0][dot-1][0],
                translateY: this.scaled_positions[0][dot-1][1] + probe_y_offset,
            }, 0)
            
            if (this.type == "just_probe") {
                var indicator = document.getElementById("indicator");
                
                var indicator_width = scale_to_pagesize(this.dot_radius*4, this.area_width)
                indicator.style.width = `${indicator_width}px`;
                indicator.style.height = `${indicator_width}px`;

                var indicator_y_offset = scale_to_pagesize(this.dot_radius, this.area_width) - indicator_width/2;

                tl.set(indicator, {
                    translateX: this.scaled_positions[0][dot-1][0],
                    translateY: this.scaled_positions[0][dot-1][1] + indicator_y_offset,
                })

                tl.set(this.probes[i], {
                    opacity: 1.0,
                })
                callback();
                return;
            }
            
            var start = Math.max(1, t-this.probe_pad);
            var end = Math.min(this.positions.length, t+this.probe_pad);

            for (var j = start; j <= end; j++) {
                probe_opacities[j] = 1.0;
            }

            tl.add({
                targets: this.probes[i],
                opacity: probe_opacities.map(op => ({value: op, duration: this.duration})),
                translateX: this.scaled_positions.map(p_t => ({value: p_t[dot-1][0], duration: this.duration})),
                translateY: this.scaled_positions.map(p_t => ({value: p_t[dot-1][1] + probe_y_offset, duration: this.duration})),
            }, freeze_time)
        }
    }

    get_td() {
        return this.dots.map(dot => dot.value);
    }
    
    get_spacebar() {
        return this.spacebar;
    }

    get_mouseclicks() {
        return this.mouseclicks;
    }

    get_mousemoves() {
        return this.mousemoves;
    }

    get_difficulty_array() {
        return this.difficulty_array;
    }
    
    get_closest_dot(e, mediascreen) {
        var rect = mediascreen.getBoundingClientRect();
        var x = e.clientX - rect.left; // x position within the element.
        var y = e.clientY - rect.top;  // y position within the element.

        x -= PAGESIZE/2;
        //y -= scale_to_pagesize(this.dot_radius, this.area_width);
        
        var distances = [];
        for (var i = 0; i < this.dots.length; i++) {
            const style = window.getComputedStyle(this.dots[i]);
            const matrix = style.transform || style.webkitTransform || style.mozTransform;
            const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ')
            const dot_x = matrixValues[4]
            const dot_y = matrixValues[5]
            
            var distance = Math.sqrt(Math.pow(x - dot_x, 2) + Math.pow(y - dot_y, 2));
            distances.push(distance);
        }

        var i = argmin(distances)
        var dot = this.dots[i];
        var min_distance = distances[i];

        return [dot, min_distance, [x,y-PAGESIZE/2], i];
    }

    onmousemove(e, mediascreen) {
        var rect = mediascreen.getBoundingClientRect();
        var x = e.clientX - rect.left; // x position within the element.
        var y = e.clientY - rect.top;  // y position within the element.
        
        // clear previous borderStyle
        for (var i = 0; i < this.dots.length; i++) {
            //this.dots[i].style.backgroundColor = this.dots[i].value ? RED : GRAY;
            this.dots[i].style.border = 'none';
        }

        // if outside boundaries, do nothing
        if (x < 0 || x > PAGESIZE || y < 0 || y > PAGESIZE) {
            return;
        }

        var time = new Date().getTime() - this.trial_end_time;
        this.mousemoves.push([time, [x-PAGESIZE/2, y-PAGESIZE/2]]);

        var values = this.get_closest_dot(e, mediascreen);
        var distance = values[1];
        if (distance <= this.min_select_distance) {
            var dot = values[0];
            dot.style.border = '2px solid'
            dot.style.borderColor = '#ff8593';
        }
    }

    click(e, mediascreen) {
        var time = new Date().getTime() - this.trial_end_time;

        var values = this.get_closest_dot(e, mediascreen);
        var distance = values[1];
        var coordinates = values[2];

        var select_deselect = false;
        // dot_index = 0 means that no dot was selected or deselected
        var dot_index = 0;

        if (distance > this.min_select_distance) {
            this.mouseclicks.push([time, coordinates, dot_index, select_deselect]);
            return;
        }
        var dot = values[0];

        if (this.get_td().filter(Boolean).length < this.n_targets || dot.value == true) {
            // true if selecting the dot, false if deselecting
            select_deselect = (!dot.value);
            dot_index = values[3] + 1;

            dot.value = (!dot.value);
            dot.style.backgroundColor = dot.value ? RED : GRAY;
        } else {
            console.log("can't select more than ", this.n_targets);
        }
        this.mouseclicks.push([time, coordinates, dot_index, select_deselect]);
    }
}

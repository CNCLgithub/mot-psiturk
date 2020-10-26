
var RED = "#e60000";
var GRAY = "#bbb";
var BLACK = "#000000";

var scale_to_pagesize = function(value, area) {
    return value/area*PAGESIZE;
}

// putting into the correct coordinates
var scale_positions = function(positions, area, rot_angle) {
    var scaled_positions = [];

    for (var t = 0; t < positions.length; t++) {
        var scaled_positions_t = [];
        for (var i = 0; i < positions[t].length; i++) {
            var x = scale_to_pagesize(positions[t][i][0], area);
            var y = scale_to_pagesize(-positions[t][i][1], area);

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
        this.duration = 41.6667;
        //this.duration = 1;
        this.positions = dataset[scene-1];
        this.area_width = 800;
        this.scaled_positions = scale_positions(this.positions, this.area_width, rot_angle);

        this.k = this.positions.length;
        this.n_dots = this.positions[1].length;
        this.n_dots = 8;
        this.n_targets = 4;

        this.dot_radius = 20;
    

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
    }

    play(callback, freeze_time = 500) {
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
            // indicicating the targets
            var targets = this.dots.slice(0, this.n_targets)
            tl.add({
                targets: targets,
                backgroundColor: RED,
                duration: 1,
            })
            if (this.type == "just_td") {
                callback();
                return;
            }

            // removing indication
            tl.add({
                targets: targets,
                backgroundColor: GRAY,
                duration: 1,
            }, freeze_time)
            
            var starttime = new Date().getTime();
           
            // preventing from scrolling on space bar click
            window.addEventListener('keydown', function(e) {
                if(e.keyCode == 32 && e.target == document.body) {
                    e.preventDefault();
                }
            });
            
            // adding spacebar handling after release
            document.onkeyup = function(event){
                if (event.keyCode === 32) {
                    event.preventDefault();

                    var time = new Date().getTime() - starttime;

                    if (time < freeze_time || self.has_ended) return;
                    if (self.spacebar.length < 500) self.spacebar.push((time-freeze_time)/self.duration);
                    anime({
                        targets: document.getElementById("mediascreen"),
                        border: ["hidden", "solid"],
                        duration: 50,
                    })

                    console.log(self.spacebar);
                }
            };

            for (var i = 0; i < this.n_dots; i++) {
                // for the first dot animation, adding a callback at the end
                var complete_function = (i == 0) ? function() {self.has_ended = true; callback();} : function() {return;}
                tl.add({
                    targets: this.dots[i],
                    translateX: this.scaled_positions.map(p_t => ({value: p_t[i][0], duration: this.duration})),
                    translateY: this.scaled_positions.map(p_t => ({value: p_t[i][1], duration: this.duration})),
                    complete: complete_function,
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
                tl.set(this.probes[i], {
                    opacity: 1.0,
                }, 0)
                callback();
                return;
            }
            
            var start = Math.max(1, t-this.probe_pad);
            var end = Math.min(this.positions.length, t+this.probe_pad);

            console.log(start, end);
            for (var j = start; j <= end; j++) {
                probe_opacities[j] = 1.0;
            }

            console.log(probe_opacities);

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

    click(e, mediascreen) {
        var rect = mediascreen.getBoundingClientRect();
        var x = e.clientX - rect.left; // x position within the element.
        var y = e.clientY - rect.top;  // y position within the element.

        // for some reason only need to shift x accordintg to PAGESIZE
        x -= PAGESIZE/2;
        //y -= PAGESIZE/2;
        
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

        // console.log("Left? : " + x + " ; Top? : " + y + ".");

        var dot = this.dots[argmin(distances)];
        if (this.get_td().filter(Boolean).length < this.n_targets || dot.value == true) {
            dot.value = (!dot.value);
            dot.style.backgroundColor = dot.value ? RED : GRAY;
        } else {
            console.log("can't select more than ", this.n_targets);
        }
    }
}

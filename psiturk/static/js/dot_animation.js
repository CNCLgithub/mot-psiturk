// TODO remove hardcoded area_width

var RED = "#e60000";
var GRAY = "#bbb";
var BLACK = "#000000";

var scale_to_pagesize = function(value, area) {
    return value/area*PAGESIZE;
}

// putting into the correct coordinates
var scale_positions = function(positions, area) {
    var scaled_positions = [];

    for (var t = 0; t < positions.length; t++) {
        var scaled_positions_t = [];
        for (var i = 0; i < positions[t].length; i++) {
            var x = scale_to_pagesize(positions[t][i][0], area);
            var y = scale_to_pagesize(-positions[t][i][1], area) + PAGESIZE/2;
            scaled_positions_t.push([x, y]);
        }
        scaled_positions.push(scaled_positions_t);
    }
    return scaled_positions;
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

class DotAnimation {

    constructor(scene = 3) {
        let self = this;

        this.scene = scene;
        this.duration = 42;
        this.positions = dataset[scene];
        this.area_width = 800;
        this.scaled_positions = scale_positions(this.positions, this.area_width);
        
        console.log(this.positions);
        console.log(this.scaled_positions);


        this.k = this.positions.length;
        this.n_dots = this.positions[1].length;
        this.n_dots = 8;
        this.n_targets = 4;

        this.dot_radius = 20;
    
        // initializing the probe
        this.probe_width = this.dot_radius/2;
        this.probe = document.getElementById(`probe`);
        this.probe.style.width = `${scale_to_pagesize(this.probe_width, this.area_width)}px`;
        this.probe.style.height = `${scale_to_pagesize(this.probe_width, this.area_width)}px`;

        // collecting dots as JS objects
        // and initializing the dots
        this.dots = [];
        for (var i = 0; i < this.n_dots; i++) {
            var dot = document.getElementById(`dot_${i}`);
            
            // scaling the size of the dot
            dot.style.width = `${scale_to_pagesize(this.dot_radius*2, this.area_width)}px`;
            dot.style.height = `${scale_to_pagesize(this.dot_radius*2, this.area_width)}px`;
            
            // initializing clickability
            // TODO perhaps will need to write some better
            // clicking logic, so that it's easier to click
            // (like having a general onclick for the mediascreen)
            dot.value = false;
            
            this.dots.push(dot);
        }

    }

    play(callback, freeze_time = 500) {
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
        
        // indicicating the targets
        var targets = this.dots.slice(0, this.n_targets)
        tl.add({
            targets: targets,
            backgroundColor: RED,
            duration: 1,
        })
        tl.add({
            targets: targets,
            backgroundColor: GRAY,
            duration: 1,
        }, freeze_time)


        for (var i = 0; i < this.n_dots; i++) {
            var complete_function = (i == 0) ? callback : function() {return;}
            tl.add({
                targets: this.dots[i],
                translateX: this.scaled_positions.map(p_t => ({value: p_t[i][0], duration: this.duration})),
                translateY: this.scaled_positions.map(p_t => ({value: p_t[i][1], duration: this.duration})),
                complete: complete_function,
            }, freeze_time)
        }
        
        var probed_dot = 0;
        var probed_frames = [2, 3, 4];
        var opacities = [];
        for (var t=0; t < this.positions.length; t++) {
            var opacity = probed_frames.includes(t) ? 1.0 : 0.0;
            opacities.push({value: opacity, duration: 42});
        }

        tl.add({
            targets: this.probe,
            opacity: opacities,
            translateX: this.scaled_positions.map(p_t => ({value: p_t[probed_dot][0], duration: this.duration})),
            translateY: this.scaled_positions.map(p_t => ({value: p_t[probed_dot][1] - this.probe_width + this.dot_radius, duration: this.duration})),
        }, freeze_time)
    }

    get_td() {
        return this.dots.map(dot => dot.value);
    }

    click(e, mediascreen) {
        console.log("screen clicked");
        var rect = mediascreen.getBoundingClientRect();
        var x = e.clientX - rect.left; //x position within the element.
        var y = e.clientY - rect.top;  //y position within the element.

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

        console.log("Left? : " + x + " ; Top? : " + y + ".");
        console.log(distances);

        var dot = this.dots[argmin(distances)];
        if (this.get_td().filter(Boolean).length < this.n_targets || dot.value == true) {
            dot.value = (!dot.value);
            dot.style.backgroundColor = dot.value ? RED : GRAY;
        } else {
            console.log("can't select more than ", this.n_targets);
        }
    }
}

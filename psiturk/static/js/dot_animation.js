// TODO remove hardcoded area_width

var RED = "#e60000";
var GRAY = "#bbb";
var BLACK = "#000000";

var scale_to_pagesize = function(value, area) {
    return value/area*PAGESIZE;
}

class DotAnimation {

    constructor(scene = 3) {
        let self = this;

        this.scene = scene;
        this.duration = 42;
        this.positions = dataset[scene];

        this.k = this.positions.length;
        this.n_dots = this.positions[1].length;
        this.n_dots = 8;
        this.n_targets = 4;

        this.area_width = 800;
        this.dot_radius = 20;
    
        // initializing the probe
        this.probe_width = this.dot_radius;
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
            dot.onclick = function() {
                if (self.get_td().filter(Boolean).length < self.n_targets || this.value == true) {
                    this.value = (!this.value);
                    this.style.backgroundColor = this.value ? RED : GRAY;
                } else {
                    console.log("can't select more than ", self.n_targets);
                }
            }
            
            this.dots.push(dot);
        }

    }

    play(callback, freeze_time = 2000) {
        // timeline allows to control what happens after what
        var tl = anime.timeline({
                easing: 'linear',
        });

        // putting the dot into starting position
        for (var i = 0; i < this.n_dots; i++) {
            tl.set(this.dots[i], {
                translateX: scale_to_pagesize(this.positions[0][i][0], this.area_width),
                translateY: scale_to_pagesize(-this.positions[0][i][1], this.area_width) + PAGESIZE/2,
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
                translateX: this.positions.map(p_t => ({value: scale_to_pagesize(p_t[i][0], this.area_width), duration: this.duration})),
                translateY: this.positions.map(p_t => ({value: scale_to_pagesize(-p_t[i][1], this.area_width) + PAGESIZE/2, duration: this.duration})),
                complete: complete_function,
            }, freeze_time)
        }
        
        var probed_dot = 0;
        var probed_frames = [50, 51, 52];
        var displays = [];
        for (var t=0; t < this.positions.length; t++) {
            //var display = probed_frames.includes(t) ? "inline-block" : "none";
            var display = t % 2 == 0 ? "inline-block" : "none";
            displays.push(({value: display, duration: this.duration}));
        }

        tl.add({
            targets: probe,
            display: displays,
            translateX: this.positions.map(p_t => ({value: scale_to_pagesize(p_t[probed_dot][0], this.area_width), duration: this.duration})),
            translateY: this.positions.map(p_t => ({value: scale_to_pagesize(-p_t[probed_dot][1], this.area_width) + PAGESIZE/2, duration: this.duration})),
        }, freeze_time)
    }

    get_td() {
        return this.dots.map(dot => dot.value);
    }


}

// TODO remove hardcoded area_width
var scale_to_pagesize = function(value, area) {
    return value/area*PAGESIZE;
}

class DotAnimation {
    constructor(scene = 3, loop = false) {
        this.scene = scene;
        this.duration = 42;
        this.positions = dataset[scene];
        this.loop = loop;

        this.k = this.positions.length;
        this.n_dots = this.positions[1].length;
        this.n_dots = 8;
        this.area_width = 800;
        this.dot_radius = 20;

        // collecting dots as JS objects
        // and initializing the dots
        this.dots = [];
        for (var i = 0; i < this.n_dots; i++) {
            var dot = document.getElementById(`dot_${i}`);
            
            // scaling the size of the dot
            dot.style.width = `${scale_to_pagesize(this.dot_radius*2, this.area_width)}px`;
            dot.style.height = `${scale_to_pagesize(this.dot_radius*2, this.area_width)}px`;
            
            // initializing clickability
            dot.value = false;
            dot.onclick = function() {
                this.value = (!this.value);
                this.style.backgroundColor = this.value ? "red" : "#bbb";
            }
            
            // putting the dot into starting position
            anime.set(this.dots[i], {
                translateX: scale_to_pagesize(this.positions[0][i][0], this.area_width),
                translateY: scale_to_pagesize(-this.positions[0][i][1], this.area_width) + PAGESIZE/2,
            })

            this.dots.push(dot);
        }

    }

    play() {
        for (var i = 0; i < this.n_dots; i++) {
            anime({
                targets: this.dots[i],
                easing: 'linear',
                loop: this.loop,
                translateX: this.positions.map(p_t => ({value: scale_to_pagesize(p_t[i][0], this.area_width), duration: this.duration})),
                translateY: this.positions.map(p_t => ({value: scale_to_pagesize(-p_t[i][1], this.area_width) + PAGESIZE/2, duration: this.duration})),
            })
        }
    }

    get_n_clicked() {
        return this.dots.map(dot => dot.value).filter(Boolean).length;
    }
}

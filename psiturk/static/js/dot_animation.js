class DotAnimation {
    constructor(scene = 3, loop = false) {
        this.scene = scene;
        this.duration = 42;
        this.positions = dataset[scene];
        this.loop = loop;

        this.k = this.positions.length;
        this.n_dots = this.positions[1].length;
        this.n_dots = 2;

        // collecting dots as JS objects
        this.dots = [];
        for (var i = 0; i < this.n_dots; i++) {
            var dot = document.getElementById(`dot_${i}`);
            dot.value = false;

            dot.onclick = function() {
                this.value = (!this.value);
                this.style.backgroundColor = this.value ? "red" : "#bbb";
            }

            this.dots.push(dot);
        }

    }

    play() {
        const tl = anime.timeline({
          loop: false,
          autoplay: true,
          duration: 500,
          easing: 'linear',
        });
        
        for (var t = 0; t < this.k; t++) {
            for (var i = 0; i < this.n_dots; i++) {
                tl.
                add({
                    targets: this.dots[i],
                    easing: 'linear',
                    loop: this.loop,
                    translateX: this.positions[t][i][0],
                    translateY: -this.positions[t][i][1],
                }, t*this.duration)
            }
        }
    }
}

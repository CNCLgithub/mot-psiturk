class DotAnimation {
    constructor(scene = 1) {
        this.scene = scene;
        this.duration = 100;
        this.positions = dataset[scene];
    }

    play() {
        let self = this;
        
        anime({
            targets: dot1,
            easing: 'linear',
            loop: true,
            translateX: self.positions.map(p => ({value: p[1][0], duration: self.duration})),
            translateY: self.positions.map(p => ({value: p[1][1], duration: self.duration})),
        });
    }
}

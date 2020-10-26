class Page {

    // Handles media presentation and scale handling.

    /*******************
     * Public Methods  *
     *******************/
    constructor(text, mediatype, mediadata, show_response, next_delay) {

        // page specific variables
        this.text = text;
        this.mediatype = mediatype;
        this.mediadata = mediadata;
        this.show_response = show_response;
        this.next_delay = next_delay; // delay for showing next button in seconds

        // html elements
        this.scale_region = document.getElementById("scale_region");
        this.response_region = document.getElementById("response_region");
        this.query = document.getElementById("query");
        this.nextbutton = document.getElementById("nextbutton");
        this.mediascreen = document.getElementById("mediascreen");
        this.message = document.getElementById("message");
        this.progress = document.getElementById("progress");

        this.nextbutton.disabled = true;
        this.nextbutton.style.display = 'none';
        this.response_region.style.display = 'none';

        this.query.style.display = 'none';
        this.query.style.color = 'black';
        this.mediascreen.innerHTML = "";
        this.animation = undefined;
    }

    // Loads content to the page
    // The `callback` argument can be used to handle page progression
    // or subject responses
    showPage(callback) {
        // create callback to progress when done
        this.nextbutton.onclick = function() {
            callback();
        };

        this.addText();
        this.addMedia();


    }

    retrieveResponse() {
        return [this.animation.get_td(), this.animation.get_spacebar()]
    }


    /************
     * Helpers  *
     ***********/

    // injects text into page's inner html
    addText() {
        this.message.innerHTML = this.text;
    }

    // formats html for media types
    addMedia() {
        this.mediascreen.style.backgroundColor = 'white';
        this.scale_region.style.display = 'none';

        if (this.mediatype === 'image') {
            this.showImage();
        } else if (this.mediatype === 'movie') {
            this.showMovie();
        } else if (this.mediatype == 'scale'){
            this.scalePage();
        } else if (this.mediatype == 'contrast'){
            this.adjustContrast();
        } else if (this.mediatype == 'animation'){
            this.showAnimation();
        } else {
            this.mediascreen.style.height = '0px';
            this.showEmpty();
        }
    };


    addResponse(animation = undefined) {
        this.response_region.style.display = 'block';

        // if no response required, then simply allow to go further
        if (this.show_response == false) {
            this.allowNext();
        } else {
            this.query.style.display = 'block';
            this.enableResponse(animation);
        }
    }

    allowNext() {
        sleep(this.next_delay*1000).then(() => {
            this.nextbutton.disabled = false;
            this.nextbutton.style.display = "block";
        });
    }

    // The form will automatically enable the next button
    enableResponse(animation) {
        let self = this;
        
        this.mediascreen.onclick = function(e) {
            animation.click(e, self.mediascreen);
            // if all targets selected, then allow next
            if (animation.get_td().filter(Boolean).length == animation.n_targets) {
                document.getElementById("probe_reminder").style.display = "block";
                self.allowNext();
            } else {
                self.nextbutton.disabled = true;
            }
        };
    }

    clearResponse() {
        // var buttons = ["td_yes", "td_no", "pr_yes", "pr_no"];
        // buttons.map(x => document.getElementById(x).checked = false);
    }

    scalePage() {
        this.mediascreen.innerHTML = make_img(this.mediadata, PAGESIZE) + "<br>";
        let self = this;

        if (SCALE_COMPLETE) {
            this.mediascreen.innerHTML = "";
            this.instruct.innerHTML = "You have already scaled your monitor";
            this.addResponse();
        } else {
            this.scale_region.style.display = 'block';
            var slider_value = document.getElementById("scale_slider");
            var scale_img = document.getElementById("img");

            slider_value.value = PAGESIZE/500*50;
            this.scaleMediascreen();

            slider_value.oninput = function(e) {
                PAGESIZE = (e.target.value / 50.0) * 500;
                scale_img.width = `${PAGESIZE}px`;
                scale_img.style.width = `${PAGESIZE}px`;
                self.scaleMediascreen();
                self.addResponse();
                SCALE_COMPLETE = true;
            }
        }
    }

    adjustContrast() {
        this.mediascreen.innerHTML = make_img(this.mediadata, PAGESIZE) + "<br>";
        let self = this;

        if (SCALE_COMPLETE) {
            this.mediascreen.innerHTML = "";
            this.instruct.innerHTML = "You have already scaled your monitor";
            this.addResponse();
        } else {
            this.scale_region.style.display = 'block';
            var slider_value = document.getElementById("scale_slider");
            var scale_img = document.getElementById("img");

            slider_value.value = PAGESIZE/500*50;
            this.scaleMediascreen();

            slider_value.oninput = function(e) {
                PAGESIZE = (e.target.value / 50.0) * 500;
                scale_img.width = `${PAGESIZE}px`;
                scale_img.style.width = `${PAGESIZE}px`;
                self.scaleMediascreen();
                self.addResponse();
                SCALE_COMPLETE = true;
            }
        }
    }

    scaleMediascreen() {
        this.mediascreen.style.width = `${PAGESIZE}px`;
        this.mediascreen.style.height = `${PAGESIZE}px`;
        this.mediascreen.style.margin = '0 auto';
    }

    // plays movie
    showMovie() {
        let me = this;

        this.mediascreen.innerHTML = make_mov(this.mediapath, PAGESIZE);
        var video = document.getElementById('video');

        video.onended = function() {
            me.addResponse();
        };

        video.oncanplaythrough = function() {
            video.play();
        };

        // making sure there is space for rotation
        // (scaling according to PAGESIZE)
        this.scaleMediascreen();

        // changing to the color of the video background
        this.mediascreen.style.background = '#e6e6e6';

        video.style.transform = `rotate(${this.rot_angle}deg)`;
        this.mediascreen.style.display = 'block';
    }

    // plays animation
    showAnimation() {
        let self = this;
        
        var scene = this.mediadata[0];
        var rot_angle = this.mediadata[1];
        var probes = this.mediadata[2];
        var just_td = this.mediadata[3]; // just showing target designation for instructions

        var n_dots = 8;
        var n_probes = probes.length;
        this.mediascreen.innerHTML = make_animation(n_dots, n_probes);
        this.scaleMediascreen();

        var animation = new DotAnimation(scene, rot_angle, probes, just_td);
        this.animation = animation;
        var callback = function() {
            console.log("animation complete :P");
            self.addResponse(animation);
        };

        // changing to the color of the video background
        this.mediascreen.style.background = '#e6e6e6';

        // video.style.transform = `rotate(${this.rot_angle}deg)`;
        this.mediascreen.style.display = 'block';
        
        animation.play(callback, 1500);
    }

    showImage() {
        this.mediascreen.innerHTML = make_img(this.mediapath, PAGESIZE) + "<br>";
        this.addResponse();
    }

    showEmpty() {
        this.addResponse();
    }
    showProgress(cur_idx, out_of) {
        this.progress.innerHTML = (cur_idx + 1) + " / " + (out_of);
    };
};

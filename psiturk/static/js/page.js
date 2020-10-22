class Page {

    // Handles media presentation and scale handling.

    /*******************
     * Public Methods  *
     *******************/
    constructor(text, mediatype, mediapath, show_response, next_delay, mov_angle = 0) {

        // page specific variables
        this.text = text;
        this.mediatype = mediatype;
        this.mediapath = mediapath;
        this.show_response = show_response;
        this.next_delay = next_delay; // delay for showing next button in seconds
        this.mov_angle = mov_angle;

        // html elements
        this.scale_region = document.getElementById("scale_region");
        this.response_region = document.getElementById("response_region");
        this.td_response_form = document.getElementById("td_response_form");
        this.pr_response_form = document.getElementById("pr_response_form");
        this.nextbutton = document.getElementById("nextbutton");
        this.mediascreen = document.getElementById("mediascreen");
        this.message = document.getElementById("message");
        this.progress = document.getElementById("progress");

        this.nextbutton.disabled = true;
        this.nextbutton.style.display = 'none';
        this.response_region.style.display = 'none';
        this.td_response_form.style.display = 'none';
        this.pr_response_form.style.display = 'none';
        this.pr_response_form.disabled = true;
        this.mediascreen.innerHTML = "";
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
        return [this.td_response_form.value, this.pr_response_form.value]
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
        } else if (this.mediatype == 'animation'){
            this.showAnimation();
        } else {
            this.mediascreen.style.height = '0px';
            this.showEmpty();
        }
    };


    addResponse() {
        this.response_region.style.display = 'block';

        // if no response required, then simply allow to go further
        if (this.show_response == false) {
            this.allowNext();
        } else {
            this.td_response_form.style.display = 'block';
            this.pr_response_form.style.display = 'block';
            this.enableResponse();
        }
    }

    allowNext() {
        sleep(this.next_delay*1000).then(() => {
            this.nextbutton.disabled = false;
            this.nextbutton.style.display = "block";
        });
    }

    // The form will automatically enable the next button
    enableResponse() {
        let self = this;

        var td_yes = document.getElementById("td_yes");
        var td_no = document.getElementById("td_no");
        var pr_yes = document.getElementById("pr_yes");
        var pr_no = document.getElementById("pr_no");

        var pr = [pr_yes, pr_no];
        pr.map(x => x.disabled = true);

        // registering target designation
        // and enabling the probe responses
        td_yes.onclick = function() {
            self.td_response_form.value = true;
            pr.map(x => x.disabled = false)
        }
        td_no.onclick = function() {
            self.td_response_form.value = false;
            pr.map(x => x.disabled = false)
        }

        // registering probe detection
        pr_yes.onclick = function() {
            self.pr_response_form.value = true;
            self.allowNext();
        }
        pr_no.onclick = function() {
            self.pr_response_form.value = false;
            self.allowNext();
        }
    }

    clearResponse() {
        var buttons = ["td_yes", "td_no", "pr_yes", "pr_no"];
        buttons.map(x => document.getElementById(x).checked = false);
    }

    scalePage() {
        this.mediascreen.innerHTML = make_img(this.mediapath, PAGESIZE) + "<br>";
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

        video.style.transform = `rotate(${this.mov_angle}deg)`;
        this.mediascreen.style.display = 'block';
    }

    // plays animation
    showAnimation() {
        let self = this;

        this.mediascreen.innerHTML = make_animation(8);
        this.scaleMediascreen();

        var animation = new DotAnimation();
        var callback = function() {
            console.log("animation complete :P");
            self.addResponse();
        };

        // changing to the color of the video background
        this.mediascreen.style.background = '#e6e6e6';

        // video.style.transform = `rotate(${this.mov_angle}deg)`;
        this.mediascreen.style.display = 'block';
        
        this.mediascreen.onclick = function(e) {
            animation.click(e, self.mediascreen);
        };
        animation.play(callback);
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

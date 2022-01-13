class Page {

    // Handles media presentation and scale handling.

    /*******************
     * Public Methods  *
     *******************/
    constructor(text, mediatype, mediadata, show_response, next_delay, instruction=false) {
        
        // page specific variables
        this.text = text;
        this.mediatype = mediatype;
        this.mediadata = mediadata;
        this.show_response = show_response;
        this.next_delay = next_delay; // delay for showing next button in seconds
        this.instruction = instruction;

        // html elements
        this.scale_region = document.getElementById("scale_region");
        this.response_region = document.getElementById("response_region");
        this.target_response_region = document.getElementById("target_response_region");
        this.effort_response_region = document.getElementById("effort_response_region");

        this.probe_reminder = document.getElementById("probe_reminder");
        this.nextbutton = document.getElementById("nextbutton");
        this.mediascreen = document.getElementById("mediascreen");
        this.message = document.getElementById("message");
        this.progress = document.getElementById("progress");

        this.nextbutton.disabled = true;
        this.nextbutton.style.display = 'none';
        this.response_region.style.display = 'none';

        this.target_response_region.style.display = 'none';
        this.target_response_region.style.color = 'black';
        this.effort_response_region.style.display = 'none';

        this.probe_reminder.style.display = 'none';
        this.mediascreen.innerHTML = "";
        this.animation = undefined;

        this.response_slider = document.getElementById("response_slider");
        this.response_slider_clicked = false;
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
        var response = [this.animation.get_td(), this.animation.get_spacebar(),
            this.animation.get_mouseclicks(), this.animation.get_mousemoves(),
            this.response_slider.value]
        console.log("retrieveResponse", response)
        return response
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
        } else if (this.mediatype == 'fullscreen'){
            this.goFullscreen();
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
            this.target_response_region.style.display = 'block';
            this.enableTargetResponse();
        }
    }

    allowNext() {
        //console.log("allowNext")

        // TODO debugging purposes
        //this.nextbutton.disabled = false;
        //this.nextbutton.style.display = "block";
        
        var delay = SKIP_INSTRUCTIONS ? 0 : this.next_delay*1000;
        sleep(delay).then(() => {
            this.nextbutton.disabled = false;
            this.nextbutton.style.display = "block";
        });
    }
    
    checkAllSelected() {
        console.log("checkAllSelected");
        let self = this;
        
        var targets_selected = self.animation.get_td().filter(Boolean).length == self.animation.n_targets;
    
        // if all targets selected, then allow effort response
        if (targets_selected) {
            console.log("targets_selected");
            // self.effort_response_region.style.display = 'block';
            self.probe_reminder.style.display = "block";
            self.allowNext();
            // if effort clicked allow next
            // if (self.response_slider_clicked) {
            //     self.allowNext();
            // } else {
            //     self.nextbutton.disabled = true;
            // }
        }
        console.log("checkAllSelected done");
    }

    // The form will automatically enable the next button
    enableTargetResponse() {
        let self = this;
        
        this.mediascreen.onclick = function(e) {
            self.animation.click(e, self.mediascreen);
            self.checkAllSelected();
        };
        this.response_slider.onclick = function(e) {
            self.response_slider_clicked = true;
            self.checkAllSelected();
        };
        document.onmousemove = function(e) {
            setLeftButtonState(e);
            self.animation.onmousemove(e, self.mediascreen);
        };
    }

    clearResponse() {
        console.log("clearResponse");
        document.onmousemove = function(e) {return;};
        this.mediascreen.onclick = function(e) {return;};
        this.response_slider.value = 50;
        console.log("clearResponse done");
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
                scale_img.width = `${0.75*PAGESIZE}px`;
                scale_img.style.width = `${0.75*PAGESIZE}px`;
                self.scaleMediascreen();
                self.addResponse();
                SCALE_COMPLETE = true;
            }
        }
    }

    adjustContrast() {
        this.mediascreen.innerHTML = make_img(this.mediadata, PAGESIZE) + "<br>";
        let self = this;

        this.scale_region.style.display = 'block';
        var slider_value = document.getElementById("scale_slider");
        var contrast_img = document.getElementById("img");
        
        slider_value.step = 0.5;
        slider_value.value = CONTRAST/2;
        contrast_img.style.filter = `contrast(${CONTRAST}%)`;
    
        this.scaleMediascreen();

        slider_value.oninput = function(e) {
            CONTRAST = e.target.value*2;
            contrast_img.style.filter = `contrast(${CONTRAST}%)`;
            
            console.log(CONTRAST);
            self.addResponse();
        }
    }

    goFullscreen() {
        this.mediascreen.innerHTML = make_fullscreen_button();
        
        var fs_button = document.getElementById("fullscreen_button");
        let self = this;
        fs_button.onclick = function() {
            console.log("click registered for FS");
            openFullscreen();
            self.addResponse();
        }
    }

    scaleMediascreen() {
        this.mediascreen.style.width = `${PAGESIZE}px`;
        this.mediascreen.style.height = `${PAGESIZE}px`;
        this.mediascreen.style.margin = '0 auto';

        // scaling polygon svg inside
        var polygon_svg = document.getElementById('polygon_svg');
        polygon_svg.style.width = `${PAGESIZE}px`;
        polygon_svg.style.height = `${PAGESIZE}px`;
        polygon_svg.style.margin = '0 auto';
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

        this.mediascreen.style.display = 'block';
    }

    // plays animation
    showAnimation() {
        let self = this;

        var scene = this.mediadata[0];
        var probes = this.instruction ? this.mediadata[1] : this.mediadata[2];
        var trial_type = this.instruction ? this.mediadata[2] : "normal";

        var n_probes = probes.length;
        // var current_dataset = this.instruction ? instruction_dataset : dataset;
        var current_dataset = dataset;
        var targets = current_dataset[scene-1]["aux_data"]["targets"];
        var n_dots = targets.length;

        console.log("mediadata", this.mediadata);
        console.log("probes", probes);

        this.mediascreen.innerHTML = make_animation(n_dots, n_probes, trial_type, targets);
        this.scaleMediascreen();

        this.animation = new DotAnimation(scene, probes, trial_type, this.instruction);
        var callback = function() {
            self.addResponse();
        };

        // changing to the color of the video background
        this.mediascreen.style.background = '#e6e6e6';

        this.mediascreen.style.display = 'block';

        this.mediascreen.style.borderStyle = 'solid';
        this.mediascreen.style.borderColor = 'rgba(0, 0, 0, .0)';
        
        var freeze_time = trial_type == "just_movement" ? 0 : 2000;
        this.animation.play(callback, freeze_time);
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

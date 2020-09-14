# MOT Psiturk

Current MOT psiturk for probe experiments

## Setup

### dependencies

- singularity
- wget
- tar


### setup

see help

```bash
chmod +x setup.sh
./setup.sh --help
```

This setup file will, by default, pull a container and data files from dropbox.


## Running psiturk


```bash
chmod +x start_psiturk.sh
./start_psiturk.sh
```


## API

### task.js

The majority of the experiment's functionality is described in `psiturk/static/js/task.js` 

The main class used to setup pages for both the experiment and instructions is defined as `Page`.
`Page` handles both media presentation and scale setup. See the docstrings for more info.

There are three other main elements, `InstructionRunner`, `Quiz`, and `Experiment`. 


### css and html

The main html files are located under `psiturk/templates/` and css is under `psiturk/static/css`.

Notabley, `stage.html` describes the pages for experimental trials and `slider.css` describes some of the elements found in the scale. 



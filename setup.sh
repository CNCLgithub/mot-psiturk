#!/bin/bash

# This script will setup the project environment

# Change any of these values as you see fit.
# For initial run, all should be set to true.
# "pull" : Download from host
# "build" : Build locally
BUILDCONT="none"
SETUPDATA=true


CONT="cont"

# Download links
CONTDOWNLOAD="https://www.dropbox.com/s/sk8wbw4yf32pxvu/cont?dl=0"
# Path to put data
DATAPATH="psiturk/static/data"

# 1) Create the singularity container (requires sudo)
if [ $BUILDCONT = "pull" ]; then
    wget "$CONTDOWNLOAD" -O "cont"
elif [ $BUILDCONT = "build" ]; then
    echo "Building container...(REQUIRES ROOT)"
    if [ ! -d $PWD/.tmp ]; then
        mkdir $PWD/.tmp
    fi
    SINGULARITY_TMPDIR=$PWD/.tmp sudo -E singularity build $CONT  Singularity
else
    echo "Not touching container at ${CONT}"
fi

if [ $SETUPDATA = true ]; then
    wget "https://yale.box.com/shared/static/783r6981qg1are1mgw408apx27au2bmn.gz" -O "data.tar.gz"
    tar -xvzf "data.tar.gz" -C --strip-components=1 "psiturk/"
    rm "data.tar.gz"
    
    # getting the probe movies
    wget "https://yale.box.com/shared/static/nn6gzglvw19mx65kpf8nj4x71bng9r4c.xz" -O "probe_movies.tar.xz"
    tar -xvf "probe_movies.tar.xz" -C "$DATAPATH"
    rm "probe_movies.tar.xz"
fi



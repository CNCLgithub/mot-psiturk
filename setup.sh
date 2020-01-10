#!/bin/bash

# This script will setup the project environment

# Change any of these values as you see fit.
# For initial run, all should be set to true.
# "pull" : Download from host
# "build" : Build locally
BUILDCONT="pull"
SETUPDATA=true


CONT="cont"

# Download links
CONTDOWNLOAD="https://www.dropbox.com/s/sk8wbw4yf32pxvu/cont?dl=0"
DATADOWNLOAD="https://www.dropbox.com/sh/tdghgvcptt2q30h/AACe15My3RJq1_XNHc9ryC9pa?dl=0"
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
    wget "$DATADOWNLOAD" -O "data.zip"
    if [ -d "$DATAPATH" ]; then
        rm -r $DATAPATH/*
    fi
    unzip "data.zip" -d $DATAPATH
    tar -xvzf "$DATAPATH/movies.tar.gz" -C "$DATAPATH"
    mv "$DATAPATH/movies_mask_0" "$DATAPATH/movies"
    rm "$DATAPATH/movies.tar.gz"
fi

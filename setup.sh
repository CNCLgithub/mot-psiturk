#!/bin/bash

# Download links
CONTLINK="library://mebelledonne/default/psiturk-apline:1.0.0"
# Path to put data
DATAPATH="psiturk/static/"
DATALINK="https://yale.box.com/shared/static/p3iae5jx4t14rpo8zka0o0b7w98jql30.gz"


usage="$(basename "$0") [targets...] -- setup an environmental components of project
supported targets:
    cont : either pull the singularity container or build from scratch
    data : pull data
"

git submodule update --init

[ $# -eq 0 ] || [[ "${@}" =~ "help" ]] && echo "$usage"

# container setup
[[ "${@}" =~ "cont" ]] || echo "Not touching container"
[[ "${@}" =~ "cont" ]] && echo "pulling container" && \
    singularity pull "psiturk.sif" "$CONTLINK"

# datasets
[[ "${@}" =~ "data" ]] || [[ "${@}" =~ "data" ]] || echo "Not touching data"
[[ "${@}" =~ "data" ]] && echo "pulling data" && \
    wget "$DATALINK" -O "data.tar.gz" && \
    tar -xvzf "data.tar.gz" -C "$DATAPATH" && \
    rm "data.tar.gz"

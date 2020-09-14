#!/bin/bash

PSICONT="psiturk.sif"

singularity exec "$PSICONT" bash -c "cd psiturk && psiturk"

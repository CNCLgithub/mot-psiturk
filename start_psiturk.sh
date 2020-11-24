#!/bin/bash

PSICONT="psiturk.sif"
CMD="$@"

singularity exec "$PSICONT" bash -c "cd psiturk && psiturk ${CMD}"

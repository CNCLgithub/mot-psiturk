#!/usr/bin/env bash

HOST="$1"
rsync -auv -e "ssh -i ~/cncl-aws.pem" /home/mario/dev/mot-psiturk/* "ubuntu@${HOST}":~/test/mot-psiturk
rsync -auv -e "ssh -i ~/cncl-aws.pem" "ubuntu@${HOST}":~/test/mot-psiturk/* /home/mario/dev/mot-psiturk

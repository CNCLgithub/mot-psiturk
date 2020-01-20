bootstrap: docker
from: ubuntu:18.04



%environment
  export PSITURK_GLOBAL_CONFIG_LOCATION=$HOME

%runscript
  cd psiturk
  exec psiturk
  cd ..

%post
 apt-get update
 apt-get install -y  python3-pip \
                     git
 apt-get clean

 pip3 install psiturk==2.3.3 \
             python-Levenshtein

 #!/bin/bash

# exit if command returns error (non-zero status)
set -e

printf "Node "; node -v;
printf "npm v"; npm -v

printf "\n\n--- GET LATEST VERSION OF NPM 10.5.0 ---\n"
echo "$ npm install -g npm@10.5.0"
npm install -g npm@10.5.0

printf "\nNow running npm v"; npm -v

printf "\n$ npm cache clear\n"
# npm cache verify
npm cache clear -f

printf "\n\n--- INSTALL DEPENDENCIES ---\n"
echo "$ npm ci"
npm ci

printf "\n\n--- INSTALL JEST ---\n"
echo "$ npm install --save-dev jest"
npm install -g jest

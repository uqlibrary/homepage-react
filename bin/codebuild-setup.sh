 #!/bin/bash

# exit if command returns error (non-zero status)
set -e

printf "Node "; node -v;
printf "npm v"; npm -v

printf "\n\n--- GET LATEST VERSION OF NPM---\n"
echo "$ npm install -g npm"
npm install -g npm

printf "\nNow running npm v"; npm -v

printf "\n$ npm cache clear\n"
# npm cache verify
npm cache clear -f

printf "\n\n--- INSTALL DEPENDENCIES ---\n"
echo "$ npm ci --prefer-offline"
npm ci --prefer-offline

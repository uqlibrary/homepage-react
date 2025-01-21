#!/bin/bash
# This script splits the list of Cypress test spec files into two groups,
# with roughly equal numbers of files in each group, and writes the file
# paths for each group to separate text files (bin/group1.txt and bin/group2.txt).
# The script assumes that the test spec files are located in the
# cypress/e2e directory and its subdirectories.

printf "\n ### Running codebuild-parallel.sh ### \n\n"

spec_files=$(find cypress/e2e -name '*.spec.js')
printf "\n spec_files:\n"
echo "$spec_files"
printf "\n"

> bin/group1.txt
> bin/group2.txt
echo "start \n"
index=0
# split the file list so an even run time is likely
echo "$spec_files" | awk '{
    if (NR % 2 == 1) {
        print > "bin/group1.txt"
    } else {
        print > "bin/group2.txt"
    }
}'
echo "split done\n"


# for later:
# # most files in pipeline 1 & 2, some in pipeline 3 after the unit tests have run
#    mod = NR % 5
#    if (mod == 1 || mod == 2) {
#        print > "bin/group1.txt"
#    } else if (mod == 3 || mod == 4) {
#        print > "bin/group2.txt"
#    } else if (mod == 0) {
#        print > "bin/group3.txt"
#    }

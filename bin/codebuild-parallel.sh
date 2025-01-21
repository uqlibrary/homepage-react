#!/bin/bash
# This script splits the list of Cypress test spec files into two groups,
# with roughly equal numbers of files in each group, and writes the file
# paths for each group to separate text files (bin/groupn.txt).
# The script assumes that the test spec files are located in the
# cypress/e2e directory and its subdirectories.

printf "\n ### Running codebuild-parallel.sh ### \n\n"

spec_files=$(find cypress/e2e -name '*.spec.js')
printf "\n spec_files:\n"
echo "$spec_files"
printf "\n"

> bin/group1.txt
> bin/group2.txt
> bin/group3.txt
echo "start \n"
index=0
# split the file list so an even run time is likely
# lots in pipelines 1 & 2 and then a small number to run after the unit tests in pipeline 3
echo "$spec_files" | awk '{
    mod = NR % 5
    if (mod == 1 || mod == 2) {
        print > "bin/group1.txt"
    } else if (mod == 3 || mod == 4) {
        print > "bin/group2.txt"
    } else {
        print > "bin/group3.txt"
    }
}'
echo "split done\n"

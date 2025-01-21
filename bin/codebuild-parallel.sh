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
print_f "\n"

num_specs=$(echo "$spec_files" | wc -l)
group_size_1=$((num_specs / 2))
echo "group_size_1 = $group_size_1"
group_size_2=$((num_specs - group_size_1))
echo "group_size_2 = $group_size_2"
group1=$(echo "$spec_files" | head -n $group_size_1)
group2=$(echo "$spec_files" | tail -n +$(($group_size_2)))
echo "$group1" > bin/group1.txt
echo "$group2" > bin/group2.txt

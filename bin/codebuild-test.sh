#!/bin/bash

export CI_NAME=CodeBuild
export COMMIT_INFO_AUTHOR=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%an")
export COMMIT_INFO_EMAIL=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%ae")
export COMMIT_INFO_MESSAGE=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%B")
export CI_BUILD_URL="https://ap-southeast-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/fez-frontend/executions/${CI_BUILD_NUMBER}"

echo
echo "Commit Info:"
git show ${CI_COMMIT_ID} --no-patch
echo
echo

echo "COMMIT_INFO vars:"
set | grep COMMIT_INFO
echo

if [[ -z $CI_BUILD_NUMBER ]]; then
    printf "(CI_BUILD_NUMBER is not defined. Build stopped.)\n"
    exit 1
fi

if [[ -z $CI_BRANCH ]]; then
    CI_BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi
printf "CI_BRANCH = \"$CI_BRANCH\"\n"

export TZ='Australia/Brisbane'

# Run CC check only (this occurs after test pipelines have finished and output test coverage artifacts)
if [[ $TEST_COVERAGE == 1 ]]; then
    source bin/codebuild-coverage.sh
fi

printf "(Build of branch \"$CI_BRANCH\")\n"

function checkCodeStyle {
    printf "\n--- \e[1mRUNNING CODE STYLE CHECKS\e[0m ---\n"

    FILES=$(npm run codestyles:files -s)
    if [[ "$?" == 0 ]]; then
        printf "\n\e[92mLooks good! Well done.\e[0m\n\n"
    else
        printf "\n\e[91mThese files should pass code style checks but do not:\e[0m\n\n"
        for FILE in $FILES
        do
            printf "\t\e[31m$FILE\e[0m\n"
        done
        printf "\n* Please fix code styles and try again. Running '\e[1m npm run codestyles:fix:all \e[0m' is a good start."
        printf "\n* You can run '\e[1m npm run eslint \e[0m' to view ESLint code quality issues, if any.\n\n"
        exit 1
    fi
}

echo "pwd "
pwd

npm run pretest:unit:ci

# Split the Cypress E2E tests into n groups with roughly equal numbers of files in each group, and writes the testfile
# paths for each group to separate text files (bin/groupn.txt).
# Assumes that the test spec files are located in the cypress/e2e directory and its subdirectories.

printf "\n ### Splitting cypress tests into pipeline groups ### \n\n"

spec_files=$(find cypress/e2e -name '*.spec.js')

> bin/group1.txt
> bin/group2.txt
> bin/group3.txt
echo "start \n"
index=0
# split the file list so an even run time is likely
# lots in pipelines 1 & 2 and then a small number to run after the unit tests in pipeline 3
# this may need rebalancing from time to time, if we add or remove test suites
echo "$spec_files" | awk '{
    if (NR % 8 == 3 || NR % 8 == 4 || NR % 8 == 5) {
        print > "bin/group1.txt"
    } else if (NR % 8 == 0 || NR % 8 == 6) {
        print > "bin/group3.txt"
    } else {
        print > "bin/group2.txt"
    }
}'

case "$PIPE_NUM" in
"1")
    printf "\n ### PIPELINE 1 ### \n\n"
    set -e

    printf "\n--- \e[1mRUNNING E2E TESTS GROUP 1\e[0m ---\n"
    npm run test:e2e:ci1

    if [[ $CODE_COVERAGE_REQUIRED == 1 ]]; then
      sed -i.bak 's,'"$CODEBUILD_SRC_DIR"',,g' coverage/cypress/coverage-final.json
    fi
;;
"2")
    printf "\n ### PIPELINE 2 ### \n\n"
    set -e

    printf "\n--- \e[1mRUNNING Cypress TESTS GROUP 2\e[0m ---\n"
    npm run test:e2e:ci2

    if [[ $CODE_COVERAGE_REQUIRED == 1 ]]; then
        sed -i.bak 's,'"$CODEBUILD_SRC_DIR"',,g' coverage/cypress/coverage-final.json
    fi
;;
"3")
    printf "\n ### PIPELINE 3 ### \n\n"

    checkCodeStyle

    printf "\n\n--- INSTALL JEST ---\n"
    echo "$ npm install -g jest"
    npm install -g jest
    set -e

    printf "\n--- \e[1mRUNNING UNIT TESTS\e[0m ---\n"

    if [[ $CODE_COVERAGE_REQUIRED == 1 ]]; then
        export JEST_HTML_REPORTER_OUTPUT_PATH=coverage/jest/jest-html-report.html
        npm run test:unit:ci
        sed -i.bak 's,'"$CODEBUILD_SRC_DIR"',,g' coverage/jest/coverage-final.json
    else
        npm run test:unit:ci:nocoverage
    fi

    printf "\n--- \e[1mRUNNING Cypress TESTS GROUP 3\e[0m ---\n"
    set -e
    npm run test:e2e:ci3
    if [[ $CODE_COVERAGE_REQUIRED == 1 ]]; then
       sed -i.bak 's,'"$CODEBUILD_SRC_DIR"',,g' coverage/cypress/coverage-final.json
    fi
;;
*)
;;
esac

# Copy empty file to prevent a build failure as we only report on combined cobertura coverage when $TEST_COVERAGE=1
if [[ $CODE_COVERAGE_REQUIRED == 1 ]]; then
    mkdir -p coverage && cp cobertura-sample-coverage.xml coverage/cobertura-coverage.xml
fi

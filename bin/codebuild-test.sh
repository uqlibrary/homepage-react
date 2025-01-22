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

# Not running code coverage check for feature branches.
CODE_COVERAGE_REQUIRED=false
if [[ ($CI_BRANCH == "master" || $CI_BRANCH == "staging" || $CI_BRANCH == "production" || $CI_BRANCH == "prodtest" || $CI_BRANCH == "codebuild" || $CI_BRANCH == *"coverage"*) ]]; then
  # (Putting * around the test-string gives a test for inclusion of the substring rather than exact match)
    CODE_COVERAGE_REQUIRED=true
fi
printf "CODE_COVERAGE_REQUIRED = \"$CODE_COVERAGE_REQUIRED\"\n"

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

# Split the Cypress E2E tests into three groups and in this pipeline run only the ones in the first group
source bin/codebuild-parallel.sh

case "$PIPE_NUM" in
"1")
    printf "\n ### PIPELINE 1 ### \n\n"
    set -e

    printf "\n--- \e[1mRUNNING E2E TESTS GROUP 1\e[0m ---\n"
    npm run test:e2e:ci1

    if [[ $CODE_COVERAGE_REQUIRED == true ]]; then
      sed -i.bak 's,'"$CODEBUILD_SRC_DIR"',,g' coverage/cypress/coverage-final.json
    fi
;;
"2")
    printf "\n ### PIPELINE 2 ### \n\n"
    set -e

    printf "\n--- \e[1mRUNNING Cypress TESTS GROUP 2\e[0m ---\n"
    npm run test:e2e:ci2

    if [[ $CODE_COVERAGE_REQUIRED == true ]]; then
        sed -i.bak 's,'"$CODEBUILD_SRC_DIR"',,g' coverage/cypress/coverage-final.json
    fi
;;
"3")
    printf "\n ### PIPELINE 3 ### \n\n"

    printf "\n\n--- INSTALL JEST ---\n"
    echo "$ npm install -g jest"
    npm install -g jest

    checkCodeStyle
    set -e
    printf "\n--- \e[1mRUNNING UNIT TESTS\e[0m ---\n"

    if [[ $CODE_COVERAGE_REQUIRED == true ]]; then
        export JEST_HTML_REPORTER_OUTPUT_PATH=coverage/jest-serial/jest-html-report.html
        export JEST_HTML_REPORTER_OUTPUT_PATH=coverage/jest/jest-html-report.html
        npm run test:unit:ci
        sed -i.bak 's,'"$CODEBUILD_SRC_DIR"',,g' coverage/jest/coverage-final.json

        pwd

        echo "###  \n### coverage/jest/coverage-final.json"
        ls coverage/jest/coverage-final.json # debug

        mkdir -p coverage/jest-serial
        mv coverage/jest/coverage-final.json coverage/jest-serial/coverage-final.json
    else
        npm run test:unit:ci:nocoverage
    fi

    npm run test:e2e:ci3
    if [[ $CODE_COVERAGE_REQUIRED == true ]]; then
       sed -i.bak 's,'"$CODEBUILD_SRC_DIR"',,g' coverage/cypress/coverage-final.json
    fi
;;
*)
;;
esac

# Copy empty file to prevent a build failure as we only report on combined cobertura coverage when $TEST_COVERAGE=1
if [[ $CODE_COVERAGE_REQUIRED == true ]]; then
    mkdir -p coverage && cp cobertura-sample-coverage.xml coverage/cobertura-coverage.xml
fi

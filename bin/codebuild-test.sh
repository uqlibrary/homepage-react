#!/bin/bash

export CI_NAME=CodeBuild
export COMMIT_INFO_AUTHOR=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%an")
export COMMIT_INFO_EMAIL=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%ae")
export COMMIT_INFO_MESSAGE=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%B")
export CI_BUILD_URL="https://ap-southeast-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/fez-frontend/executions/${CI_BUILD_NUMBER}"
export PW_SHARD_COUNT=10

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

function check_code_style {
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

function fix_coverage_report_paths() {
    sed -i.bak 's,'"$CODEBUILD_SRC_DIR"',,g' "$1"
}

function install_pw_deps() {
    printf "\n--- \e[INSTALLING PW DEPS [STARTING AT $(date)] 1\e[0m ---\n"
    npx playwright install chromium-headless-shell
    npx playwright install-deps chromium-headless-shell
    printf "\n--- \e[ENDED INSTALLING PW DEPS AT $(date)] 1\e[0m ---\n"
}

function run_pw_tests() {
    set -e
    export PW_SHARD_INDEX="$1"
    local LIMIT="$2"

    printf "\n--- \e[1mRUNNING E2E TESTS GROUP #$PIPE_NUM [STARTING AT $(date)] 2\e[0m ---\n"

    while (( PW_SHARD_INDEX <= LIMIT ))
    do
        if (( PW_SHARD_INDEX == LIMIT )); then
            export PW_IS_LAST_SHARD=true
        fi

        run_pw_test_shard "${PW_SHARD_INDEX}"

        if [[ $PW_IS_LAST_SHARD == true ]]; then
            # the cc report merger will take action and produce the file below
            fix_coverage_report_paths "coverage/playwright/coverage-final.json"
        fi

        ((PW_SHARD_INDEX++))
    done

    printf "\n--- [ENDED RUNNING E2E TESTS GROUP #$PIPE_NUM AT $(date)] \n"
}

function run_pw_test_shard() {
    local SHARD_INDEX="${1-PW_SHARD_INDEX}"
    if [[ $CODE_COVERAGE_REQUIRED != 1 ]]; then
        npm run test:e2e -- --shard="${SHARD_INDEX}/${PW_SHARD_COUNT}"
        return 0
    fi

    npm run test:e2e:cc -- -- --shard="${SHARD_INDEX}/${PW_SHARD_COUNT}"
}

echo "pwd "
pwd

echo "start \n"

case "$PIPE_NUM" in
"1")
    npm run start:mock &
    install_pw_deps
    run_pw_tests 1 3
;;
"2")
    npm run start:mock &
    install_pw_deps
    run_pw_tests 4 7
;;
"3")
    printf "\n ### PIPELINE 3 ### \n\n"

    check_code_style

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

    npm run start:mock &
    install_pw_deps
    run_pw_tests 8 10
;;
*)
;;
esac

# Copy empty file to prevent a build failure as we only report on combined cobertura coverage when $TEST_COVERAGE=1
if [[ $CODE_COVERAGE_REQUIRED == 1 ]]; then
    mkdir -p coverage && cp cobertura-sample-coverage.xml coverage/cobertura-coverage.xml
fi

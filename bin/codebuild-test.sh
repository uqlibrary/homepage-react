#!/bin/bash

export CI_NAME=CodeBuild
export COMMIT_INFO_AUTHOR=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%an")
export COMMIT_INFO_EMAIL=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%ae")
export COMMIT_INFO_MESSAGE=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%B")
export CI_BUILD_URL="https://ap-southeast-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/fez-frontend/executions/${CI_BUILD_NUMBER}"
export PWTEST_SHARD_WEIGHTS=47:53 # ENV VAR name expected by PW, please don't rename it. Weight count must equal PW_SHARD_COUNT; splits the e2e suite by test count. 47:53 (not 50:50) because shard 1's tests run slower - a 50:50 count split measured ~783s vs ~673s, so shard 1 sheds a little count to balance duration.
export PW_SHARD_COUNT=2

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

# Put the write-heavy test scratch on tmpfs (RAM) so it does not hit the slow CI disk: coverage/ (the
# istanbul partials, write-once structures and merged report) and TMPDIR (playwright transform cache,
# chromium temp, node compile cache). Requires the runner to allow a tmpfs mount (privileged /
# CAP_SYS_ADMIN); if it cannot, we log and fall back to disk, never fatal. tmpfs is capped (not
# reserved), so it only uses RAM for the data actually written.
setup_ram_scratch() {
    mkdir -p coverage
    if mount -t tmpfs -o size=2g tmpfs "$(pwd)/coverage" 2>/dev/null; then
        printf "RAM scratch: coverage/ on tmpfs\n"
    else
        printf "RAM scratch: coverage/ staying on disk (tmpfs mount unavailable, safe fallback)\n"
    fi
    mkdir -p /ramtmp
    if mount -t tmpfs -o size=2g,mode=1777 tmpfs /ramtmp 2>/dev/null; then
        export TMPDIR=/ramtmp
        printf "RAM scratch: TMPDIR=%s on tmpfs\n" "$TMPDIR"
    else
        printf "RAM scratch: TMPDIR staying on disk (tmpfs mount unavailable, safe fallback)\n"
    fi
}
setup_ram_scratch

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
    if [[ ! -f "$1" ]]; then
        return 0
    fi
    
    sed -i.bak 's,'"$CODEBUILD_SRC_DIR"',,g' "$1"
}

function run_pw_test_shard() {
    set -e
    # Playwright and the chromium browser + its OS deps ship in the official Playwright CI image, so there
    # is nothing to install here.
    export PW_SHARD_INDEX="$1"

    printf "\n--- \e[1mRUNNING E2E TESTS GROUP #${PW_SHARD_INDEX} [STARTING AT $(date)] 2\e[0m ---\n"
    if [[ $CODE_COVERAGE_REQUIRED == 1 ]]; then
        npm run test:e2e:cc -- -- --shard="${PW_SHARD_INDEX}/${PW_SHARD_COUNT}"
        fix_coverage_report_paths coverage/playwright/coverage-final.json
    else
        npm run test:e2e -- --shard="${PW_SHARD_INDEX}/${PW_SHARD_COUNT}"
    fi
    printf "\n--- [ENDED RUNNING E2E TESTS GROUP #${PW_SHARD_INDEX} AT $(date)] \n"
}

case "$PIPE_NUM" in
"1")
    run_pw_test_shard "$PIPE_NUM"
;;
"2")
    run_pw_test_shard "$PIPE_NUM"
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

    # Pipe 3 runs jest only; the e2e suite is split across pipes 1 and 2 (PW_SHARD_COUNT=2) so the
    # jest wall and an e2e shard no longer share a pipe and can be tuned independently.
;;
*)
;;
esac

# Copy empty file to prevent a build failure as we only report on combined cobertura coverage when $TEST_COVERAGE=1
#if [[ $CODE_COVERAGE_REQUIRED == 1 ]]; then
    mkdir -p coverage && cp cobertura-sample-coverage.xml coverage/cobertura-coverage.xml
#fi

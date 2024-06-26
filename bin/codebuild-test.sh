#!/bin/bash

#export CI_BRANCH="$CODEBUILD_SOURCE_VERSION"
#export CI_COMMIT_ID="$CODEBUILD_RESOLVED_SOURCE_VERSION"
#export CI_BUILD_NUMBER="$CODEBUILD_BUILD_ID"
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
set |grep COMMIT_INFO
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
if [[ ($CI_BRANCH == "master" || $CI_BRANCH == "staging" || $CI_BRANCH == "production" || $CI_BRANCH == "codebuild" || $CI_BRANCH == *"coverage"* || $CI_BRANCH == "feature-react-18") ]]; then
    # (Putting * around the test-string gives a test for inclusion of the substring rather than exact match)
    CODE_COVERAGE_REQUIRED=true
fi

export TZ='Australia/Brisbane'

if [[ -z $PIPE_NUM ]]; then
  PIPE_NUM=1
fi

printf "Jest v"; jest --version

function checkCoverage {
     npm run cc:reportAll

     # four instances of `<span class="strong">100% </span>` indicates 100% code coverage
     NUM_FULL_COVERAGE=$(grep -c class=\"strong\"\>100\% coverage/index.html)
     if [[ $NUM_FULL_COVERAGE == 4 ]]; then
         echo "Coverage 100%";
         echo ""
         echo '            ,-""-.'
         echo "           :======:"
         echo "           :======:"
         echo "            '-..-"
         echo "              ||"
         echo "            _,  --.    _____"
         echo "           \(/ __   '._|"
         echo "          ((_/_)\     |"
         echo "           (____)'.___|"
         echo "            (___)____.|_____"
         echo "Human, your code coverage was found to be satisfactory. Great job!"
     else
         echo "                     ____________________"
         echo "                    /                    \ "
         echo "                    |      Coverage       | "
         echo "                    |      NOT 100%       | "
         echo "                    \____________________/ "
         echo "                             !  !"
         echo "                             !  !"
         echo "                             L_ !"
         echo "                            / _)!"
         echo "                           / /__L"
         echo "                     _____/ (____)"
         echo "                            (____)"
         echo "                     _____  (____)"
         echo "                          \_(____)"
         echo "                             !  !"
         echo "                             !  !"
         echo "                             \__/"
         echo ""
         echo "Human, your code coverage was found to be lacking... Do not commit again until it is fixed."
         # show actual coverage numbers
         grep -A 2 class=\"strong\"\> coverage/index.html
         echo "Run your tests locally with npm run test:cc then load coverage/index.html to determine where the coverage gaps are"
         exit 1;
     fi;
}

case "$PIPE_NUM" in
"1")
    # pipeline #1: test the admin pages
    set -e

    if [[ $CODE_COVERAGE_REQUIRED == true ]]; then
        # a code coverage run is split between admin pages and non admin
        # as we dont have enough resources(?) for one big run (cypress randomly fails tests)
        # and it is just waaaay too slow.
        # To do this, we need to change the package.json coverage
        echo "updating package.json to exclude non-admin pages from coverage"
        FILE_REFERENCES=( \
          "src/modules/App/\*\*" \
          "src/modules/Index/\*\*" \
          "src/modules/Pages/BookExamBooth/\*\*" \
          "src/modules/Pages/DigitalLearningObjects/\*\*" \
          "src/modules/Pages/PastExamPaperSearch/\*\*" \
          "src/modules/Pages/PastExamPaperList/\*\*" \
          "src/modules/Pages/LearningResources/\*\*" \
          "src/modules/Pages/NotFound/\*\*" \
          "src/modules/Pages/PaymentReceipt/\*\*" \
          "src/modules/SharedComponents/\*\*" \
        )
        for filepath in "${FILE_REFERENCES[@]}"
        do
            sed -in "s+\!${filepath}+${filepath}+" package.json
        done

        echo "############### PACKAGE.JSON ####################"
        cat package.json
        echo "############### / PACKAGE.JSON ####################"

        printf "\n--- \e[1mRUNNING JEST UNIT TESTS for code coverage check on admin pages\e[0m ---\n"
        npm run test:unit:ci

        printf "\n--- \e[1mRUNNING CYPRESS TESTS for code coverage check on admin pages\e[0m ---\n"
        npm run test:e2e:cc:admin

        checkCoverage
    else
        printf "(Build of feature branch \"$CI_BRANCH\" SKIPS code coverage check)\n"
        printf "\n--- \e[1mRUNNING JEST UNIT TESTS\e[0m ---\n"
        npm run test:unit:ci1:skipcoverage

        # Second runner for e2e. The first one is in the other pipeline.
        printf "\n--- \e[1mRUNNING CYPRESS TESTS\e[0m ---\n"
        npm run test:e2e:dashboard
    fi

;;
"2")
    # pipeline #2: test the non-admin pages
    printf "\n--- \e[1mRUNNING CODE STYLE CHECKS\e[0m ---\n"
    printf "\n$ npm run codestyles:files -s\n"
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

    # Set this after the codestyle checks above, so that this script doesn't exit before any failures can be printed
    set -e

    if [[ $CODE_COVERAGE_REQUIRED == true ]]; then
        # a code coverage run is split between admin pages and non admin
        # as we dont have enough resources(?) for one big run (cypress randomly fails tests)
        # and it is just waaaay too slow.
        # To do this, we need to change the package.json coverage
        echo "updating package.json to exclude admin pages from coverage"
        FILE_REFERENCES=( \
          "src/modules/App/\*\*" \
          "src\/modules\/Pages\/Admin/\*\*"
        )
        for filepath in "${FILE_REFERENCES[@]}"
        do
            sed -in "s+\!${filepath}+${filepath}+" package.json
        done

        echo "############### PACKAGE.JSON ####################"
        cat package.json
        echo "############### / PACKAGE.JSON ####################"

        printf "\n--- \e[1mRUNNING JEST UNIT TESTS for code coverage check on non-admin pages\e[0m ---\n"
        npm run test:unit:ci

        printf "\n--- \e[1mRUNNING CYPRESS TESTS for code coverage check on non-admin pages\e[0m ---\n"
        npm run test:e2e:cc:nonadmin

        checkCoverage

    else
        printf "(Build of feature branch \"$CI_BRANCH\" SKIPS code coverage check)\n"
        printf "\n--- \e[1mRUNNING JEST UNIT TESTS\e[0m ---\n"
        npm run test:unit:ci2

        # Runner for cypress. More is in other pipelines.
        printf "\n--- \e[1mRUNNING CYPRESS TESTS\e[0m ---\n"
        npm run test:e2e:dashboard
    fi

;;
*)
    set -e

    if [[ $CODE_COVERAGE_REQUIRED == false ]]; then
        # Additional dynamic pipelines for cypress tests
        printf "\n--- \e[1mRUNNING CYPRESS TESTS\e[0m ---\n"
        npm run test:e2e:dashboard
    fi
;;
esac
echo "#### AFTER"

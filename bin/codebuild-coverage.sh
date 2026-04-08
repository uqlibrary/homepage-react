#!/bin/bash

printf "\n ### start of codebuild-coverage.sh ###\n"

if [[ $CODE_COVERAGE_REQUIRED == false ]]; then
    printf "\n coverage NOT required\n"

    # Skip CC check
    # Copy empty file to prevent a build failure as we only report on combined cobertura coverage when $TEST_COVERAGE=1
    mkdir -p coverage && cp cobertura-sample-coverage.xml coverage/cobertura-coverage.xml
    exit 0
fi

printf "\n coverage required\n"

# Copy output artifact test reports into common location
mkdir -p coverage/playwright coverage/jest
cp "${CODEBUILD_SRC_DIR_TestArtifact1}/coverage/playwright/coverage-final.json" coverage/playwright/coverage-final-1.json
cp "${CODEBUILD_SRC_DIR_TestArtifact2}/coverage/playwright/coverage-final.json" coverage/playwright/coverage-final-2.json
cp "${CODEBUILD_SRC_DIR_TestArtifact3}/coverage/playwright/coverage-final.json" coverage/playwright/coverage-final-3.json
cp "${CODEBUILD_SRC_DIR_TestArtifact3}/coverage/jest/coverage-final.json" coverage/jest/coverage-final.json

# Merge reports and generate HTML, JSON, text-summary and cobertura output under coverage/
npm run cc:reportAll

cp coverage/cobertura-coverage.xml coverage/cobertura-coverage.xml

# four instances of `<span class="strong">100% </span>` indicates 100% code coverage
grep -c class=\"strong\"\>100\% coverage/index.html

NUM_FULL_COVERAGE=$(grep -c class=\"strong\"\>100\% coverage/index.html)
echo "full coverage count = ${NUM_FULL_COVERAGE} (wanted: 4)"
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
     echo "Human, your code coverage was found to be lacking... Do not commit again until it is fixed."
     # show actual coverage numbers
     grep -A 2 class=\"strong\"\> coverage/index.html
     echo "Run your tests locally with npm run test:cc then load coverage/index.html to determine where the coverage gaps are"
     exit 1;
fi;
exit 0;

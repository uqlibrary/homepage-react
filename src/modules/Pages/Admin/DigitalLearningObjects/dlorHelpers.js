export function splitStringToArrayOnComma(keywordString) {
    let splitStringToArrayOnComma = '';
    if (!!keywordString) {
        // split 'abc, "def, def", "hij"'
        // to ['abc', 'def, def', 'hij']
        splitStringToArrayOnComma = keywordString
            .replace(/[^a-zA-Z0-9- ,"]/g, '')
            .replace(/,/g, ', ') // if they didnt put a space after the comma, add one
            .replace(/,  /g, ', ') // (then correct any doubles)
            .trim()
            .split(/, (?=(?:(?:[^"]*"){2})*[^"]*$)/); // split on the comma, except commas inside quotes
        if (!!splitStringToArrayOnComma && splitStringToArrayOnComma.length > 0) {
            splitStringToArrayOnComma = splitStringToArrayOnComma.map(keyword => {
                return keyword
                    .replace(/^"|"$/g, '') // get rid of surrounding quotes
                    .trim();
            });
        }
    }
    return splitStringToArrayOnComma;
}

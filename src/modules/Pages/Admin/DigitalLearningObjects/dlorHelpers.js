export function splitStringToArrayOnComma(keywordString) {
    let splitStringToArrayOnComma = '';
    if (!!keywordString) {
        // split 'abc, "def, def", "hij"'
        // to ['abc', 'def, def', 'hij']
        splitStringToArrayOnComma = keywordString
            .replace(/,/g, ', ') // if they didnt put a space after the comma, add one
            .replace(/,  /g, ', ') // (then correct any doubles)
            .trim()
            .split(/, (?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (!!splitStringToArrayOnComma && splitStringToArrayOnComma.length > 0) {
            splitStringToArrayOnComma = splitStringToArrayOnComma.map(keyword => keyword.replace(/^"|"$/g, '').trim());
        }
    }
    return splitStringToArrayOnComma;
}

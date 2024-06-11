import { fullPath } from 'config/routes';

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
        /* istanbul ignore else */
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

/**
 * extract the username from the url
 * return prefixed by the correct character, which should be either '?' or '&'
 * @param appendType
 * @returns {string}
 */
export function getUserPostfix(appendType = '?') {
    let userString = '';
    if (window.location.hostname === 'localhost') {
        const queryString = new URLSearchParams(
            window.location.search || window.location.hash.substring(location.hash.indexOf('?')),
        );

        // Get user from query string
        const user = !!queryString && queryString.get('user');
        userString = !!user ? `${appendType}user=${user}` : '';
    }
    return userString;
}

export const dlorAdminLink = (dlorPath = '') => {
    const userString = getUserPostfix();
    return `${fullPath}/admin/dlor${dlorPath}${userString}`;
};

export const isValidEmail = testEmail => {
    return testEmail?.length >= 'ab@ab'.length && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(testEmail);
};

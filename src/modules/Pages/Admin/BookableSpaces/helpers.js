import { fullPath } from 'config/routes';
import { isSpacesAdminUser } from 'helpers/access';

export const getPathRoot = () => {
    /* istanbul ignore next */
    if (fullPath === 'https://homepage-production.library.uq.edu.au') {
        return 'https://www.library.uq.edu.au';
    }
    return fullPath;
};

/**
 * extract the username from the url
 * return prefixed by the correct character, which should be either '?' or '&'
 * @param appendType
 * @returns {string}
 */
export function getUserPostfix(appendType = '?') {
    let userString = '';
    /* istanbul ignore next */
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

export const spacesAdminLink = (spacesPath = '', /* istanbul ignore next */ account = null) => {
    const userString = getUserPostfix();
    return isSpacesAdminUser(account)
        ? `${getPathRoot()}/admin/spaces${spacesPath}${userString}`
        : `${getPathRoot()}/spaces${spacesPath}${userString}`;
};

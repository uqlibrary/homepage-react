import global from 'locale/global';

export const leftJoin = (objArr1, objArr2, key1, key2) => {
    if (!objArr2) {
        return objArr1;
    }
    return objArr1.map(anObj1 => ({
        ...objArr2.find(anObj2 => anObj1[key1] === anObj2[key2]),
        ...anObj1,
    }));
};

export const stripHtml = html => {
    const temporalDivElement = document.createElement('div');
    temporalDivElement.innerHTML = html;
    return (
        temporalDivElement.textContent ||
        /* istanbul ignore next */ temporalDivElement.innerText ||
        /* istanbul ignore next */ ''
    );
};

export const getCampusByCode = code => {
    const campuses = global.campuses;
    if (campuses.hasOwnProperty(code)) {
        return campuses[code];
    }

    return null;
};

// there have been cases where someone has put a book on the corner of a keyboard,
// which sends thousands of requests to the server - block this
// length has to be 4, because subjects like FREN3111 have 3 repeating numbers...
export const isRepeatingString = searchString => {
    if (searchString.length <= 4) {
        return false;
    }
    const lastChar = searchString.charAt(searchString.length - 1);
    const char2 = searchString.charAt(searchString.length - 2);
    const char3 = searchString.charAt(searchString.length - 3);
    const char4 = searchString.charAt(searchString.length - 4);
    const char5 = searchString.charAt(searchString.length - 5);

    return lastChar === char2 && lastChar === char3 && lastChar === char4 && lastChar === char5;
};

export const unescapeString = text => {
    if (text === null) {
        return '';
    }
    const getEntityMap = s => {
        const entityMap = {
            '&amp;': ' and ',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'",
            '&#x2F;': '/',
        };

        return entityMap[s];
    };
    return text.replace(/&[#\w]+;/g, getEntityMap);
};

// "A fetch() promise does not reject on HTTP errors (404, etc.).
// Instead, a then() handler must check the Response.ok and/or Response.status properties."
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
export const throwFetchErrors = response => {
    if (!response.ok) {
        const status = response.status || 'status undefined';
        const statusText = response.statusText || 'status message undefined';
        throw Error(`Error ${status} - ${statusText}`);
    }
    return response;
};

/**
 * extract the username from the url
 * return prefixed by the correct character, which should be either '?' or '&'
 * @param appendType
 * @returns {string}
 */
export function getUserPostfix(appendType = '?') {
    let userString = '';
    if (window.location.hostname === 'localhost') {
        const queryString = require('query-string');
        // Get user from query string
        const user = queryString.parse(location.search || location.hash.substring(location.hash.indexOf('?'))).user;
        userString = !!user ? `${appendType}user=${user}` : '';
    }
    return userString;
}

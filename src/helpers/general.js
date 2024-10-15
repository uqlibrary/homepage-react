import global from 'locale/global';
const moment = require('moment');

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
    /* istanbul ignore else */
    if (!response.ok) {
        const status = response.status || 'status undefined';
        const statusText = response.statusText || 'status message undefined';
        throw Error(`Error ${status} - ${statusText}`);
    }
    /* istanbul ignore next */
    return response;
};

// per https://medium.com/@botfather/react-loading-chunk-failed-error-88d0bb75b406
export const lazyRetry = (importFn, retries = 3, interval = 500) => {
    return new Promise((resolve, reject) => {
        importFn()
            .then(resolve)
            .catch(
                /* istanbul ignore next */ error => {
                    if (!retries) {
                        reject(error);
                        return;
                    }

                    setTimeout(() => {
                        lazyRetry(importFn, retries - 1).then(resolve, reject);
                    }, interval);
                },
            );
    });
};

export function scrollToTopOfPage() {
    const topOfPage = document.getElementById('StandardPage');
    !!topOfPage && typeof topOfPage.scrollIntoView === 'function' && topOfPage.scrollIntoView();
}

// this is very basic, because thats all that seems required so far

export const pluralise = (singularWord, count, pluralWordSpecial = null) => {
    if (count > 1 && pluralWordSpecial !== null) {
        return pluralWordSpecial;
    }
    if (count > 1) {
        return `${singularWord}s`;
    }
    return singularWord;
};

const greetings = {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
};
export const greeting = (currentTime = null) => {
    const time = currentTime ?? moment().format('H');
    if (time < 12) {
        return greetings.morning;
    } else if (time >= 12 && time < 18) {
        return greetings.afternoon;
    } else {
        return greetings.evening;
    }
};

// for dev only - after 2024 golive this can just be web.library
/**
 * @param pathname {string} the path name to appended to the correct domain, eg /about
 * @param requestedDomainName {string|null}
 *     for test coverage only, the domain of the current page. Default: the domain of the current page
 * @returns string
 */
export const linkToDrupal = (pathname, requestedDomainName = null) => {
    const domainName = requestedDomainName ?? document.location.hostname;
    const origin = ['localhost', 'homepage-development.library.uq.edu.au'].includes(domainName)
        ? 'https://live-library-uq.pantheonsite.io'
        : 'https://web.library.uq.edu.au';
    return `${origin}${pathname}`;
};

export function isKeyPressed(e, charKeyInput, numericKeyInput) {
    const keyNumeric = e.charCode || e.keyCode;
    const keyChar = e.key || /* istanbul ignore next */ e.code;
    return keyChar === charKeyInput || keyNumeric === numericKeyInput;
}
export function isReturnKeyPressed(e) {
    return isKeyPressed(e, 'Enter', 13);
}
export function isEscapeKeyPressed(e) {
    return isKeyPressed(e, 'Escape', 27);
}

// note: this logic is duplicated in reusable
/* istanbul ignore next */
export function getHomepageLink(hostname = null, protocol = null, port = null, pathname = null, search = null) {
    const _protocol = protocol === null ? window.location.protocol : protocol;
    const _hostname = hostname === null ? window.location.hostname : hostname;
    let homepagelink = 'https://www.library.uq.edu.au';
    if (_hostname === 'homepage-development.library.uq.edu.au') {
        const _pathname = pathname === null ? window.location.pathname : pathname;
        homepagelink = `${_protocol}//${_hostname}${_pathname}#/`;
    } else if (_hostname === 'dev-homepage.library.uq.edu.au') {
        // local dev against staging api eg http://dev-homepage.library.uq.edu.au:2020/#/digital-learning-hub with npm run start:url
        const _port = port === null ? window.location.port : port;
        homepagelink = `${_protocol}//${_hostname}:${_port}/#/`;
    } else if (_hostname.endsWith('.library.uq.edu.au')) {
        homepagelink = `${_protocol}//${_hostname}`;
    } else if (_hostname === 'localhost') {
        const _port = port === null ? window.location.port : port;
        const _search = search === null ? window.location.search : search;
        const urlParams = new URLSearchParams(_search);
        const userParam = urlParams.get('user');
        const linkParameters = !!userParam ? `?user=${userParam}` : '';
        homepagelink = `${_protocol}//${_hostname}:${_port}/${linkParameters}`;
    }
    // console.log('getHomepageLink:: homepagelink=', homepagelink);
    return homepagelink;
}

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

export const _courseLink = (courseCode, url) => {
    let _url = url;
    if (document.location.host !== 'www.library.uq.edu.au' && _url.startsWith('https://www.library.uq.edu.au/')) {
        let homepageLink = getHomepageLink();
        let params = '';
        const tempUrl = new URL(homepageLink);
        params = tempUrl.search;
        homepageLink = homepageLink.replace(params, '');
        _url = _url.replace('https://www.library.uq.edu.au/', homepageLink) + params;
    }
    return _url.replace('[courseCode]', courseCode);
};

export const _pluralise = (word, num) => {
    return word + (num === 1 ? '' : 's');
};

const a11yTabId = (label, index) => `${label}-${index}`;
const a11yPanelId = (label, index) => `${label}-panel-${index}`;

export const a11yProps = (index, classname = null) => {
    const menuLabel = 'topmenu';
    const label = classname || menuLabel;
    return {
        id: a11yTabId(label, index),
        'aria-controls': a11yPanelId(label, index),
    };
};

export const reverseA11yProps = (index, classname = null) => {
    const menuLabel = 'topmenu';
    const label = classname || menuLabel;
    return {
        id: a11yPanelId(label, index),
        'aria-labelledby': a11yTabId(label, index),
    };
};

export const extractSubjectCodeFromName = subjectName => (subjectName || '').trim().split(' ')[0];

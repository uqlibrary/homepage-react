import { getHomepageLink } from 'helpers/access';

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

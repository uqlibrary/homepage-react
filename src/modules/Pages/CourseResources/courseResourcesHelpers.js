export const _courseLink = (courseCode, url) => {
    return url.replace('[courseCode]', courseCode);
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

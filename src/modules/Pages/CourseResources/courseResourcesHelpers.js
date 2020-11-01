export const _courseLink = (courseCode, url) => {
    return url.replace('[courseCode]', courseCode);
};

export const _pluralise = (word, num) => {
    return word + (num === 1 ? '' : 's');
};

const a11yId = (label, index) => `${label}-${index}`;
const a11yControls = (label, index) => `${label}-panel-${index}`;

export const a11yProps = (index, classname = null) => {
    const menuLabel = 'topmenu';
    const label = classname || menuLabel;
    return {
        id: a11yId(label, index),
        'aria-controls': a11yControls(label, index),
    };
};

export const reverseA11yProps = (index, classname = null) => {
    const menuLabel = 'topmenu';
    const label = classname || menuLabel;
    return {
        id: a11yControls(label, index),
        'aria-labelledby': a11yId(label, index),
    };
};

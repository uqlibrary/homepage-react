export const _courseLink = (courseCode, url) => {
    return url.replace('[courseCode]', courseCode);
};

export const _pluralise = (word, num) => {
    return word + (num === 1 ? '' : 's');
};

export const a11yProps = (index, classname = null) => {
    const menuLabel = 'topmenu';
    const label = classname || menuLabel;
    return {
        id: `${label}-${index}`,
        'aria-controls': `${label}-panel-${index}`,
    };
};

export const reverseA11yProps = (index, classname = null) => {
    const menuLabel = 'topmenu';
    const label = classname || menuLabel;
    return {
        'aria-labelledby': `${label}-${index}`,
        id: `${label}-panel-${index}`,
    };
};

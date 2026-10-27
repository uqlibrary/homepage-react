import { getBody } from '../alerthelpers';

const moment = require('moment');

export const isInvalidStartDate = (startDate, defaults) => {
    return (startDate !== '' && startDate < defaults.startDateDefault) || !moment(startDate).isValid();
};

export const isInvalidEndDate = (endDate, startDate) => {
    return (startDate !== '' && endDate <= startDate) || !moment(endDate).isValid();
};

export const expandValues = (expandableValues, defaults) => {
    // because otherwise we see 'false' when we clear the field
    const newAlertTitle = expandableValues.alertTitle || '';

    const newLinkTitle = expandableValues.linkTitle || '';
    const newLinkUrl = expandableValues.linkUrl || '';

    const newBody = getBody(expandableValues);

    const newStartDate = expandableValues.startDate || defaults.startDateDefault;
    const newEndDate = expandableValues.endDate || defaults.endDateDefault;

    return {
        ...expandableValues,
        ['alertTitle']: newAlertTitle,
        ['body']: newBody,
        ['linkTitle']: newLinkTitle,
        ['linkUrl']: newLinkUrl,
        ['startDate']: newStartDate,
        ['endDate']: newEndDate,
        // ['systems']: expandableValues.systems || [],
    };
};

export const SYSTEM_PANEL_ALL = 0;
export const SYSTEM_PANEL_SHOW = 1;
export const SYSTEM_PANEL_HIDE = 2;
const getSystemConfirmationMessage = (values, systemTabValue) => {
    const joinSystemNames = systems => {
        const localSystem = [...(systems || [])];
        const lastName = localSystem?.pop() || '';
        let joinedNames;
        if (localSystem?.length === 0) {
            joinedNames = lastName;
        } else {
            joinedNames = localSystem?.join(', ') + ' and ' + lastName;
        }
        return joinedNames;
    };

    if (systemTabValue === SYSTEM_PANEL_SHOW) {
        return 'This alert will be displayed on ' + joinSystemNames(values?.systemsShownOn);
    }
    if (systemTabValue === SYSTEM_PANEL_HIDE) {
        return 'This alert will be displayed all systems EXCEPT ' + joinSystemNames(values?.systemsHiddenFrom);
    }
    return 'This alert will be displayed on all systems';
};
export const editConfirmationDetails = (locale, values, systemTabValue) => {
    return {
        ...locale,
        confirmationMessage: getSystemConfirmationMessage(values, systemTabValue),
    };
};

export const postAddConfirmationDetails = (locale, countSuccess, values, systemTabValue) => {
    // update the number of alerts saved if they saved multiple date-sets
    return {
        ...locale,
        confirmationTitle: locale.confirmationTitle.replace(
            'An alert has',
            countSuccess > 1 ? `${countSuccess} alerts have` : 'An alert has',
        ),
        confirmationMessage: getSystemConfirmationMessage(values, systemTabValue),
    };
};

export const postAddCloneDetails = (locale, countSuccess) => {
    // update the number of alerts saved if they saved multiple date-sets
    return {
        ...locale,
        confirmationTitle: locale.confirmationTitle.replace(
            'The alert has',
            countSuccess > 1 ? `${countSuccess} alerts have` : 'The alert has',
        ),
    };
};

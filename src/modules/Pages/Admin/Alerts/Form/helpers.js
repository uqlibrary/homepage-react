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
        ['systems']: expandableValues.systems || [],
    };
};

export const postAddConfirmationDetails = (locale, countSuccess) => {
    // update the number of alerts saved if they saved multiple date-sets
    return {
        ...locale,
        confirmationTitle: locale.confirmationTitle.replace(
            'An alert has',
            countSuccess > 1 ? `${countSuccess} alerts have` : 'An alert has',
        ),
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

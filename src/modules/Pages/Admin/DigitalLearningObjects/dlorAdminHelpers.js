import { getPathRoot } from 'modules/Pages/DigitalLearningObjects/dlorHelpers';
import { DLOR_FAVOURITES_REPORT_API } from 'repositories/routes';
import { get } from 'repositories/generic';
const moment = require('moment');
export function splitStringToArrayOnComma(keywordString) {
    let splitStringToArrayOnComma = '';
    if (!!keywordString) {
        // split 'abc, "def, def", "hij"'
        // to ['abc', 'def, def', 'hij']
        splitStringToArrayOnComma = keywordString
            .replace(/[^a-zA-Z0-9- ,"]/g, '')
            .replace(/,/g, ', ') // if they didnt put a space after the comma, add one
            .replace(/,  /g, ', ') // (then correct any doubles)
            .trim()
            .split(/, (?=(?:(?:[^"]*"){2})*[^"]*$)/); // split on the comma, except commas inside quotes
        /* istanbul ignore else */
        if (!!splitStringToArrayOnComma && splitStringToArrayOnComma.length > 0) {
            splitStringToArrayOnComma = splitStringToArrayOnComma.map(keyword => {
                return keyword
                    .replace(/^"|"$/g, '') // get rid of surrounding quotes
                    .trim();
            });
        }
    }
    return splitStringToArrayOnComma;
}

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

export const dlorAdminLink = (dlorPath = '') => {
    const userString = getUserPostfix();
    return `${getPathRoot()}/admin/dlor${dlorPath}${userString}`;
};

export const isValidEmail = testEmail => {
    return testEmail?.length >= 'ab@ab'.length && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(testEmail);
};

const escapeCSVField = field => {
    if (field === null || field === undefined) {
        return '';
    }

    // Convert to string
    const stringField = String(field);

    // If field contains quotes, commas, or newlines, it needs to be escaped
    if (stringField.includes('"') || stringField.includes(',') || stringField.includes('\n')) {
        // 1. Replace double quotes with two double quotes (escape quotes)
        // 2. Wrap the entire field in quotes
        return `"${stringField.replace(/"/g, '""')}"`;
    }

    return stringField;
};

export const exportDemographicsToCSV = (data, filename) => {
    /* istanbul ignore next */
    if (!data || data.length === 0) {
        console.error('No demographics data to export.');
        return;
    }

    const headerNameMap = {
        object_public_uuid: 'Object ID',
        object_title: 'Title',
        object_summary: 'Summary',
        demographics_event_date: 'Event Date',
        demographics_subject_code: 'Subject Code',
        demographics_school_name: 'School Name',
        demographics_user_name: 'Username',
        demographics_comments: 'Comments',
    };

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add headers
    csvRows.push(headers.map(header => headerNameMap[header]).join(','));

    // Add data rows
    data.forEach(item => {
        const values = headers.map(header => {
            const value = item[header] || '';
            return escapeCSVField(value);
        });
        csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.setAttribute('data-testid', 'download-demographics-link');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const exportFavouritesToCSV = (data, filename) => {
    /* istanbul ignore next */
    if (!data || data.length === 0) {
        console.error('No favourites data to export.');
        return;
    }

    const headerNameMap = {
        public_uuid: 'Object ID',
        username: 'User Name',
        title: 'Object Title',
        description: 'Object Description',
    };

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add headers
    csvRows.push(headers.map(header => headerNameMap[header]).join(','));

    // Add data rows
    data.forEach(item => {
        const values = headers.map(header => {
            const value = item[header];
            return escapeCSVField(value);
        });
        csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.setAttribute('data-testid', 'download-demographics-link');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const fetchAndExportFavouritesToCSV = async filename => {
    try {
        const { data } = await get(DLOR_FAVOURITES_REPORT_API());
        const favouritesData = data.data || /* istanbul ignore next */ data;
        exportFavouritesToCSV(favouritesData, filename);
    } catch (error) {
        console.error('Error exporting favourites:', error);
        throw error;
    }
};

export const exportDLORDataToCSV = (data, filename) => {
    /* istanbul ignore next */
    if (!data || data.length === 0) {
        console.error('No data to export.');
        return;
    }

    const headerNameMap = {
        object_id: 'Object ID',
        object_public_uuid: 'Public UUID',
        object_title: 'Title',
        object_description: 'Description',
        object_summary: 'Summary',
        object_review_date_next: 'Next Review Date',
        object_status: 'Status',
        object_owning_team_id: 'Team ID',
        publishing_user_name: 'Publishing User',
        team_name: 'Team Name',
        object_download_instructions: 'Download Instructions',
        object_keywords: 'Keywords',
        object_link_interaction_type: 'Interaction Type',
        graduate_attributes: 'Graduate Attributes',
    };

    const headers = Object.keys(data[0]).filter(key => key !== 'object_filters');
    const filterTypes = new Set();

    data.forEach(item => {
        /* istanbul ignore else */
        if (item.object_filters) {
            item.object_filters.forEach(filter => {
                filterTypes.add(filter.filter_key);
            });
        }
    });

    const allHeaders = [...headers, ...Array.from(filterTypes), 'publishing_user_name', 'team_name'].filter(
        header => header !== 'owner',
    );
    const csvRows = [];

    // Use the map function to transform headers with custom names
    csvRows.push(allHeaders.map(header => headerNameMap[header] || header).join(','));

    data.forEach(item => {
        const values = allHeaders.map(header => {
            let value;

            if (header === 'publishing_user_name') {
                value = item.owner?.publishing_user_username || /* istanbul ignore next */ '';
            } else if (header === 'team_name') {
                value = item.owner?.team_name || /* istanbul ignore next */ '';
            } else if (item.object_filters && filterTypes.has(header)) {
                const matchingFilter = item.object_filters.find(filter => filter.filter_key === header);
                // Just join the values with semicolons, escape at the end
                value = matchingFilter ? matchingFilter.filter_values.map(fv => fv.name).join(';') : '';
            } else {
                value = item[header];
                // *** boolean fields value conversion ***
                const booleanHeaders = ['object_is_featured', 'object_cultural_advice'];
                if (booleanHeaders.includes(header)) {
                    value = value === 1 ? 'yes' : 'no';
                }
                // *** DATE FORMATTING LOGIC ***
                const dateHeaders = ['date', 'created_at'];

                if (dateHeaders.some(dateHeader => header.includes(dateHeader))) {
                    /* istanbul ignore else */
                    if (value) {
                        const date = moment(value); // Use moment.js to parse the date
                        /* istanbul ignore else */
                        if (date.isValid()) {
                            value = date.format('MMMM DD, YYYY');
                        } else {
                            value = 'Invalid Date';
                        }
                    }
                }

                if (Array.isArray(value)) {
                    value = value
                        .map(v => {
                            /* istanbul ignore next */
                            if (typeof v === 'object') {
                                /* istanbul ignore next */
                                return JSON.stringify(v);
                            }
                            return v;
                        })
                        .join(';');
                } else if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }
            }
            // Single escape at the end
            return escapeCSVField(value);
        });
        csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.setAttribute('data-testid', 'download-link'); // Add data-testid attribute
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

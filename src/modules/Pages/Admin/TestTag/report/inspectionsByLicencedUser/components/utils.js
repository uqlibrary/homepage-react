import locale from '../../../testTag.locale';
const moment = require('moment');

export const getNameStyles = (name, inspectorName, theme) => ({
    fontWeight:
        inspectorName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
});

export const transformRow = row => {
    return row.map(line => ({
        ...line,
        start_date: !!line?.start_date ? moment(line.start_date).format(locale.config.format.dateFormatNoTime) : '--',
        end_date: !!line?.start_date ? moment(line.end_date).format(locale.config.format.dateFormatNoTime) : '--',
    }));
};

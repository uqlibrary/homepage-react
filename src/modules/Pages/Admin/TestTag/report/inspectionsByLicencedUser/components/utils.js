import locale from '../../../testTag.locale';
const moment = require('moment');

export const getNameStyles = (name, inspectorName, theme) => ({
    fontWeight:
        inspectorName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
});

export const transformRow = row => {
    return row.map(line => {
        if (!!line.processed) return line;
        return {
            ...line,
            start_date: !!line?.start_date
                ? moment(new Date(line.start_date)).format(locale.config.format.dateFormatNoTime)
                : '--',
            end_date:
                !!line?.start_date && !!line?.end_date
                    ? moment(new Date(line.end_date)).format(locale.config.format.dateFormatNoTime)
                    : '--',
            processed: true,
        };
    });
};

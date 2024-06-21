import locale from '../../../testTag.locale';
const moment = require('moment');

export const transformRow = row => {
    return row.map(line => {
        if (!!line.processed) return line;
        return {
            ...line,
            start_date: !!line?.start_date
                ? moment(line.start_date).format(locale.config.format.dateFormatNoTime)
                : '--',
            end_date:
                !!line?.start_date && !!line?.end_date
                    ? moment(line.end_date).format(locale.config.format.dateFormatNoTime)
                    : '--',
            processed: true,
        };
    });
};

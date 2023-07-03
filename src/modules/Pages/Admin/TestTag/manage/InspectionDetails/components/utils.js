import moment from 'moment';
import locale from '../../../testTag.locale';
const dateFormat = locale.config.format.dateFormatNoTime;

export const transformRow = row => {
    return row.map(line => {
        if (!!row.user_name) return row;
        return {
            asset_id: line.asset_id,
            asset_id_displayed: line.asset_id_displayed,
            asset_type: line.asset_type?.asset_type_name,
            asset_status: line.asset_status,
            user_name: line.last_inspection?.user_name,
            inspect_date: !!line.last_inspection ? moment(line.last_inspection.inspect_date).format(dateFormat) : '',
            inspect_notes: line.last_inspection?.inspect_notes,
            inspect_fail_reason: line.last_inspection?.inspect_fail_reason,
            discard_reason: line.last_discard?.discard_reason,
            repairer_name: line.last_repair?.repairer_name,
        };
    });
};

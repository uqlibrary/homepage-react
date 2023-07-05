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
            inspect_notes: line.last_inspection?.inspect_notes ?? '',
            inspect_fail_reason: line.last_inspection?.inspect_fail_reason ?? '',
            discard_reason: line.last_discard?.discard_reason ?? '',
            repairer_name: line.last_repair?.repairer_name ?? '',
            last_inspect_status: line.last_inspection?.inspect_status ?? '',
        };
    });
};

export const transformUpdateRequest = request => {
    const clonedRequest = structuredClone(request);
    const { asset_status: assetStatus, last_inspect_status: lastInspectStatus } = clonedRequest;
    const defaultValues = { inspect_notes: clonedRequest.inspect_notes };

    switch (assetStatus) {
        case locale.config.assetStatus.current:
            return defaultValues;
        case locale.config.assetStatus.failed:
            return { ...defaultValues, inspect_fail_reason: clonedRequest.inspect_fail_reason };
        case locale.config.assetStatus.outforrepair:
            return {
                ...defaultValues,
                inspect_fail_reason: clonedRequest.inspect_fail_reason,
                repairer_name: clonedRequest.repairer_name,
            };
        case locale.config.assetStatus.discarded:
            return {
                ...defaultValues,
                ...(lastInspectStatus === locale.config.inspectStatus.failed
                    ? { inspect_fail_reason: clonedRequest.inspect_fail_reason }
                    : {}),
                discard_reason: clonedRequest.discard_reason,
            };
        default:
            return request;
    }
};

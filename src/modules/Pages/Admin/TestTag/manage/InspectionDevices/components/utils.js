import moment from 'moment';
import locale from '../../../testTag.locale';
const dateFormat = locale.pages.manage.config.dateFormat;

export const emptyActionState = { isAdd: false, isEdit: false, isDelete: false, title: '', row: {} };
export const actionReducer = (_, action) => {
    const { type, row, title, ...props } = action;
    switch (type) {
        case 'add':
            return {
                isAdd: true,
                isEdit: false,
                isDelete: false,
                row: {
                    device_id: 'auto',
                    device_calibrated_date_last: moment().format(dateFormat),
                    device_calibration_due_date: moment()
                        .add(1, 'd')
                        .format(dateFormat),
                },
                title,
                props: { ...props },
            };
        case 'edit':
            return { isAdd: false, isEdit: true, isDelete: false, title, row, props: { ...props } };
        case 'delete':
            return { isAdd: false, isEdit: false, isDelete: true, title, row, props: { ...props } };
        case 'clear':
            return { ...emptyActionState };
        default:
            throw `Unknown action '${type}'`;
    }
};

export const formatDateStrings = (row, suffix) => {
    const dateLastParts = row.device_calibrated_date_last.split(' ');
    const dateNextParts = row.device_calibration_due_date.split(' ');
    return {
        ...row,
        device_calibrated_date_last:
            dateLastParts.length > 1 ? row.device_calibrated_date_last : `${row.device_calibrated_date_last} ${suffix}`,
        device_calibration_due_date:
            dateNextParts.length > 1 ? row.device_calibration_due_date : `${row.device_calibration_due_date} ${suffix}`,
    };
};

export const transformAddRequest = (request, user) => {
    delete request.device_id;
    delete request.device_current_flag;

    const newResponse = { ...formatDateStrings(request, '00:00:00'), device_department: user.user_department };
    return newResponse;
};

export const transformUpdateRequest = request => {
    delete request.device_current_flag;

    const newResponse = formatDateStrings(request, '00:00:00');
    return newResponse;
};

export const transformRow = row => {
    return row.map(line => ({
        ...line,
        device_calibrated_date_last: moment(line.device_calibrated_date_last).format(
            locale.config.format.dateFormatNoTime,
        ),
        device_calibration_due_date: moment(line.device_calibration_due_date).format(
            locale.config.format.dateFormatNoTime,
        ),
    }));
};

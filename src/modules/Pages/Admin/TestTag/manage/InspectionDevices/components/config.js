/* istanbul ignore file */

import React from 'react';

import moment from 'moment';
import TextField from '@mui/material/TextField';

import { isEmptyStr } from '../../../helpers/helpers';
import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
import { WarningOutlined } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
const dateFormat = locale.config.format.dateFormatNoTime;

/**
 * @param value {*}
 * @return {boolean}
 */
const isValidaDate = value => {
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (typeof value !== 'string' || !value || !regex.test(value)) return false;
    return moment(value, dateFormat).isValid();
};

/**
 * @param value {*}
 * @param min {moment.MomentInput}
 * @param max {moment.MomentInput}
 * @return {boolean}
 */
const isValidDateRange = (value, min, max) => moment(value, dateFormat, true).isBetween(min, max, 'day', '[]');

const makeNextCalibrateDateField = () => {
    let deviceId;
    let initialValue;
    let lowerRange;
    let upperRange;

    return {
        component: props => (
            <TextField
                variant="standard"
                format={dateFormat}
                type="date"
                {...props}
                inputProps={{
                    ...props.inputProps,
                    min: moment()
                        .add(1, 'd')
                        .format(dateFormat),
                }}
                required
            />
        ),
        // last calibrate date range validation
        validate: (value, data) => {
            // recalculate range bounds only when the device changes
            if (deviceId !== data.device_id) {
                deviceId = data.device_id;
                initialValue = data.device_calibration_due_date;

                // existing entries valid date range: BETWEEN [now] AND [+1 year]
                lowerRange = moment();
                upperRange = moment().add(1, 'year');
                if (deviceId === 'auto') {
                    // new entries valid date range: BETWEEN [now] AND [+1 year, +1 day]
                    upperRange.add(1, 'day');
                    initialValue = moment()
                        .add(1, 'day')
                        .format(dateFormat);
                }
            }

            return !(
                value === initialValue || // allow existing unchanged values
                (isValidaDate(value) && isValidDateRange(value, lowerRange, upperRange))
            );
        },
        valueFormatter: date => date?.split(' ')?.[0] ?? date,
        fieldParams: {
            canEdit: true,
            minWidth: 180,
            renderCell: params => {
                const date = params.value;
                const dateObject = moment(date, locale.pages.inspect.config.dateFormatNoTime);
                const currentDate = moment();
                const isPastDate = dateObject.isBefore(currentDate);
                return (
                    <>
                        {date}
                        {isPastDate && (
                            <Tooltip
                                style={{ padding: '5px', height: 20 }}
                                title={locale.pages.report.inspectionsDue.tooltips.overdue}
                            >
                                <WarningOutlined />
                            </Tooltip>
                        )}
                    </>
                );
            },
        },
    };
};

const makeLastCalibrateDateField = () => {
    let deviceId;
    let initialValue;
    let lowerRange;
    let upperRange;

    return {
        component: props => (
            <TextField
                variant="standard"
                format={dateFormat}
                type="date"
                {...props}
                inputProps={{ ...props.inputProps, max: moment().format(dateFormat) }}
                required
            />
        ),
        // last calibrate date range validation
        validate: (value, data) => {
            // recalculate range bounds only when the device changes
            if (deviceId !== data.device_id) {
                deviceId = data.device_id;
                initialValue = data.device_calibrated_date_last;
                // new entries valid date range: BETWEEN [-1 year] AND [now]
                if (deviceId === 'auto') {
                    lowerRange = moment(value, dateFormat).subtract(1, 'year');
                    upperRange = moment();
                } else {
                    // existing entries valid date range: BETWEEN [existing date] AND [now]
                    lowerRange = moment(value, dateFormat);
                    upperRange = moment();
                }
            }
            return !(
                value === initialValue || // allow existing unchanged values
                (isValidaDate(value) && isValidDateRange(value, lowerRange, upperRange))
            );
        },
        valueFormatter: date => date?.split(' ')?.[0] ?? date,
        fieldParams: { canEdit: true, minWidth: 180 },
    };
};

// Note: sortable values are set wholesale in the container components of
// manage/InspectionDevices and report/RecalibrationsDue
export default {
    sort: {
        defaultSortColumn: 'device_model_name',
    },
    fields: {
        device_id: {
            fieldParams: {
                canEdit: false,
                renderInTable: false,
                renderInAdd: false,
                renderInUpdate: false,
            },
        },
        device_department: {
            fieldParams: {
                canEdit: false,
                renderInTable: false,
                renderInAdd: false,
                renderInUpdate: false,
            },
        },
        device_model_name: {
            component: props => <TextField variant="standard" {...props} required />,
            validate: value => isEmptyStr(value), // should return true if a validation error exists
            fieldParams: { canEdit: true, minWidth: 150, flex: 1 },
        },
        device_serial_number: {
            component: props => <TextField variant="standard" {...props} required />,
            validate: value => isEmptyStr(value), // should return true if a validation error exists
            fieldParams: { canEdit: true, minWidth: 150 },
        },
        device_calibration_due_date: makeNextCalibrateDateField(),
        device_calibrated_date_last: makeLastCalibrateDateField(),
        device_calibrated_by_last: {
            component: props => <TextField variant="standard" {...props} required />,
            validate: value => isEmptyStr(value), // should return true if a validation error exists
            fieldParams: { canEdit: true, minWidth: 180, flex: 1 },
        },
    },
};

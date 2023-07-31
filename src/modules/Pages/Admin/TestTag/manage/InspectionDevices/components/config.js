import React from 'react';

import moment from 'moment';
import TextField from '@material-ui/core/TextField';

import { isEmptyStr } from '../../../helpers/helpers';
import locale from '../../../testTag.locale';
import { WarningOutlined } from '@material-ui/icons';
import { Tooltip } from '@material-ui/core';
const dateFormat = locale.config.format.dateFormatNoTime;

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
            component: props => <TextField {...props} required />,
            validate: value => isEmptyStr(value), // should return true if a validation error exists
            fieldParams: { canEdit: true, minWidth: 150, flex: 1 },
        },
        device_serial_number: {
            component: props => <TextField {...props} required />,
            validate: value => isEmptyStr(value), // should return true if a validation error exists
            fieldParams: { canEdit: true, minWidth: 150 },
        },
        device_calibration_due_date: {
            component: props => (
                <TextField
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
            validate: value => isEmptyStr(value), // should return true if a validation error exists
            valueFormatter: date => date?.split(' ')?.[0] ?? date,
            fieldParams: {
                canEdit: true,
                minWidth: 160,
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
        },
        device_calibrated_date_last: {
            component: props => (
                <TextField
                    format={dateFormat}
                    type="date"
                    {...props}
                    inputProps={{ ...props.inputProps, max: moment().format(dateFormat) }}
                    required
                />
            ),
            validate: value => isEmptyStr(value), // should return true if a validation error exists
            valueFormatter: date => date?.split(' ')?.[0] ?? date,
            fieldParams: { canEdit: true, minWidth: 180 },
        },
        device_calibrated_by_last: {
            component: props => <TextField {...props} required />,
            validate: value => isEmptyStr(value), // should return true if a validation error exists
            fieldParams: { canEdit: true, minWidth: 180, flex: 1 },
        },
    },
};

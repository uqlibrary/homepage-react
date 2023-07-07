import React from 'react';

import moment from 'moment';

import DebouncedTextField from '../../../SharedComponents/DebouncedTextField/DebouncedTextField';
import { isEmptyStr } from '../../../helpers/helpers';
import locale from '../../../testTag.locale';
const dateFormat = locale.config.format.dateFormatNoTime;

export default {
    fields: {
        device_id: {
            fieldParams: { canEdit: false, renderInTable: false, renderInAdd: false, renderInUpdate: false },
        },
        device_department: {
            fieldParams: { canEdit: false, renderInTable: false, renderInAdd: false, renderInUpdate: false },
        },
        device_model_name: {
            component: props => <DebouncedTextField {...props} required />,
            validate: value => isEmptyStr(value), // should return true if a validation error exists
            fieldParams: { canEdit: true, flex: 1 },
        },
        device_serial_number: {
            component: props => <DebouncedTextField {...props} required />,
            validate: value => isEmptyStr(value), // should return true if a validation error exists
            fieldParams: { canEdit: true, flex: 1 },
        },
        device_calibrated_date_last: {
            component: props => (
                <DebouncedTextField
                    format={dateFormat}
                    type="date"
                    {...props}
                    inputProps={{ ...props.inputProps, max: moment().format(dateFormat) }}
                    required
                />
            ),
            validate: value => isEmptyStr(value), // should return true if a validation error exists
            valueFormatter: date => date?.split(' ')?.[0] ?? date,
            fieldParams: { canEdit: true, minWidth: 140 },
        },
        device_calibrated_by_last: {
            component: props => <DebouncedTextField {...props} required />,
            validate: value => isEmptyStr(value), // should return true if a validation error exists
            fieldParams: { canEdit: true, flex: 1 },
        },
        device_calibration_due_date: {
            component: props => (
                <DebouncedTextField
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
            fieldParams: { canEdit: true, minWidth: 140 },
        },
    },
};

import React from 'react';

import moment from 'moment';
import TextField from '@material-ui/core/TextField';

import { isEmpty } from '../../../Inspection/utils/helpers';
import locale from '../../../testTag.locale';
const dateFormat = locale.pages.manage.config.dateFormat;

export default {
    fields: {
        device_id: {
            fieldParams: { canEdit: false },
        },
        device_department: {
            component: props => <TextField {...props} />,
            fieldParams: { canEdit: false, renderInAdd: false, renderInTable: false, flex: 1 },
        },
        device_model_name: {
            component: props => <TextField {...props} required />,
            validate: value => isEmpty(value), // should return true if a validation error exists
            fieldParams: { canEdit: true, flex: 1 },
        },
        device_serial_number: {
            component: props => <TextField {...props} required />,
            validate: value => isEmpty(value), // should return true if a validation error exists
            fieldParams: { canEdit: true, flex: 1 },
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
            validate: value => isEmpty(value), // should return true if a validation error exists
            valueFormatter: date => date?.split(' ')?.[0] ?? date,
            fieldParams: { canEdit: true, flex: 1 },
        },
        device_calibrated_by_last: {
            component: props => <TextField {...props} required />,
            validate: value => isEmpty(value), // should return true if a validation error exists
            fieldParams: { canEdit: true, flex: 1 },
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
            validate: value => isEmpty(value), // should return true if a validation error exists
            valueFormatter: date => date?.split(' ')?.[0] ?? date,
            fieldParams: { canEdit: true, flex: 1 },
        },
    },
};

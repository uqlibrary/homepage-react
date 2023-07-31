import React from 'react';

import { WarningOutlined } from '@material-ui/icons';
import { Tooltip } from '@material-ui/core';
import locale from '../../../testTag.locale';
const moment = require('moment');

export default {
    defaults: {
        monthsPeriod: '3',
    },
    fields: {
        asset_barcode: { fieldParams: { minWidth: 120 } },
        asset_location: { fieldParams: { flex: 1, minWidth: 100 } },
        asset_type_name: { fieldParams: { flex: 1, minWidth: 250 } },
        asset_test_date: { fieldParams: { minWidth: 120 } },
        asset_next_test_due_date: {
            fieldParams: {
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
                minWidth: 120,
            },
        },
    },
};

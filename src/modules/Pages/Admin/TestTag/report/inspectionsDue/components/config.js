import React from 'react';

import WarningOutlined from '@mui/icons-material/WarningOutlined';
import Tooltip from '@mui/material/Tooltip';
import locale from '../../../testTag.locale';
const moment = require('moment');

export default {
    defaults: {
        monthsPeriod: '3',
    },
    sort: {
        defaultSortColumn: 'asset_barcode',
    },
    fields: {
        asset_barcode: { fieldParams: { minWidth: 130 } },
        asset_type_name: { fieldParams: { minWidth: 250 } },
        asset_next_test_due_date: {
            fieldParams: {
                renderCell: params => {
                    const date = params.value;
                    const dateObject = moment(date, locale.config.format.dateFormatNoTime);
                    const currentDate = moment();
                    const isPastDate = dateObject.isBefore(currentDate);
                    return (
                        <>
                            {date}
                            {isPastDate && (
                                <Tooltip
                                    style={{ padding: '5px', height: 20 }}
                                    title={locale.pages.report.inspectionsDue.tooltips.overdue}
                                    TransitionProps={{ timeout: 300 }}
                                    id={'tooltip-overdue'}
                                    data-testid={'tooltip-overdue'}
                                >
                                    <WarningOutlined />
                                </Tooltip>
                            )}
                        </>
                    );
                },
                minWidth: 150,
            },
        },
        asset_test_date: { fieldParams: { minWidth: 150 } },
        asset_location: { fieldParams: { flex: 1, minWidth: 400 } },
    },
};

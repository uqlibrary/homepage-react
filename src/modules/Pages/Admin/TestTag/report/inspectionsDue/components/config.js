import React from 'react';

import WarningOutlined from '@material-ui/icons/WarningOutlined';
import Tooltip from '@material-ui/core/Tooltip';
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
        asset_location: { fieldParams: { flex: 1, minWidth: 150 } },
        asset_type_name: { fieldParams: { flex: 1, minWidth: 200 } },
        asset_test_date: { fieldParams: { minWidth: 150 } },
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
    },
};

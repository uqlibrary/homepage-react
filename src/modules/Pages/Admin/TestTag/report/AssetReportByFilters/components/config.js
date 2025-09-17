import React from 'react';

import WarningOutlined from '@mui/icons-material/WarningOutlined';
import Tooltip from '@mui/material/Tooltip';
import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
const moment = require('moment');

export default {
    defaults: {
        assetStatus: null,
        locationType: 'building',
        locationId: null,
        inspectionDateFrom: null,
        inspectionDateTo: null,
    },
    sort: {
        defaultSortColumn: 'asset_barcode',
    },
    fields: {
        asset_barcode: { fieldParams: { minWidth: 120 } },
        building_name: { fieldParams: { minWidth: 180, flex: 1 } },
        asset_type_name: { fieldParams: { minWidth: 180, flex: 1 } },
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
        asset_status: { fieldParams: { width: 140 } },
    },
};

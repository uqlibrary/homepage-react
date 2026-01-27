import React from 'react';

import WarningOutlined from '@mui/icons-material/WarningOutlined';
import Tooltip from '@mui/material/Tooltip';
import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
const moment = require('moment');

/**
 * @param {{site_name: string, building_id_displayed: string, floor_id_displayed: number, room_id_displayed: number}} row
 * @return {string}
 */
export const renderLocation = row => {
    const siteName = row?.site_name || /* istanbul ignore next */ '';
    const buildingNum = row?.building_id_displayed || /* istanbul ignore next */ '';
    const floorNum = row?.floor_id_displayed || /* istanbul ignore next */ '';
    const roomNum = row?.room_id_displayed || /* istanbul ignore next */ '';
    return locale.pages.report.assetReportByFilters.form.formattedLocation(siteName, buildingNum, floorNum, roomNum);
};

/**
 *
 * @param {Object[]} row
 * @return {*}
 */
export const transformRow = row =>
    row.map(line => ({
        ...line,
        location: renderLocation(line),
    }));

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
        location: {
            fieldParams: {
                minWidth: 200,
                flex: 1,
            },
        },
        asset_type_name: { fieldParams: { minWidth: 200, flex: 1 } },
        asset_test_date: { fieldParams: { minWidth: 100 } },
        user_name: { fieldParams: { minWidth: 150 } },
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
                minWidth: 125,
            },
        },
        asset_status: { fieldParams: { width: 140 } },
        inspect_comment: {
            fieldParams: {
                hide: true,
            },
        },
        inspect_fail_reason: {
            fieldParams: {
                hide: true,
            },
        },
    },
};

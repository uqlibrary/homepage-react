/* istanbul ignore file */

import { createLocationString, createLocationFloorPlanLink } from '../../../helpers/helpers';

export const MAXEXCLUDEDMOREITEMS = 10;

export default {
    defaults: {
        monthsPeriod: 0,
    },
    form: {
        sort: {
            defaultSortColumn: 'asset_id_displayed',
        },
        fields: {
            asset_id: { fieldParams: { renderInTable: false } },
            asset_id_displayed: { fieldParams: { minWidth: 120 } },
            asset_type_name: {
                fieldParams: { flex: 1, minWidth: 140, renderCell: params => params.row?.asset_type?.asset_type_name },
            },
            asset_location: {
                fieldParams: {
                    flex: 1,
                    minWidth: 200,
                    renderCell: params => {
                        const row = params.row.last_location ?? params.row;
                        return createLocationFloorPlanLink(
                            createLocationString({
                                site: row?.site_name,
                                building: row?.building_name,
                                floor: row?.floor_id_displayed,
                                room: row?.room_id_displayed,
                            }),
                            row?.floor_plan_url,
                        );
                    },
                },
            },
            asset_status: { fieldParams: { sortable: false } },
        },
    },
    filterDialog: {
        sort: {
            defaultSortColumn: 'asset_barcode',
        },
        fields: {
            asset_id: { fieldParams: { renderInTable: false } },
            asset_barcode: { fieldParams: { minWidth: 120 } },
            asset_type_name: { fieldParams: { flex: 1, minWidth: 150 } },
            inspect_comment: { fieldParams: { minWidth: 100, flex: 1 } },
            asset_location: {
                fieldParams: {
                    flex: 1,
                    minWidth: 200,
                    renderCell: params =>
                        createLocationFloorPlanLink(
                            createLocationString({
                                site: params.row.site_name,
                                building: params.row.building_name,
                                floor: params.row.floor_id_displayed,
                                room: params.row.room_id_displayed,
                            }),
                            params.row.floor_plan_url,
                        ),
                },
            },
            asset_status: { fieldParams: { minWidth: 150 } },
        },
    },
};

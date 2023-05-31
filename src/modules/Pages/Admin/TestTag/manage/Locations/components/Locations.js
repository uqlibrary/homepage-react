import React, { useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';

import DataTable from './../../../SharedComponents/DataTable/DataTable';
import RowMenuCell from './../../../SharedComponents/DataTable/RowMenuCell';

import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import locale from '../../../testTag.locale';
import { PERMISSIONS } from '../../../config/auth';
import AddToolbar from '../../../SharedComponents/DataTable/AddToolbar';
import UpdateDialog from '../../../SharedComponents/DataTable/UpdateDialog';
import LocationPicker from '../../../SharedComponents/LocationPicker/LocationPicker';
import { useLocation } from '../../../Inspection/utils/hooks';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    tableMarginTop: {
        marginTop: theme.spacing(2),
    },
    gridRoot: {
        border: 0,
    },
}));

const createLocationString = ({ site, building, floor }) => {
    console.log(site, building, floor);
    return [site, building, floor].filter(item => !!item).join(' / ');
};

const config = {
    site: {
        fields: {
            site_id: {
                label: 'Site ID',
                fieldParams: { canEdit: false },
            },
            site_name: {
                label: 'Description',
                component: props => <TextField {...props} />,
                fieldParams: { canEdit: true, flex: 1 },
            },
            site_id_displayed: {
                label: 'Display name',
                component: props => <TextField {...props} />,
                fieldParams: { canEdit: true, flex: 1 },
            },
            asset_count: {
                label: 'Usage',
                fieldParams: { canEdit: false, renderInUpdate: false },
            },
        },
    },
    building: {
        fields: {
            building_id: {
                label: 'Building ID',
                fieldParams: { canEdit: false },
            },
            building_location: {
                label: 'Location',
                computedValue: location => createLocationString(location),
                computedValueProp: 'location',
                fieldParams: { canEdit: false, renderInTable: false },
            },
            building_name: {
                label: 'Description',
                component: props => <TextField {...props} />,
                fieldParams: { canEdit: true, flex: 1 },
            },
            building_id_displayed: {
                label: 'Display name',
                component: props => <TextField {...props} />,
                fieldParams: { canEdit: true, flex: 1 },
            },
            asset_count: {
                label: 'Usage',
                fieldParams: { canEdit: false, renderInUpdate: false },
            },
        },
    },
    floor: {
        fields: {
            floor_id: {
                label: 'Floor ID',
                fieldParams: { canEdit: false, flex: 1 },
            },
            floor_location: {
                label: 'Location',
                computedValue: location => createLocationString(location),
                computedValueProp: 'location',
                fieldParams: { canEdit: false, renderInTable: false, flex: 1 },
            },
            floor_id_displayed: {
                label: 'Display name',
                component: props => <TextField {...props} />,
                fieldParams: { canEdit: true, flex: 1 },
            },
            asset_count: {
                label: 'Usage',
                fieldParams: { canEdit: false, renderInUpdate: false },
            },
        },
    },
    room: {
        fields: {
            room_id: {
                label: 'Room ID',
                fieldParams: { canEdit: false },
            },
            room_location: {
                label: 'Location',
                computedValue: location => createLocationString(location),
                computedValueProp: 'location',
                fieldParams: { canEdit: false, renderInTable: false },
            },
            room_description: {
                label: 'Description',
                component: props => <TextField {...props} />,
                fieldParams: { canEdit: true, flex: 1 },
            },
            room_id_displayed: {
                label: 'Display name',
                component: props => <TextField {...props} />,
                fieldParams: { canEdit: true, flex: 1 },
            },
            asset_count: {
                label: 'Usage',
                fieldParams: { canEdit: false, renderInUpdate: false },
            },
        },
    },
};

/*

//https://api.library.uq.edu.au/staging/test_and_tag/site/current

[
    {
        "site_id": 1,
        "site_id_displayed": "01",
        "site_name": "St Lucia",
        "buildings": [
            {
                "building_id": 1,
                "building_name": "Forgan Smith Building",
                "building_id_displayed": "0001",
                "asset_count": 10
            },
            ...
        ]
    },
    ...
]

// https://api.library.uq.edu.au/staging/test_and_tag/building/1/current
{
    "building_id": 1,
    "building_id_displayed": "0001",
    "building_name": "Forgan Smith Building",
    "site_id": 1,
    "site_id_displayed": "01",
    "site_name": "St Lucia",
    "floors": [
        {
            "floor_id": 1,
            "floor_id_displayed": "2"
        },
        ...
    ]
}

// https://api.library.uq.edu.au/staging/test_and_tag/floor/1/current
{
    "floor_id": 1,
    "floor_id_displayed": "2",
    "building_id": 1,
    "building_id_displayed": "0001",
    "building_name": "Forgan Smith Building",
    "site_id": 1,
    "site_id_displayed": "01",
    "site_name": "St Lucia",
    "rooms": [
        {
            "room_id": 1,
            "room_description": "Library Facilities",
            "room_id_displayed": "W212",
            "asset_count": 7
        },
        ...
    ]
}

*/

const getColumns = ({ selectedFilter, onRowEdit, onRowDelete }) => {
    const actionsCell = {
        field: 'actions',
        headerName: 'Actions',
        renderCell: params => {
            return (
                <RowMenuCell
                    {...params}
                    onRowEdit={onRowEdit}
                    {...((params.row?.asset_count ?? 1) === 0 ? { onRowDelete: onRowDelete } : {})}
                />
            );
        },
        sortable: false,
        width: 100,
        headerAlign: 'center',
        filterable: false,
        align: 'center',
        disableColumnMenu: true,
        disableReorder: true,
        renderInUpdate: false,
    };

    const columns = [];
    const keys = Object.keys(config[selectedFilter].fields);

    keys.forEach(key => {
        !!(config[selectedFilter].fields[key]?.fieldParams.renderInTable ?? true) &&
            columns.push({
                field: key,
                headerName: config[selectedFilter].fields[key].label,
                editable: false,
                sortable: false,
                ...config[selectedFilter].fields[key].fieldParams,
            });
    });

    columns && columns.length > 0 && columns.push(actionsCell);
    return columns;
};

const emptyActionState = { isAdd: false, isEdit: false, isDelete: false, row: {} };
const actionReducer = (_, action) => {
    const { type, row, selectedFilter, ...props } = action;
    switch (type) {
        case 'add':
            return {
                isAdd: true,
                isEdit: false,
                isDelete: false,
                row: { [`${selectedFilter}_id`]: 'auto' },
                props: { ...props },
            };
        case 'edit':
            return { isAdd: false, isEdit: true, isDelete: false, row, props: { ...props } };
        case 'delete':
            return { isAdd: false, isEdit: false, isDelete: true, row: action.row };
        case 'clear':
            return { ...emptyActionState };
        default:
            throw `Unknown action '${type}'`;
    }
};

const ManageLocations = ({ actions }) => {
    const pageLocale = locale.pages.manage.locations;
    const classes = useStyles();
    const [selectedFilter, setSelectedFilter] = React.useState('site');
    const [rows, setRows] = React.useState([]);
    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });
    const [isDeleteConfirmOpen, showDeleteConfirm, hideDeleteConfirm] = useConfirmationState();
    const [confirmID, setConfirmID] = React.useState(null);

    const {
        siteList,
        siteListLoading,
        siteListLoaded,
        // siteListError,
        // buildingList,
        // buildingListLoading,
        // buildingListError,
        floorList,
        floorListLoading,
        floorListLoaded,
        // floorListError,
        roomList,
        roomListLoading,
        roomListLoaded,
        // roomListError,
    } = useSelector(state => state.get?.('testTagLocationReducer'));
    const { location, setLocation } = useLocation();
    const updateLocation = update => {
        setLocation(update);
    };
    React.useEffect(() => {
        if (roomListLoaded) {
            if (location.formFloorId !== -1) {
                setRows(roomList.rooms);
            } else {
                actions.clearRooms();
            }
            setSelectedFilter('room');
        } else if (floorListLoaded) {
            if (location.formBuildingId !== -1) {
                setRows(floorList.floors);
            } else {
                setRows(
                    siteList
                        ?.find(site => site.site_id === location.formSiteId)
                        ?.buildings?.find(building => building.building_id === location.formBuildingId)?.floors ?? [],
                );
            }
            setSelectedFilter('floor');
        } else if (siteListLoaded) {
            if (location.formSiteId !== -1) {
                setRows(siteList.find(site => site.site_id === location.formSiteId).buildings);
                setSelectedFilter('building');
            } else {
                setRows(siteList);
                updateLocation({ formSiteId: -1 });
                setSelectedFilter('site');
            }
        } else actions.loadSites();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        location.formSiteId,
        location.formBuildingId,
        location.formFloorId,
        siteListLoaded,
        floorListLoaded,
        roomListLoaded,
    ]);

    const [confirmationAlert, setConfirmationAlert] = React.useState({ message: '', visible: false });

    const closeConfirmationAlert = () => {
        setConfirmationAlert({ message: '', visible: false, type: confirmationAlert.type });
    };
    const openConfirmationAlert = (message, type) => {
        console.log('Setting with message', message);
        setConfirmationAlert({ message: message, visible: true, type: !!type ? type : 'info' });
    };

    const getLocationDisplayedAs = () => ({
        site: siteList?.find(site => site.site_id === location.formSiteId)?.site_id_displayed,
        building: siteList
            ?.find(site => site.site_id === location.formSiteId)
            ?.buildings?.find(building => building.building_id === location.formBuildingId)?.building_id_displayed,
        floor: floorList?.floors?.find(floor => floor.floor_id === location.formFloorId)?.floor_id_displayed,
    });

    const handleAddClick = () => {
        actionDispatch({
            type: 'add',
            selectedFilter,
            location: getLocationDisplayedAs(),
        });
    };

    const onRowEdit = ({ id, api }) => {
        const row = api.getRow(id);
        console.log(row);
        actionDispatch({
            type: 'edit',
            row,
            location: getLocationDisplayedAs(),
        });
    };

    const onRowDelete = ({ id, api }) => {
        const row = api.getRow(id);
        console.log('Firing Row Delete', id, api, row);
        closeConfirmationAlert();
        setConfirmID(row[0]);
        showDeleteConfirm();
    };
    const onDeleteUnusedLocation = () => {
        console.log('do the delete');
        // actions.
    };

    const onRowAdd = data => {
        console.log('added', data);
        actionDispatch({ type: 'clear' });
    };

    const onRowUpdate = data => {
        console.log('udpated', data);
        actionDispatch({ type: 'clear' });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const columns = useMemo(() => getColumns({ selectedFilter, onRowEdit, onRowDelete }), [selectedFilter]);

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_admin]}
        >
            <div className={classes.root}>
                <StandardCard noHeader>
                    <UpdateDialog
                        updateDialogueBoxId="addRow"
                        isOpen={actionState.isAdd}
                        confirmationTitle={`Add new ${selectedFilter}`}
                        cancelButtonLabel="Cancel"
                        confirmButtonLabel="Add"
                        fields={config[selectedFilter].fields}
                        row={actionState?.row}
                        onCancelAction={() => actionDispatch({ type: 'clear' })}
                        onAction={onRowAdd}
                        props={actionState?.props}
                    />
                    <UpdateDialog
                        updateDialogueBoxId="editRow"
                        isOpen={actionState.isEdit}
                        confirmationTitle={`Edit ${selectedFilter}`}
                        cancelButtonLabel="Cancel"
                        confirmButtonLabel="Update"
                        fields={config[selectedFilter].fields}
                        row={actionState?.row}
                        onCancelAction={() => actionDispatch({ type: 'clear' })}
                        onAction={onRowUpdate}
                        props={actionState?.props}
                    />
                    <ConfirmationBox
                        actionButtonColor="primary"
                        actionButtonVariant="contained"
                        cancelButtonColor="secondary"
                        confirmationBoxId="deleteRow"
                        onCancelAction={hideDeleteConfirm}
                        onAction={onDeleteUnusedLocation}
                        onClose={hideDeleteConfirm}
                        isOpen={isDeleteConfirmOpen}
                        locale={pageLocale.deleteConfirm}
                        noMinContentWidth
                    />

                    <Grid container spacing={0} className={classes.tableMarginTop}>
                        <Grid item xs={12} padding={0}>
                            <Typography variant={'h6'} component={'div'}>
                                Select location
                            </Typography>
                            <LocationPicker
                                actions={actions}
                                location={location}
                                setLocation={updateLocation}
                                hide={['room']}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} className={classes.tableMarginTop}>
                        <Grid item padding={3} style={{ flex: 1 }}>
                            <DataTable
                                rows={rows}
                                columns={columns}
                                rowId={`${selectedFilter}_id`}
                                components={{ Toolbar: AddToolbar }}
                                componentsProps={{
                                    toolbar: { label: `Add ${selectedFilter}`, onClick: handleAddClick },
                                }}
                                loading={siteListLoading || floorListLoading || roomListLoading}
                                classes={{ root: classes.gridRoot }}
                            />
                        </Grid>
                    </Grid>
                    <ConfirmationAlert
                        isOpen={confirmationAlert.visible}
                        message={confirmationAlert.message}
                        type={confirmationAlert.type}
                        closeAlert={closeConfirmationAlert}
                    />
                </StandardCard>
            </div>
        </StandardAuthPage>
    );
};

ManageLocations.propTypes = {
    actions: PropTypes.object,
};

export default React.memo(ManageLocations);

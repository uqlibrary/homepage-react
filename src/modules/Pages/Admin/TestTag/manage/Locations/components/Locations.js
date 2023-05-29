import React, { useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';

import DataTable from './../../../SharedComponents/DataTable/DataTable';
import RowMenuCell from './../../../SharedComponents/DataTable/RowMenuCell';

import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import locale from '../../../testTag.locale';
import { PERMISSIONS } from '../../../config/auth';
import AddToolbar from '../../../SharedComponents/DataTable/AddToolbar';
import UpdateDialog from '../../../SharedComponents/DataTable/UpdateDialog';
import LocationPicker from '../../../SharedComponents/LocationPicker/LocationPicker';
import { useLocation } from '../../../Inspection/utils/hooks';

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

const createLocationString = (site, building, floor) => [site, building, floor].filter(item => !!item).join(' / ');

const config = {
    site: {
        locations: [],
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
                fieldParams: { canEdit: false, shouldRender: false },
            },
        },
    },
    building: {
        locations: ['site'],
        fields: {
            building_id: {
                label: 'Building ID',
                fieldParams: { canEdit: false },
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
            building_location: {
                label: 'Location',
                computedValue: site => createLocationString(site),
                fieldParams: { canEdit: false, shouldRender: false },
            },
            asset_count: {
                label: 'Usage',
                fieldParams: { canEdit: false, shouldRender: false },
            },
        },
    },
    floor: {
        locations: ['site', 'building'],
        fields: {
            floor_id: {
                label: 'Floor ID',
                fieldParams: { canEdit: false },
            },
            floor_id_displayed: {
                label: 'Display name',
                component: props => <TextField {...props} />,
                fieldParams: { canEdit: true, flex: 1 },
            },
            floor_location: {
                label: 'Location',
                computedValue: (site, building) => createLocationString(site, building),
                fieldParams: { canEdit: false, shouldRender: false },
            },
            asset_count: {
                label: 'Usage',
                fieldParams: { canEdit: false, shouldRender: false },
            },
        },
    },
    room: {
        locations: ['site', 'building', 'floor'],
        fields: {
            room_id: {
                label: 'Room ID',
                fieldParams: { canEdit: false },
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
            room_location: {
                label: 'Location',
                computedValue: (site, building, floor) => createLocationString(site, building, floor),
                fieldParams: { canEdit: false, shouldRender: false },
            },
            asset_count: {
                label: 'Usage',
                fieldParams: { canEdit: false, shouldRender: false },
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

const getColumns = ({ selectedTab, onRowEdit, onRowDelete }) => {
    const actionsCell = {
        field: 'actions',
        headerName: 'Actions',
        renderCell: params => <RowMenuCell {...params} onRowEdit={onRowEdit} onRowDelete={onRowDelete} />,
        sortable: false,
        width: 100,
        headerAlign: 'center',
        filterable: false,
        align: 'center',
        disableColumnMenu: true,
        disableReorder: true,
        shouldRender: false,
    };

    const columns = [];
    const keys = Object.keys(config[selectedTab].fields);

    keys.forEach(key => {
        columns.push({
            field: key,
            headerName: config[selectedTab].fields[key].label,
            editable: false,
            sortable: false,
            ...config[selectedTab].fields[key].fieldParams,
        });
    });

    columns && columns.length > 0 && columns.push(actionsCell);
    return columns;
};

const emptyActionState = { isAdd: false, isEdit: false, rows: {} };
const actionReducer = (_, action) => {
    switch (action.type) {
        case 'add':
            return { isAdd: true, isEdit: false, row: { [`${action.selectedTab}_id`]: 'auto' } };
        case 'edit':
            return { isAdd: false, isEdit: true, row: action.row };
        case 'clear':
            return { ...emptyActionState };
        default:
            throw `Unknown action '${action.type}'`;
    }
};

const ManageLocations = ({ actions }) => {
    const pageLocale = locale.pages.manage.locations;
    const classes = useStyles();
    const [selectedTab, setSelectedTab] = React.useState('site');
    const [rows, setRows] = React.useState([]);
    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });

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
        if (roomListLoaded) setRows(roomList);
        else if (floorListLoaded) setRows(floorList);
        else if (siteListLoaded) {
            setRows(siteList);
            updateLocation({ formSiteId: siteList[0].site_id });
        } else actions.loadSites();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [siteListLoaded, floorListLoaded, roomListLoaded]);

    // const [editRowsModel, setEditRowsModel] = React.useState({});

    const handleTabChange = (event, newValue) => {
        console.log(newValue);
        setSelectedTab(newValue);
    };

    const handleAddClick = () => {
        actionDispatch({ type: 'add', selectedTab });
        // const id = 1;
        // apiRef.current.updateRows([{ id, isNew: true }]);
        // apiRef.current.setRowMode(id, 'edit');
        // // Wait for the grid to render with the new row
        // setTimeout(() => {
        //     apiRef.current.scrollToIndexes({
        //         rowIndex: apiRef.current.getRowsCount() - 1,
        //     });
        //     apiRef.current.setCellFocus(id, 'name');
        // }, 150);
    };

    const onRowEdit = ({ id, api }) => {
        const row = api.getRow(id);
        console.log(row);
        actionDispatch({ type: 'edit', row });
        // const fields = api.getRowParams(id).columns;
        // console.log('On Row Edit', id, api, fields);
        // fields
        //     .filter(field => !!field.shouldRender === true)
        //     .map(field => {
        //         const fieldName = field.field;
        //         console.log(
        //             fieldName,
        //             field.canEdit,
        //             api.getRow(id)[field.field],
        //             !!fieldConfig[fieldName]?.component ? 'config component' : 'default component',
        //         );
        //     });
    };

    const onRowDelete = ({ id, api }) => {
        console.log('Firing Row Delete', id, api);
    };

    const onRowAdd = data => {
        console.log('added', data);
        actionDispatch({ type: 'clear' });
    };

    const onRowUpdate = data => {
        console.log('udpated', data);
        actionDispatch({ type: 'clear' });
    };

    const columns = useMemo(() => getColumns({ selectedTab, onRowEdit, onRowDelete }), [selectedTab]);

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
                        confirmationTitle="Add New Asset Type"
                        cancelButtonLabel="Cancel"
                        confirmButtonLabel="Add"
                        fields={config[selectedTab].fields}
                        row={actionState?.row}
                        onCancelAction={() => actionDispatch({ type: 'clear' })}
                        onAction={onRowAdd}
                    />
                    <UpdateDialog
                        updateDialogueBoxId="editRow"
                        isOpen={actionState.isEdit}
                        confirmationTitle="Edit Asset Type"
                        cancelButtonLabel="Cancel"
                        confirmButtonLabel="Update"
                        fields={config[selectedTab].fields}
                        row={actionState?.row}
                        onCancelAction={() => actionDispatch({ type: 'clear' })}
                        onAction={onRowUpdate}
                    />
                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab label="Sites" value="site" />
                        <Tab label="Buildings" value="building" />
                        <Tab label="Floors" value="floor" />
                        <Tab label="Rooms" value="room" />
                    </Tabs>
                    {selectedTab !== 'site' && (
                        <Grid container spacing={3} className={classes.tableMarginTop}>
                            <LocationPicker actions={actions} location={location} setLocation={updateLocation} />
                        </Grid>
                    )}
                    <Grid container spacing={3} className={classes.tableMarginTop}>
                        <Grid item padding={3} style={{ flex: 1 }}>
                            <DataTable
                                rows={rows}
                                columns={columns}
                                rowId={`${selectedTab}_id`}
                                /* editRowsModel={editRowsModel}*/
                                components={{ Toolbar: AddToolbar }}
                                componentsProps={{ toolbar: { label: `Add ${selectedTab}`, onClick: handleAddClick } }}
                                loading={siteListLoading || floorListLoading || roomListLoading}
                                classes={{ root: classes.gridRoot }}
                            />
                        </Grid>
                    </Grid>
                </StandardCard>
            </div>
        </StandardAuthPage>
    );
};

ManageLocations.propTypes = {
    actions: PropTypes.object,
};

export default React.memo(ManageLocations);

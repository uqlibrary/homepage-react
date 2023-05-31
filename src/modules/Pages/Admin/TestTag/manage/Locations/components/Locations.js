import React, { useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';

import DataTable from './../../../SharedComponents/DataTable/DataTable';

import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import locale from '../../../testTag.locale';
import { PERMISSIONS } from '../../../config/auth';
import AddToolbar from '../../../SharedComponents/DataTable/AddToolbar';
import UpdateDialog from '../../../SharedComponents/DataTable/UpdateDialog';
import LocationPicker from '../../../SharedComponents/LocationPicker/LocationPicker';
import { useLocation } from '../../../Inspection/utils/hooks';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import config from './config';
import { getColumns, emptyActionState, actionReducer } from './utils';

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

const capitaliseLeadingChar = text => text.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, match => match.toUpperCase());

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
                console.log('listing rooms');
                setRows(roomList.rooms);
            } else {
                actions.clearRooms();
            }
            setSelectedFilter('room');
        } else if (floorListLoaded) {
            if (location.formBuildingId !== -1) {
                console.log('listing floors');
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
                console.log('listing buildings');
                setRows(siteList.find(site => site.site_id === location.formSiteId).buildings);
                setSelectedFilter('building');
            } else {
                console.log('listing sites');
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

    const actionHandler = {
        site: () => {
            actions.clearSites();
            actions.loadSites();
        },
        building: () => {
            actions.clearSites();
            actions.loadSites();
        },
        floor: () => {
            actions.clearFloors();
            actions.loadFloors(location.formBuildingId);
        },
        room: () => {
            actions.clearRooms();
            actions.loadRooms(location.formFloorId);
        },
    };

    const handleAddClick = () => {
        actionDispatch({
            type: 'add',
            selectedFilter,
            location,
            displayLocation: getLocationDisplayedAs(),
        });
    };

    const onRowAdd = data => {
        console.log('onRowAdd', data);
        const request = structuredClone(data);
        delete request[`${selectedFilter}_id`];
        // setDialogueBusy(true);
        actions.addLocation({ type: selectedFilter, request }).then(() => {
            // actions.loadAssetTypes().then(() => {
            actionDispatch({ type: 'clear' });
            // setDialogueBusy(false);
            openConfirmationAlert(`${capitaliseLeadingChar(selectedFilter)} added successfully.`, 'success');
            actionHandler[selectedFilter]();
            // });
        });
    };
    const onRowUpdate = data => {
        console.log('onRowUpdate', data);
        actionDispatch({ type: 'clear' });
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const columns = useMemo(
        () => getColumns({ config, locale: pageLocale.form.columns, selectedFilter, onRowEdit, onRowDelete }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedFilter],
    );

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_admin]}
        >
            <div className={classes.root}>
                <StandardCard noHeader>
                    <UpdateDialog
                        title={pageLocale.dialogAdd.confirmationTitle(selectedFilter)}
                        updateDialogueBoxId="addRow"
                        isOpen={actionState.isAdd}
                        locale={pageLocale.dialogAdd}
                        locationType={selectedFilter}
                        fields={config[selectedFilter].fields}
                        columns={pageLocale.form.columns[selectedFilter]}
                        row={actionState?.row}
                        onCancelAction={() => actionDispatch({ type: 'clear' })}
                        onAction={onRowAdd}
                        props={actionState?.props}
                    />
                    <UpdateDialog
                        title={pageLocale.dialogEdit.confirmationTitle(selectedFilter)}
                        updateDialogueBoxId="editRow"
                        isOpen={actionState.isEdit}
                        locale={pageLocale.dialogEdit}
                        locationType={selectedFilter}
                        fields={config[selectedFilter].fields}
                        columns={pageLocale.form.columns[selectedFilter]}
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
                        locale={pageLocale.dialogDeleteConfirm}
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

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
import { useLocation } from '../../../helpers/hooks';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import config from './config';
import { getColumns, emptyActionState, actionReducer, transformAddRequest, transformUpdateRequest } from './utils';
import { capitaliseLeadingChar } from '../../../helpers/helpers';

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

const ManageLocations = ({ actions }) => {
    const pageLocale = locale.pages.manage.locations;
    const classes = useStyles();
    const [selectedFilter, setSelectedFilter] = React.useState('site');
    const [rows, setRows] = React.useState([]);
    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });
    const [isDeleteConfirmOpen, showDeleteConfirm, hideDeleteConfirm] = useConfirmationState();
    const [dialogueBusy, setDialogueBusy] = React.useState(false);

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

    React.useEffect(() => {
        if (roomListLoaded) {
            if (location.floor !== -1) {
                setRows(roomList.rooms);
            } else {
                actions.clearRooms();
            }
            setSelectedFilter('room');
        } else if (floorListLoaded) {
            if (location.building !== -1) {
                setRows(floorList.floors);
            } else {
                setRows(
                    siteList
                        ?.find(site => site.site_id === location.site)
                        ?.buildings?.find(building => building.building_id === location.building)?.floors ?? [],
                );
            }
            setSelectedFilter('floor');
        } else if (siteListLoaded) {
            if (location.site !== -1) {
                setRows(siteList.find(site => site.site_id === location.site).buildings);
                setSelectedFilter('building');
            } else {
                setRows(siteList);
                setLocation({ site: -1 });
                setSelectedFilter('site');
            }
        } else actions.loadSites();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.site, location.building, location.floor, siteListLoaded, floorListLoaded, roomListLoaded]);

    const [confirmationAlert, setConfirmationAlert] = React.useState({ message: '', visible: false });

    const closeConfirmationAlert = () => {
        setConfirmationAlert({ message: '', visible: false, type: confirmationAlert.type });
    };
    const openConfirmationAlert = (message, type) => {
        setConfirmationAlert({ message: message, visible: true, type: !!type ? type : 'info' });
    };

    const getLocationDisplayedAs = () => {
        console.log(
            'getLocationdisplayedas',
            siteList?.find(site => site.site_id === location.site),
            {
                site: siteList?.find(site => site.site_id === location.site)?.site_id_displayed,
                building: siteList
                    ?.find(site => site.site_id === location.site)
                    ?.buildings?.find(building => building.building_id === location.building)?.building_id_displayed,
                floor: floorList?.floors?.find(floor => floor.floor_id === location.floor)?.floor_id_displayed,
            },
        );
        return {
            site: siteList?.find(site => site.site_id === location.site)?.site_id_displayed,
            building: siteList
                ?.find(site => site.site_id === location.site)
                ?.buildings?.find(building => building.building_id === location.building)?.building_id_displayed,
            floor: floorList?.floors?.find(floor => floor.floor_id === location.floor)?.floor_id_displayed,
        };
    };

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
            actions.loadFloors(location.building);
        },
        room: () => {
            actions.clearRooms();
            actions.loadRooms(location.floor);
        },
    };

    const handleAddClick = () => {
        console.log('displayLocation', getLocationDisplayedAs());
        actionDispatch({
            type: 'add',
            selectedFilter,
            location,
            displayLocation: getLocationDisplayedAs(),
        });
    };
    const handleEditClick = React.useCallback(
        ({ id, api }) => {
            const row = api.getRow(id);
            console.log('displayLocation', getLocationDisplayedAs());
            actionDispatch({
                type: 'edit',
                row,
                selectedFilter,
                location,
                displayLocation: getLocationDisplayedAs(),
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [location, selectedFilter],
    );
    const handleDeleteClick = ({ id, api }) => {
        const row = api.getRow(id);
        console.log('displayLocation', getLocationDisplayedAs());
        actionDispatch({
            type: 'delete',
            row,
            selectedFilter,
            location,
            displayLocation: getLocationDisplayedAs(),
        });
    };

    const onRowAdd = data => {
        setDialogueBusy(true);
        const request = structuredClone(data);
        const wrappedRequest = transformAddRequest({ request, selectedFilter, location });

        actions.addLocation({ type: selectedFilter, request: wrappedRequest }).then(() => {
            setDialogueBusy(false);
            actionDispatch({ type: 'clear' });
            openConfirmationAlert(`${capitaliseLeadingChar(selectedFilter)} added successfully.`, 'success');
            actionHandler[selectedFilter]();
        });
    };
    const onRowEdit = data => {
        setDialogueBusy(true);
        const request = structuredClone(data);
        const wrappedRequest = transformUpdateRequest({ request, selectedFilter, location });

        actions.updateLocation({ type: selectedFilter, request: wrappedRequest }).then(() => {
            setDialogueBusy(false);
            actionDispatch({ type: 'clear' });
            openConfirmationAlert(`${capitaliseLeadingChar(selectedFilter)} updated successfully.`, 'success');
            actionHandler[selectedFilter]();
        });
    };

    const onRowDelete = data => {
        console.log(data);
        setDialogueBusy(true);
        const selectedFilter = data.props.selectedFilter;
        const id = data.row[`${selectedFilter}_id`];

        actions.deleteLocation({ type: selectedFilter, id }).then(() => {
            setDialogueBusy(false);
            actionDispatch({ type: 'clear' });
            openConfirmationAlert(`${capitaliseLeadingChar(selectedFilter)} deleted successfully.`, 'success');
            actionHandler[selectedFilter]();
        });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const columns = useMemo(
        () =>
            getColumns({ config, locale: pageLocale.form.columns, selectedFilter, handleEditClick, handleDeleteClick }),
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
                        isBusy={dialogueBusy}
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
                        onAction={onRowEdit}
                        props={actionState?.props}
                        isBusy={dialogueBusy}
                    />
                    <ConfirmationBox
                        actionButtonColor="primary"
                        actionButtonVariant="contained"
                        cancelButtonColor="secondary"
                        confirmationBoxId="deleteRow"
                        onCancelAction={hideDeleteConfirm}
                        onAction={onRowDelete}
                        onClose={hideDeleteConfirm}
                        isOpen={actionState.isDelete}
                        locale={pageLocale.dialogDeleteConfirm}
                        noMinContentWidth
                        actionProps={{ row: actionState?.row, props: actionState?.props }}
                    />

                    <Grid container spacing={0} className={classes.tableMarginTop}>
                        <Grid item xs={12} padding={0}>
                            <Typography variant={'h6'} component={'div'}>
                                Select location
                            </Typography>
                            <LocationPicker
                                actions={actions}
                                location={location}
                                setLocation={setLocation}
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

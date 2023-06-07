import React, { useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import DataTable from './../../../SharedComponents/DataTable/DataTable';

import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import locale from '../../../testTag.locale';
import { PERMISSIONS } from '../../../config/auth';
import AddToolbar from '../../../SharedComponents/DataTable/AddToolbar';
import UpdateDialog from '../../../SharedComponents/DataTable/UpdateDialog';
import AutoLocationPicker from '../../../SharedComponents/LocationPicker/AutoLocationPicker';
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

const actionHandler = {
    site: actions => {
        actions.clearSites();
        actions.loadSites();
    },
    building: actions => {
        actions.clearSites();
        actions.loadSites();
    },
    floor: (actions, location) => {
        actions.clearFloors();
        actions.loadFloors(location.building);
    },
    room: (actions, location) => {
        actions.clearRooms();
        actions.loadRooms(location.floor);
    },
};

const ManageLocations = ({ actions }) => {
    const pageLocale = locale.pages.manage.locations;
    const classes = useStyles();
    const [selectedFilter, setSelectedFilter] = React.useState('site');
    const [rows, setRows] = React.useState([]);
    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });
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
    } = useSelector(state => state.get('testTagLocationReducer'));
    const { location, setLocation } = useLocation();

    React.useEffect(() => {
        if (roomListLoaded) {
            if (location.floor !== -1) {
                console.log(roomList);
                setRows(roomList.rooms);
            } else {
                setLocation({ room: -1 });
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
                setLocation({ floor: -1, room: -1 });
                actions.clearFloors();
            }
            setSelectedFilter('floor');
        } else if (siteListLoaded) {
            if (location.site !== -1) {
                setRows(siteList.find(site => site.site_id === location.site).buildings);
                setSelectedFilter('building');
            } else {
                setRows(siteList);
                setLocation({ building: -1, floor: -1, room: -1 });
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
        setConfirmationAlert({ message: message, visible: true, type: !!type ? type : 'info', autoHideDuration: 6000 });
    };

    const getLocationDisplayedAs = React.useMemo(
        () => {
            const value = {
                site: siteList?.find(site => site.site_id === location.site)?.site_id_displayed,
                building: siteList
                    ?.find(site => site.site_id === location.site)
                    ?.buildings?.find(building => building.building_id === location.building)?.building_id_displayed,
                floor: floorList?.floors?.find(floor => floor.floor_id === location.floor)?.floor_id_displayed,
            };
            return value;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [location, siteList, floorList],
    );

    const closeDialog = () => actionDispatch({ type: 'clear' });

    const handleApiError = response => {
        openConfirmationAlert(`Request failed: ${response.message}`, 'error');
    };

    const handleAddClick = React.useCallback(() => {
        actionDispatch({
            type: 'add',
            title: pageLocale.dialogAdd.confirmationTitle(selectedFilter),
            selectedFilter,
            location,
            displayLocation: getLocationDisplayedAs,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, selectedFilter, getLocationDisplayedAs]);

    const handleEditClick = React.useCallback(
        ({ id, api }) => {
            const row = api.getRow(id);
            actionDispatch({
                type: 'edit',
                title: pageLocale.dialogEdit.confirmationTitle(selectedFilter),
                row,
                selectedFilter,
                location,
                displayLocation: getLocationDisplayedAs,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [location, selectedFilter, getLocationDisplayedAs],
    );

    const handleDeleteClick = React.useCallback(
        ({ id, api }) => {
            const row = api.getRow(id);
            actionDispatch({
                type: 'delete',
                row,
                selectedFilter,
                location,
                displayLocation: getLocationDisplayedAs,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [location, selectedFilter, getLocationDisplayedAs],
    );

    const onRowAdd = React.useCallback(
        data => {
            setDialogueBusy(true);
            const request = structuredClone(data);
            const wrappedRequest = transformAddRequest({ request, selectedFilter, location });

            actions
                .addLocation({ type: selectedFilter, request: wrappedRequest })
                .then(() => {
                    closeDialog();
                    openConfirmationAlert(
                        pageLocale.alerts.addSuccess(capitaliseLeadingChar(selectedFilter)),
                        'success',
                    );
                    actionHandler[selectedFilter](actions, location);
                })
                .catch(error => {
                    console.log(error);
                    handleApiError({ message: pageLocale.alerts.addFail(capitaliseLeadingChar(selectedFilter)) });
                })
                .finally(() => {
                    setDialogueBusy(false);
                });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [location, selectedFilter],
    );

    const onRowEdit = React.useCallback(
        data => {
            setDialogueBusy(true);
            const request = structuredClone(data);
            const wrappedRequest = transformUpdateRequest({ request, selectedFilter, location });

            actions
                .updateLocation({ type: selectedFilter, request: wrappedRequest })
                .then(() => {
                    closeDialog();
                    openConfirmationAlert(
                        pageLocale.alerts.updateSuccess(capitaliseLeadingChar(selectedFilter)),
                        'success',
                    );
                    actionHandler[selectedFilter](actions, location);
                })
                .catch(error => {
                    console.log(error);
                    handleApiError({ message: pageLocale.alerts.updateFail(capitaliseLeadingChar(selectedFilter)) });
                })
                .finally(() => {
                    setDialogueBusy(false);
                });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [location, selectedFilter],
    );

    const onRowDelete = React.useCallback(
        data => {
            setDialogueBusy(true);
            const selectedFilter = data.props.selectedFilter;
            const id = data.row[`${selectedFilter}_id`];

            actions
                .deleteLocation({ type: selectedFilter, id })
                .then(() => {
                    closeDialog();
                    openConfirmationAlert(
                        pageLocale.alerts.deleteSuccess(capitaliseLeadingChar(selectedFilter)),
                        'success',
                    );
                    actionHandler[selectedFilter](actions, location);
                })
                .catch(error => {
                    console.log(error);
                    handleApiError({ message: pageLocale.alerts.deleteFail(capitaliseLeadingChar(selectedFilter)) });
                })
                .finally(() => {
                    setDialogueBusy(false);
                });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [location, selectedFilter],
    );

    const columns = useMemo(
        () =>
            getColumns({
                config,
                locale: pageLocale.form.columns,
                selectedFilter,
                handleEditClick,
                handleDeleteClick,
            }),

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [handleDeleteClick, handleEditClick, selectedFilter],
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
                        title={actionState.title}
                        action="add"
                        updateDialogueBoxId="addRow"
                        isOpen={actionState.isAdd}
                        locale={pageLocale.dialogAdd}
                        locationType={selectedFilter}
                        fields={config?.[selectedFilter].fields ?? []}
                        columns={pageLocale.form.columns[selectedFilter]}
                        row={actionState?.row}
                        onCancelAction={closeDialog}
                        onAction={onRowAdd}
                        props={actionState?.props}
                        isBusy={dialogueBusy}
                    />
                    <UpdateDialog
                        title={actionState.title}
                        action="edit"
                        updateDialogueBoxId="editRow"
                        isOpen={actionState.isEdit}
                        locale={pageLocale.dialogEdit}
                        locationType={selectedFilter}
                        fields={config?.[selectedFilter].fields ?? []}
                        columns={pageLocale.form.columns[selectedFilter]}
                        row={actionState?.row}
                        onCancelAction={closeDialog}
                        onAction={onRowEdit}
                        props={actionState?.props}
                        isBusy={dialogueBusy}
                    />
                    <ConfirmationBox
                        actionButtonColor="primary"
                        actionButtonVariant="contained"
                        cancelButtonColor="secondary"
                        confirmationBoxId="deleteRow"
                        onCancelAction={closeDialog}
                        onAction={onRowDelete}
                        isOpen={actionState.isDelete}
                        locale={
                            !dialogueBusy
                                ? pageLocale.dialogDeleteConfirm
                                : {
                                      ...pageLocale.dialogDeleteConfirm,
                                      confirmButtonLabel: (
                                          <CircularProgress
                                              color="inherit"
                                              size={25}
                                              id="confirmationSpinner"
                                              data-testid="confirmationSpinner"
                                          />
                                      ),
                                  }
                        }
                        disableButtonsWhenBusy
                        isBusy={dialogueBusy}
                        noMinContentWidth
                        actionProps={{ row: actionState?.row, props: actionState?.props }}
                    />

                    <Grid container spacing={0} className={classes.tableMarginTop}>
                        <Grid item xs={12} padding={0}>
                            <Typography variant={'h6'} component={'div'}>
                                {pageLocale.form.title}
                            </Typography>

                            <Grid container spacing={3}>
                                <AutoLocationPicker
                                    actions={actions}
                                    location={location}
                                    setLocation={setLocation}
                                    hide={['room']}
                                    hasAllOption
                                />
                            </Grid>
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
                                    toolbar: {
                                        label: pageLocale.form.addLocationButton(selectedFilter),
                                        onClick: handleAddClick,
                                    },
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
                        autoHideDuration={confirmationAlert.autoHideDuration}
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

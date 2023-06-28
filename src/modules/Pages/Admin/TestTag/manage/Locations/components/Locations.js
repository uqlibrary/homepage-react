import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import AddToolbar from '../../../SharedComponents/DataTable/AddToolbar';
import UpdateDialog from '../../../SharedComponents/DataTable/UpdateDialog';
import AutoLocationPicker from '../../../SharedComponents/LocationPicker/AutoLocationPicker';
import DataTable from './../../../SharedComponents/DataTable/DataTable';
import { useDataTableRow, useDataTableColumns } from '../../../SharedComponents/DataTable/DataTableHooks';
import { useLocation, useSelectLocation } from '../../../SharedComponents/LocationPicker/LocationPickerHooks';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';

import { useLocationDisplayName } from './hooks';
import locale from '../../../testTag.locale';
import { PERMISSIONS } from '../../../config/auth';
import config from './config';
import { emptyActionState, actionReducer, transformAddRequest, transformUpdateRequest } from './utils';
import { capitaliseLeadingChar } from '../../../helpers/helpers';
import { locationType } from '../../../SharedComponents/LocationPicker/utils';

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
    [locationType.site]: actions => {
        actions.clearSites();
        actions.loadSites();
    },
    [locationType.building]: actions => {
        actions.clearSites();
        actions.loadSites();
    },
    [locationType.floor]: (actions, location) => {
        actions.clearFloors();
        actions.loadFloors(location.building);
    },
    [locationType.room]: (actions, location) => {
        actions.clearRooms();
        actions.loadRooms(location.floor);
    },
};

const ManageLocations = ({ actions }) => {
    const pageLocale = locale.pages.manage.locations;
    const classes = useStyles();
    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });
    const [dialogueBusy, setDialogueBusy] = React.useState(false);
    const { row, setRow } = useDataTableRow([]);

    const store = useSelector(state => state.get('testTagLocationReducer'));
    const { location, setLocation } = useLocation();
    const { selectedLocation } = useSelectLocation({
        location,
        setLocation,
        setRow,
        actions,
        store,
    });
    const [confirmationAlert, setConfirmationAlert] = React.useState({ message: '', visible: false });
    const { locationDisplayedAs } = useLocationDisplayName(location, store.siteList, store.floorList);

    const handleAddClick = React.useCallback(() => {
        actionDispatch({
            type: 'add',
            title: pageLocale.dialogAdd.confirmationTitle(selectedLocation),
            selectedLocation,
            location,
            displayLocation: locationDisplayedAs,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, selectedLocation, locationDisplayedAs]);

    const handleEditClick = React.useCallback(
        ({ id, api }) => {
            const row = api.getRow(id);
            actionDispatch({
                type: 'edit',
                title: pageLocale.dialogEdit.confirmationTitle(selectedLocation),
                row,
                selectedLocation,
                location,
                displayLocation: locationDisplayedAs,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [location, selectedLocation, locationDisplayedAs],
    );

    const handleDeleteClick = React.useCallback(
        ({ id, api }) => {
            const row = api.getRow(id);
            actionDispatch({
                type: 'delete',
                row,
                selectedLocation,
                location,
                displayLocation: locationDisplayedAs,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [location, selectedLocation, locationDisplayedAs],
    );
    const shouldDisableDelete = row => (row?.asset_count ?? 1) === 0;

    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        filterKey: selectedLocation,
        handleEditClick,
        handleDeleteClick,
        shouldDisableDelete,
    });

    const closeConfirmationAlert = () => {
        setConfirmationAlert({ message: '', visible: false, type: confirmationAlert.type });
    };
    const openConfirmationAlert = (message, type) => {
        setConfirmationAlert({ message: message, visible: true, type: !!type ? type : 'info', autoHideDuration: 6000 });
    };

    const closeDialog = () => actionDispatch({ type: 'clear' });

    const handleApiError = response => {
        openConfirmationAlert(`Request failed: ${response.message}`, 'error');
    };

    const onRowAdd = React.useCallback(
        data => {
            setDialogueBusy(true);
            const request = structuredClone(data);
            const wrappedRequest = transformAddRequest({ request, selectedLocation, location });

            actions
                .addLocation({ type: selectedLocation, request: wrappedRequest })
                .then(() => {
                    closeDialog();
                    openConfirmationAlert(
                        pageLocale.alerts.addSuccess(capitaliseLeadingChar(selectedLocation)),
                        'success',
                    );
                    actionHandler[selectedLocation](actions, location);
                })
                .catch(error => {
                    console.error(error);
                    handleApiError({ message: pageLocale.alerts.addFail(capitaliseLeadingChar(selectedLocation)) });
                })
                .finally(() => {
                    setDialogueBusy(false);
                });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [location, selectedLocation],
    );

    const onRowEdit = React.useCallback(
        data => {
            setDialogueBusy(true);
            const request = structuredClone(data);
            const wrappedRequest = transformUpdateRequest({ request, selectedLocation, location });

            actions
                .updateLocation({ type: selectedLocation, request: wrappedRequest })
                .then(() => {
                    closeDialog();
                    openConfirmationAlert(
                        pageLocale.alerts.updateSuccess(capitaliseLeadingChar(selectedLocation)),
                        'success',
                    );
                    actionHandler[selectedLocation](actions, location);
                })
                .catch(error => {
                    console.error(error);
                    handleApiError({ message: pageLocale.alerts.updateFail(capitaliseLeadingChar(selectedLocation)) });
                })
                .finally(() => {
                    setDialogueBusy(false);
                });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [location, selectedLocation],
    );

    const onRowDelete = React.useCallback(
        data => {
            setDialogueBusy(true);
            const selectedLocation = data.props.selectedLocation;
            const id = data.row[`${selectedLocation}_id`];

            actions
                .deleteLocation({ type: selectedLocation, id })
                .then(() => {
                    closeDialog();
                    openConfirmationAlert(
                        pageLocale.alerts.deleteSuccess(capitaliseLeadingChar(selectedLocation)),
                        'success',
                    );
                    actionHandler[selectedLocation](actions, location);
                })
                .catch(error => {
                    console.error(error);
                    handleApiError({ message: pageLocale.alerts.deleteFail(capitaliseLeadingChar(selectedLocation)) });
                })
                .finally(() => {
                    setDialogueBusy(false);
                });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [location, selectedLocation],
    );

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_admin]}
        >
            <div className={classes.root}>
                <StandardCard title={pageLocale.form.title}>
                    <UpdateDialog
                        title={actionState.title}
                        action="add"
                        updateDialogueBoxId="addRow"
                        isOpen={actionState.isAdd}
                        locale={pageLocale.dialogAdd}
                        locationType={selectedLocation}
                        fields={config?.[selectedLocation].fields ?? []}
                        columns={pageLocale.form.columns[selectedLocation]}
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
                        locationType={selectedLocation}
                        fields={config?.[selectedLocation].fields ?? []}
                        columns={pageLocale.form.columns[selectedLocation]}
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

                    <Grid container spacing={3}>
                        <AutoLocationPicker
                            actions={actions}
                            location={location}
                            setLocation={setLocation}
                            hide={['room']}
                            hasAllOption
                            locale={locale.pages.general.locationPicker}
                        />
                    </Grid>
                    <Grid container spacing={3} className={classes.tableMarginTop}>
                        <Grid item padding={3} style={{ flex: 1 }}>
                            <DataTable
                                rows={row}
                                columns={columns}
                                rowId={`${selectedLocation}_id`}
                                components={{ Toolbar: AddToolbar }}
                                componentsProps={{
                                    toolbar: {
                                        label: pageLocale.form.addLocationButton(selectedLocation),
                                        onClick: handleAddClick,
                                    },
                                }}
                                loading={store.siteListLoading || store.floorListLoading || store.roomListLoading}
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

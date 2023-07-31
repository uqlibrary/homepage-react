import React, { useEffect, useReducer } from 'react';
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

import { useConfirmationAlert } from '../../../helpers/hooks';
import { useLocationDisplayName } from './hooks';
import locale from '../../../testTag.locale';
import { PERMISSIONS } from '../../../config/auth';
import config from './config';
import { emptyActionState, actionReducer, transformAddRequest, transformUpdateRequest } from './utils';
import { locationType } from '../../../SharedComponents/LocationPicker/utils';

const componentId = 'locations';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    tableMarginTop: {
        marginTop: theme.spacing(2),
    },
}));

export const actionHandler = {
    [locationType.site]: actions => {
        actions.loadSites();
    },
    [locationType.building]: actions => {
        actions.loadSites();
    },
    [locationType.floor]: (actions, location) => {
        actions.loadFloors(location.building);
    },
    [locationType.room]: (actions, location) => {
        actions.loadRooms(location.floor);
    },
};

export const locationDataFieldKeys = {
    [locationType.site]: 'site_id_displayed',
    [locationType.building]: 'building_id_displayed',
    [locationType.floor]: 'floor_id_displayed',
    [locationType.room]: 'room_id_displayed',
};

const ManageLocations = ({ actions }) => {
    useEffect(() => {
        actions.clearSites();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const { confirmationAlert, openConfirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
    });

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
    const shouldDisableDelete = row => (row?.asset_count ?? 1) > 0;

    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        filterKey: selectedLocation,
        handleEditClick,
        handleDeleteClick,
        shouldDisableDelete,
        actionDataFieldKeys: { valueKey: locationDataFieldKeys[selectedLocation] },
        actionTooltips: pageLocale.form.actionTooltips,
    });

    const closeDialog = React.useCallback(() => {
        actionDispatch({ type: 'clear' });
    }, []);

    const onRowAdd = React.useCallback(
        data => {
            setDialogueBusy(true);
            const request = structuredClone(data);
            const wrappedRequest = transformAddRequest({ request, selectedLocation, location });

            actions
                .addLocation({ type: selectedLocation, request: wrappedRequest })
                .then(() => {
                    closeDialog();
                    openConfirmationAlert(locale.config.alerts.success(), 'success');
                    actionHandler[selectedLocation](actions, location);
                })
                .catch(error => {
                    console.error(error);
                    openConfirmationAlert(locale.config.alerts.failed(pageLocale.snackbar.addFail), 'error');
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
                    openConfirmationAlert(locale.config.alerts.success(), 'success');
                    actionHandler[selectedLocation](actions, location);
                })
                .catch(error => {
                    console.error(error);
                    openConfirmationAlert(locale.config.alerts.failed(pageLocale.snackbar.updateFail), 'error');
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
                    openConfirmationAlert(locale.config.alerts.success(), 'success');
                    actionHandler[selectedLocation](actions, location);
                })
                .catch(error => {
                    console.error(error);
                    openConfirmationAlert(locale.config.alerts.failed(pageLocale.snackbar.deleteFail), 'error');
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
                        id={componentId}
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
                        id={componentId}
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
                        confirmationBoxId={componentId}
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
                                              id={`${componentId}-progress`}
                                              data-testid={`${componentId}-progress`}
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
                            id={componentId}
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
                                id={componentId}
                                rows={row}
                                columns={columns}
                                rowId={`${selectedLocation}_id`}
                                components={{ Toolbar: AddToolbar }}
                                componentsProps={{
                                    toolbar: {
                                        id: componentId,
                                        label: pageLocale.form.addLocationButton(selectedLocation),
                                        onClick: handleAddClick,
                                    },
                                }}
                                loading={store.siteListLoading || store.floorListLoading || store.roomListLoading}
                                key={selectedLocation}
                                {...(config[selectedLocation].sort ?? {})}
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

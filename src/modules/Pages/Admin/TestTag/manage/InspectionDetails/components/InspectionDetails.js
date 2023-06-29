import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import DataTable from './../../../SharedComponents/DataTable/DataTable';
import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import AssetSelector from '../../../SharedComponents/AssetSelector/AssetSelector';
import { useDataTableColumns, useDataTableRow } from '../../../SharedComponents/DataTable/DataTableHooks';
import UpdateDialog from '../../../SharedComponents/DataTable/UpdateDialog';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import locale from '../../../testTag.locale';
import { PERMISSIONS } from '../../../config/auth';
import config from './config';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    tableMarginTop: {
        marginTop: theme.spacing(0),
    },
    gridRoot: {
        border: 0,
    },
}));

const InspectionDetails = ({ actions, assetsList, assetsListLoading }) => {
    const pageLocale = locale.pages.manage.inspectiondetails;
    const classes = useStyles();

    const { user } = useSelector(state => state.get('testTagUserReducer'));
    const emptyActionState = { isEdit: false, rows: {}, row: {}, title: '' };

    const actionReducer = (_, action) => {
        switch (action.type) {
            case 'edit':
                return {
                    title: pageLocale.dialogEdit.confirmationTitle,
                    isEdit: true,
                    row: action.row,
                };
            case 'clear':
                return { ...emptyActionState };
            default:
                throw `Unknown action '${action.type}'`;
        }
    };
    const [actionState, actionDispatch] = React.useReducer(actionReducer, { ...emptyActionState });
    const [dialogueBusy, setDialogueBusy] = React.useState(false);

    const [confirmationAlert, setConfirmationAlert] = React.useState({ message: '', visible: false });

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

    const handleEditClick = ({ id, api }) => {
        const row = api.getRow(id);
        actionDispatch({
            type: 'edit',
            title: pageLocale.dialogEdit?.confirmationTitle,
            row,
        });
    };

    const onRowEdit = data => {
        setDialogueBusy(true);
        // const id = data.device_id;
        // const request = structuredClone(data);
        // const wrappedRequest = transformUpdateRequest(request);
        // console.log('edit', wrappedRequest);
        // actions
        //     .updateInspectionDevice(id, wrappedRequest)
        //     .then(() => {
        //         closeDialog();
        //         openConfirmationAlert(pageLocale.alerts?.updateSuccess, 'success');
        //         actions.clearInspectionDevices();
        //     })
        //     .catch(error => {
        //         console.log(error);
        //         handleApiError({ message: pageLocale.alerts?.updateFail });
        //     })
        //     .finally(() => {
        //         setDialogueBusy(false);
        //     });
    };

    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        handleEditClick,
    });

    const { row } = useDataTableRow(assetsList);

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_inspect]}
        >
            <div className={classes.root}>
                <StandardCard noHeader>
                    <UpdateDialog
                        title={actionState.title}
                        action="edit"
                        updateDialogueBoxId="editRow"
                        isOpen={actionState.isEdit}
                        locale={pageLocale?.dialogEdit}
                        fields={config?.fields ?? []}
                        columns={pageLocale.form.columns}
                        row={actionState?.row}
                        onCancelAction={closeDialog}
                        onAction={onRowEdit}
                        props={actionState?.props}
                        isBusy={dialogueBusy}
                    />
                    <Grid container spacing={3}>
                        <Grid item padding={3} xs={12} md={4} style={{ flex: 1 }}>
                            <AssetSelector
                                id="assetId"
                                locale={pageLocale.form}
                                user={user}
                                classNames={{ formControl: classes.formControl }}
                                canAddNew={false}
                                required={false}
                                clearOnSelect
                                headless
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} className={classes.tableMarginTop}>
                        <Grid item padding={3} style={{ flex: 1 }}>
                            <DataTable
                                rows={row}
                                columns={columns}
                                rowId={'asset_id'}
                                loading={assetsListLoading}
                                classes={{ root: classes.gridRoot }}
                                disableColumnFilter
                                disableColumnMenu
                            />
                        </Grid>
                    </Grid>
                    <ConfirmationAlert
                        isOpen={confirmationAlert.visible}
                        message={confirmationAlert.message}
                        type={confirmationAlert.type}
                        closeAlert={closeConfirmationAlert}
                        autoHideDuration={confirmationAlert.autoHideDuration}
                    />
                </StandardCard>
            </div>
        </StandardAuthPage>
    );
};

InspectionDetails.propTypes = {
    assetsList: PropTypes.any,
    assetsListLoading: PropTypes.bool,
    assetsListError: PropTypes.any,
};

export default React.memo(InspectionDetails);

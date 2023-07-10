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
import { transformRow, transformUpdateRequest } from './utils';

const componentId = 'inspection-details';

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

const emptyActionState = { isEdit: false, rows: {}, row: {}, title: '' };

const actionReducer = (_, action) => {
    switch (action.type) {
        case 'edit':
            return {
                title: action.title,
                isEdit: true,
                row: action.row,
            };
        case 'clear':
            return { ...emptyActionState };
        default:
            throw `Unknown action '${action.type}'`;
    }
};

const InspectionDetails = ({ actions, assetsList, assetsListLoading }) => {
    const pageLocale = locale.pages.manage.inspectiondetails;
    const classes = useStyles();

    const { user } = useSelector(state => state.get('testTagUserReducer'));

    const [actionState, actionDispatch] = React.useReducer(actionReducer, { ...emptyActionState });
    const [dialogueBusy, setDialogueBusy] = React.useState(false);

    const [confirmationAlert, setConfirmationAlert] = React.useState({ message: '', visible: false });

    const searchPatternRef = React.useRef('');

    const closeConfirmationAlert = () => {
        setConfirmationAlert({ message: '', visible: false, type: confirmationAlert.type });
    };
    const openConfirmationAlert = (message, type) => {
        setConfirmationAlert({ message: message, visible: true, type: !!type ? type : 'info', autoHideDuration: 6000 });
    };

    const closeDialog = () => actionDispatch({ type: 'clear' });

    const onSearch = pattern => {
        searchPatternRef.current = pattern;
    };

    const repeatCurrentSearch = () => {
        actions.loadAssets(searchPatternRef.current);
    };

    const handleEditClick = ({ id, api }) => {
        const row = api.getRow(id);
        console.log('edit clicked', row);
        actionDispatch({
            type: 'edit',
            title: pageLocale.dialogEdit?.confirmationTitle,
            row,
        });
    };

    const onRowEdit = data => {
        setDialogueBusy(true);
        console.log(data);
        const id = data.asset_id;
        const wrappedRequest = transformUpdateRequest(data);
        actions
            .updateInspectionDetails(id, wrappedRequest)
            .then(() => {
                closeDialog();
                openConfirmationAlert(locale.config.alerts.success(), 'success');
                repeatCurrentSearch();
            })
            .catch(error => {
                console.error(error);
                openConfirmationAlert(locale.config.alerts.error(error.message), 'error');
            })
            .finally(() => {
                setDialogueBusy(false);
            });
    };

    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        handleEditClick,
        actionDataFieldKeys: { valueKey: 'asset_id_displayed' },
    });

    const { row } = useDataTableRow(assetsList, transformRow);

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
                        id={componentId}
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
                                id={componentId}
                                locale={pageLocale.form}
                                user={user}
                                classNames={{ formControl: classes.formControl }}
                                canAddNew={false}
                                required={false}
                                clearOnSelect={false}
                                headless
                                onSearch={onSearch}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} className={classes.tableMarginTop}>
                        <Grid item padding={3} style={{ flex: 1 }}>
                            <DataTable
                                rows={row}
                                columns={columns}
                                id={componentId}
                                rowId={'asset_id_displayed'}
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
    actions: PropTypes.object,
    assetsList: PropTypes.any,
    assetsListLoading: PropTypes.bool,
    assetsListError: PropTypes.any,
};

export default React.memo(InspectionDetails);

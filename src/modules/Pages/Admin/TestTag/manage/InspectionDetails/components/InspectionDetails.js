import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import DataTable from './../../../SharedComponents/DataTable/DataTable';
import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import AssetSelector from '../../../SharedComponents/AssetSelector/AssetSelector';
import UpdateDialog from '../../../SharedComponents/UpdateDialog/UpdateDialog';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';

import { useAccountUser, useConfirmationAlert } from '../../../helpers/hooks';
import { useDataTableColumns, useDataTableRow } from '../../../SharedComponents/DataTable/DataTableHooks';
import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
import { PERMISSIONS } from '../../../config/auth';
import config from './config';
import { transformRow, transformUpdateRequest, emptyActionState, actionReducer } from './utils';
import { breadcrumbs } from 'config/routes';

import { SwitchIncludeAllTeams, useTeams, createFilter } from '../../../SharedComponents/Teams';

const componentId = 'inspection-details';

const InspectionDetails = ({ actions }) => {
    const pageLocale = locale.pages.manage.inspectiondetails;
    const { assetsList, assetsListLoading, assetsListError } = useSelector(state =>
        state.get?.('testTagAssetsReducer'),
    );

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.testntag.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.testntag.pathname);

        actions.clearAssets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onCloseConfirmationAlert = () => actions.clearAssetsError();
    const { confirmationAlert, openConfirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
        onClose: onCloseConfirmationAlert,
        errorMessage: assetsListError,
        errorMessageFormatter: locale.config.alerts.error,
    });

    const { user } = useAccountUser();

    const [actionState, actionDispatch] = React.useReducer(actionReducer, { ...emptyActionState });
    const [dialogueBusy, setDialogueBusy] = React.useState(false);

    const [searchPattern, setSearchPattern] = React.useState(undefined);

    const teamActions = useMemo(
        () => ({
            loadAssets: actions?.loadAssetsFiltered,
            clearAssets: actions?.clearAssets,
        }),
        [actions],
    );

    const { includeAllTeams, onAllTeamsChange, allTeams } = useTeams({
        searchTerm: searchPattern,
        actions: teamActions,
    });

    const closeDialog = React.useCallback(() => {
        actionDispatch({ type: 'clear' });
    }, []);

    const onSearch = pattern => {
        setSearchPattern(pattern);
    };

    const handleEditClick = ({ id, api }) => {
        const row = api.getRow(id);
        actionDispatch({
            type: 'edit',
            title: pageLocale.dialogEdit?.confirmationTitle,
            row,
        });
    };

    const onRowEdit = React.useCallback(
        data => {
            setDialogueBusy(true);
            const id = data.asset_id;
            const wrappedRequest = transformUpdateRequest(data);
            actions
                .updateInspectionDetails(id, wrappedRequest)
                .then(() => {
                    closeDialog();
                    openConfirmationAlert(locale.config.alerts.success(), 'success');
                    const filters = createFilter(allTeams);
                    teamActions.loadAssets(searchPattern, filters); // call last search
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
        [searchPattern, allTeams],
    );

    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        handleEditClick,
        actionDataFieldKeys: { valueKey: 'asset_id_displayed' },
        actionTooltips: pageLocale.form.actionTooltips,
    });

    const { row } = useDataTableRow(assetsList, transformRow);

    const onClear = React.useCallback(() => {
        setSearchPattern(undefined);
    }, []);

    const handleAllTeamsChange = value => {
        onAllTeamsChange?.(value, { disableAssetClearing: true });
    };
    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_inspect]}
            inclusive={false}
        >
            <Box sx={{ flexGrow: 1 }}>
                <StandardCard noHeader>
                    <UpdateDialog
                        title={actionState.title}
                        action="edit"
                        id={componentId}
                        isOpen={actionState.isEdit}
                        locale={pageLocale?.dialogEdit}
                        fields={config?.fields ?? /* istanbul ignore next */ []}
                        columns={pageLocale.form.columns}
                        row={actionState?.row}
                        onCancelAction={closeDialog}
                        onAction={onRowEdit}
                        props={actionState?.props}
                        isBusy={dialogueBusy}
                    />
                    <Grid container spacing={3}>
                        <Grid xs={12} md={4}>
                            <AssetSelector
                                id={componentId}
                                locale={pageLocale.form}
                                user={user}
                                classNames={{ formControl: 'formControl' }}
                                canAddNew={false}
                                required={false}
                                clearOnSelect={false}
                                headless
                                filter={includeAllTeams}
                                onSearch={onSearch}
                                onClear={onClear}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid xs={12}>
                            <SwitchIncludeAllTeams
                                id={componentId}
                                locale={pageLocale.form}
                                onChange={handleAllTeamsChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        spacing={3}
                        sx={theme => {
                            marginTop: theme.spacing(0);
                        }}
                    >
                        <Grid style={{ flex: 1 }}>
                            <DataTable
                                rows={row}
                                columns={columns}
                                id={componentId}
                                rowId={'asset_id_displayed'}
                                loading={assetsListLoading}
                                disableColumnFilter
                                disableColumnMenu
                                {...(config.sort ?? /* istanbul ignore next */ {})}
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
            </Box>
        </StandardAuthPage>
    );
};

InspectionDetails.propTypes = {
    actions: PropTypes.object,
};

export default React.memo(InspectionDetails);

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import DataTable from '../../../SharedComponents/DataTable/DataTable';
import { useDataTableColumns } from '../../../SharedComponents/DataTable/DataTableHooks';
import AssetSelector from '../../../SharedComponents/AssetSelector/AssetSelector';
import FooterBar from '../../../SharedComponents/DataTable/FooterBar';
import FilterDialog from './FilterDialog';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';

import config from './config';
import { isValidAssetId } from '../../../Inspection/utils/helpers';
import { isEmptyObject } from '../../../helpers/helpers';
import { useAccountUser } from '../../../helpers/hooks';

const StepOne = ({ id, list, actions, isFilterDialogOpen, setIsFilterDialogOpen, resetForm, nextStep }) => {
    const componentId = `${id}-step-one`;
    const componentIdLower = `${id.replace(/-/g, '_')}-step-one`;

    const pageLocale = locale.pages.manage.bulkassetupdate;
    const stepOneLocale = pageLocale.form.step.one;

    const { user } = useAccountUser();

    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('md')) || false;

    const handleDeleteClick = useCallback(
        ({ id, api }) => {
            const row = api.getRow(id);
            list.deleteWith('asset_id', row.asset_id);
        },
        [list],
    );

    const handleSearchAssetIdChange = useCallback(
        newValue => {
            if (isEmptyObject(newValue)) return;
            list.addStart(newValue);
        },
        [list],
    );

    const { columns } = useDataTableColumns({
        config: config.form,
        locale: pageLocale.form.columns,
        handleDeleteClick,
        deleteIcon: <RemoveCircleOutlineIcon size="small" />,
        actionDataFieldKeys: { valueKey: 'asset_id_displayed' },
        actionTooltips: stepOneLocale.actionTooltips,
    });

    const openFilterDialog = () => setIsFilterDialogOpen(true);
    const closeFilterDialog = () => setIsFilterDialogOpen(false);
    const handleFilterDialogClose = () => closeFilterDialog();
    const handleFilterDialogAction = data => {
        closeFilterDialog();
        list.addStart(data);
    };
    return (
        <StandardCard title={stepOneLocale.title} standardCardId={`standard_card-${componentId}-step-1`}>
            <Grid container spacing={3}>
                <Grid xs={12} md={4}>
                    <AssetSelector
                        id={componentId}
                        locale={stepOneLocale}
                        user={user}
                        classNames={{ formControl: 'formControl' }}
                        onChange={handleSearchAssetIdChange}
                        validateAssetId={isValidAssetId}
                        canAddNew={false}
                        required={false}
                        clearOnSelect
                        filter={{ status: { discarded: false } }}
                    />
                </Grid>
                <Grid xs={12} md={2} className={'centredGrid'}>
                    or
                </Grid>
                <Grid xs={12} md={6} className={'centredGridNoJustify'}>
                    <Button
                        variant="outlined"
                        id={`${componentIdLower}-feature-button`}
                        data-testid={`${componentIdLower}-feature-button`}
                        color="primary"
                        onClick={openFilterDialog}
                        fullWidth={isMobileView}
                    >
                        {stepOneLocale.button.findAndAdd}
                    </Button>
                </Grid>
            </Grid>
            {list.data.length > 0 && (
                <Grid container spacing={3}>
                    <Grid xs={12}>
                        <Alert
                            severity="info"
                            id={`${componentIdLower}-count-alert`}
                            data-testid={`${componentIdLower}-count-alert`}
                        >
                            {pageLocale.form.alert.alertMessageAssetsChosen(
                                list.data.length,
                                locale.pages.general.pluraliser,
                            )}
                        </Alert>
                    </Grid>
                </Grid>
            )}
            <Grid container spacing={3}>
                <Grid sx={{ flex: 1 }}>
                    <DataTable
                        id={componentId}
                        rows={list.data}
                        columns={columns}
                        rowId={'asset_id'}
                        handleDeleteClick={handleDeleteClick}
                        components={{ Footer: FooterBar }}
                        componentsProps={{
                            footer: {
                                id: componentId,
                                actionLabel: stepOneLocale.button.next,
                                altLabel: stepOneLocale.button.clear,
                                onAltClick: resetForm,
                                onActionClick: nextStep,
                                nextButtonProps: { disabled: list.data.length === 0 },
                                className: 'actionButtons',
                            },
                        }}
                        {...(config.form.sort ?? /* istanbul ignore next */ {})}
                    />
                </Grid>
            </Grid>
            <FilterDialog
                id={componentId}
                locale={pageLocale.form.filterDialog}
                assetTypeLocale={pageLocale.form.filterDialog.form.assetType}
                locationLocale={locale.pages.general.locationPicker}
                confirmAlertTimeout={locale.config.alerts.timeout}
                errorMessageFormatter={locale.config.alerts.error}
                minContentWidth={'100%'}
                config={config.filterDialog}
                isOpen={isFilterDialogOpen}
                onCancel={handleFilterDialogClose}
                onAction={handleFilterDialogAction}
                actions={actions}
                isMobileView={isMobileView}
            />
        </StandardCard>
    );
};

StepOne.propTypes = {
    id: PropTypes.string.isRequired,
    list: PropTypes.object.isRequired,
    isFilterDialogOpen: PropTypes.bool.isRequired,
    setIsFilterDialogOpen: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    nextStep: PropTypes.func.isRequired,
    actions: PropTypes.object,
};

export default React.memo(StepOne);

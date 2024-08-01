import React, { useReducer } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import InspectionPanel from './InspectionPanel';
import LastInspectionPanel from './LastInspectionPanel';
import AssetSelector from '../../SharedComponents/AssetSelector/AssetSelector';
import UpdateDialog from '../../SharedComponents/UpdateDialog/UpdateDialog';
import AssetTypeSelector, { ADD_NEW_ID } from '../../SharedComponents/AssetTypeSelector/AssetTypeSelector';

import { isValidAssetId, isValidAssetTypeId, statusEnum } from '../utils/helpers';
import { transformAddAssetTypeRequest } from '../utils/transformers';
import configAssetPanel from '../../manage/AssetTypes/components/config';
import locale from '../../testTag.locale';
import { actionReducer, emptyActionState } from '../utils/hooks';

const componentId = 'asset-panel';
const componentIdLower = 'asset_panel';

const testStatusEnum = statusEnum(locale.pages.inspect.config);

const AssetPanel = ({
    actions,
    formValues,
    selectedAsset,
    resetForm,
    location,
    assignCurrentAsset,
    handleChange,
    defaultNextTestDateValue,
    saveAssetTypeSaving,
    isMobileView,
    canAddAssetType,
    openConfirmationAlert,
}) => {
    const pageLocale = locale.pages.inspect.form.asset;
    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });

    const { inspectionConfigLoading } = useSelector(state => state.get?.('testTagOnLoadInspectionReducer'));

    const { user } = useSelector(state => state.get('testTagUserReducer'));

    const [dialogueBusy, setDialogueBusy] = React.useState(false);
    const [shouldAutoFocus, setShouldAutoFocus] = React.useState(false);

    React.useLayoutEffect(() => {
        setShouldAutoFocus(
            formValues?.room_id !== undefined &&
                formValues?.room_id !== -1 &&
                formValues?.asset_id_displayed === undefined,
        );
    }, [formValues?.room_id, formValues?.asset_id_displayed]);

    const handleAddClick = () => {
        actionDispatch({
            type: 'add',
            title: pageLocale.assetType.addDialog?.confirmationTitle,
        });
    };

    const closeDialog = React.useCallback(() => {
        actionDispatch({ type: 'clear' });
    }, []);

    const onRowAdd = React.useCallback(data => {
        setDialogueBusy(true);
        const request = structuredClone(data);
        const wrappedRequest = transformAddAssetTypeRequest(request);

        actions
            .saveAssetTypeAndReload(wrappedRequest)
            .then(response => {
                closeDialog();
                openConfirmationAlert(locale.config.alerts.success(), 'success');
                actions
                    .loadAssetTypes()
                    .then(() => {
                        handleChange('asset_type_id')(response.data.asset_type_id);
                    })
                    .catch(error => {
                        console.error(error);
                        openConfirmationAlert(locale.config.alerts.error(pageLocale.assetType.loadError), 'error');
                    });
            })
            .catch(error => {
                console.error(error);
                openConfirmationAlert(locale.config.alerts.failed(pageLocale.assetType.saveError), 'error');
            })
            .finally(() => {
                setDialogueBusy(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAssetTypeChange = assetType => {
        if (assetType.asset_type_id === ADD_NEW_ID) {
            handleAddClick();
        } else handleChange('asset_type_id')(assetType.asset_type_id);
    };

    return (
        <StandardCard
            standardCardId={componentIdLower}
            title={pageLocale.title}
            style={{ marginTop: '30px', border: 'thin solid #d1d0d2' }}
        >
            <UpdateDialog
                title={actionState.title}
                action="add"
                id={componentId}
                isOpen={actionState.isAdd}
                locale={locale.pages.manage.assetTypes.dialogAdd}
                fields={configAssetPanel.fields}
                columns={locale.pages.manage.assetTypes.form.columns}
                row={actionState?.row}
                onCancelAction={closeDialog}
                onAction={onRowAdd}
                props={actionState?.props}
                isBusy={dialogueBusy}
            />
            <Grid container spacing={3}>
                <Grid xs={12} item sm={6} md={3}>
                    <AssetSelector
                        id={componentId}
                        locale={pageLocale}
                        user={user}
                        classNames={{ formControl: 'formControl' }}
                        autoFocus={shouldAutoFocus}
                        onChange={assignCurrentAsset}
                        onReset={resetForm}
                        validateAssetId={isValidAssetId}
                        selectedAsset={formValues?.asset_id_displayed}
                    />
                </Grid>
                <Grid xs={12} item sm={6}>
                    <FormControl variant="standard" className={'formControl'} fullWidth>
                        <AssetTypeSelector
                            id={componentId}
                            locale={pageLocale.assetType}
                            actions={actions}
                            value={formValues?.asset_type_id}
                            onChange={handleAssetTypeChange}
                            validateAssetTypeId={isValidAssetTypeId}
                            disabled={
                                inspectionConfigLoading ||
                                saveAssetTypeSaving ||
                                !isValidAssetId(formValues?.asset_id_displayed)
                            }
                            canAddNew={canAddAssetType}
                            groupBy={() => false}
                            autoSelect={false}
                        />
                    </FormControl>
                </Grid>
            </Grid>
            <LastInspectionPanel
                asset={selectedAsset ?? {}}
                currentLocation={location}
                dateFormatPattern={locale.pages.inspect.config.dateFormatDisplay}
                disabled={!!!selectedAsset?.last_inspection?.inspect_status ?? /* istanbul ignore next */ true}
                forceOpen={selectedAsset?.asset_status === testStatusEnum.DISCARDED.value}
            />
            {selectedAsset?.asset_status !== testStatusEnum.DISCARDED.value && (
                <InspectionPanel
                    formValues={formValues}
                    selectedAsset={selectedAsset}
                    handleChange={handleChange}
                    defaultNextTestDateValue={defaultNextTestDateValue}
                    disabled={!isValidAssetId(formValues?.asset_id_displayed)}
                    isMobileView={isMobileView}
                />
            )}
        </StandardCard>
    );
};

AssetPanel.propTypes = {
    id: PropTypes.string.isRequired,
    actions: PropTypes.any.isRequired,
    formValues: PropTypes.object.isRequired,
    selectedAsset: PropTypes.object,
    resetForm: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    assignCurrentAsset: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    defaultNextTestDateValue: PropTypes.string.isRequired,
    saveAssetTypeSaving: PropTypes.bool,
    isMobileView: PropTypes.bool,
    canAddAssetType: PropTypes.bool,
    confirmationAlert: PropTypes.object,
    openConfirmationAlert: PropTypes.func,
    closeConfirmationAlert: PropTypes.func,
};

export default React.memo(AssetPanel);

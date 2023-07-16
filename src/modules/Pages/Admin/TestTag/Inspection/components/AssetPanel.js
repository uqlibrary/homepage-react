import React, { useReducer } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import InspectionPanel from './InspectionPanel';
import LastInspectionPanel from './LastInspectionPanel';
import AssetSelector from '../../SharedComponents/AssetSelector/AssetSelector';
import UpdateDialog from '../../SharedComponents/DataTable/UpdateDialog';
import AssetTypeSelector from '../../SharedComponents/AssetTypeSelector/AssetTypeSelector';

import { isValidAssetId, isValidAssetTypeId, statusEnum } from '../utils/helpers';
import { transformAddAssetTypeRequest } from '../utils/transformers';
import configAssetPanel from '../../manage/AssetTypes/components/config';
import locale from '../../testTag.locale';

const componentId = 'asset-panel';
const componentIdLower = 'asset_panel';

const testStatusEnum = statusEnum(locale.pages.inspect.config);

const emptyActionState = { isAdd: false, rows: {}, row: {}, title: '' };

const actionReducer = (_, action) => {
    switch (action.type) {
        case 'add':
            return {
                title: action.title,
                isAdd: true,
                row: { asset_type_id: 'auto' },
            };
        case 'clear':
            return { ...emptyActionState };
        default:
            throw `Unknown action '${action.type}'`;
    }
};

const AssetPanel = ({
    actions,
    formValues,
    selectedAsset,
    resetForm,
    location,
    assignCurrentAsset,
    handleChange,
    focusElementRef,
    defaultNextTestDateValue,
    classes,
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

    const handleAddClick = () => {
        actionDispatch({
            type: 'add',
            title: pageLocale.assetType.addDialog?.confirmationTitle,
        });
    };

    // we group them all together to place a footer item at the bottom of the list
    const renderGroup = params => {
        const addButton = (
            <li
                key={`${componentIdLower}-asset-type-option-999999`}
                id={`${componentIdLower}-asset-type-option-999999`}
                data-testid={`${componentIdLower}-asset-type-option-999999`}
                data-option-index="0"
                role="option"
                aria-selected="false"
                className="MuiAutocomplete-option"
                data-focus="true"
            >
                <Button className={classes.addNewLabel} onClick={() => handleAddClick()}>
                    {pageLocale.assetType.addNewLabel}
                </Button>
            </li>
        );
        const children = [params.children];
        !!canAddAssetType && children.push(addButton);
        return children;
    };

    const closeDialog = () => actionDispatch({ type: 'clear' });

    const onRowAdd = data => {
        setDialogueBusy(true);
        const request = structuredClone(data);
        const wrappedRequest = transformAddAssetTypeRequest(request);
        console.log('add', wrappedRequest);

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
                        console.log(error);
                        openConfirmationAlert(locale.config.alerts.error(error.message), 'error');
                    });
            })
            .catch(error => {
                console.log(error);
                openConfirmationAlert(locale.config.alerts.error(error.message), 'error');
            })
            .finally(() => {
                setDialogueBusy(false);
            });
    };

    const handleAssetTypeChange = assetType => {
        handleChange('asset_type_id')(assetType.asset_type_id);
    };

    return (
        <StandardCard standardCardId={componentIdLower} title={pageLocale.title} style={{ marginTop: '30px' }}>
            {console.log(formValues)}
            <UpdateDialog
                title={actionState.title}
                action="add"
                id={componentId}
                isOpen={actionState.isAdd}
                locale={locale.pages.manage.assetTypes.dialogAdd}
                fields={configAssetPanel.fields ?? []}
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
                        classNames={{ formControl: classes.formControl }}
                        inputRef={focusElementRef}
                        onChange={assignCurrentAsset}
                        onReset={resetForm}
                        validateAssetId={isValidAssetId}
                        selectedAsset={formValues?.asset_id_displayed}
                    />
                </Grid>
                <Grid xs={12} item sm={6}>
                    <FormControl className={classes.formControl} fullWidth>
                        <AssetTypeSelector
                            id={componentId}
                            locale={pageLocale.assetType.props}
                            actions={actions}
                            value={formValues?.asset_type_id}
                            onChange={handleAssetTypeChange}
                            validateAssetTypeId={isValidAssetTypeId}
                            disabled={
                                inspectionConfigLoading ||
                                saveAssetTypeSaving ||
                                !isValidAssetId(formValues?.asset_id_displayed)
                            }
                            renderGroup={renderGroup}
                            groupBy={() => false}
                            autoSelect={false}
                        />
                    </FormControl>
                </Grid>
            </Grid>
            <LastInspectionPanel
                asset={selectedAsset ?? {}}
                currentLocation={location}
                dateFormatPattern={locale.config.format.dateFormatDisplay}
                disabled={!!!selectedAsset?.last_inspection?.inspect_status ?? /* istanbul ignore next */ true}
                forceOpen={selectedAsset?.asset_status === testStatusEnum.DISCARDED.value}
            />
            {selectedAsset?.asset_status !== testStatusEnum.DISCARDED.value && (
                <InspectionPanel
                    formValues={formValues}
                    selectedAsset={selectedAsset}
                    handleChange={handleChange}
                    defaultNextTestDateValue={defaultNextTestDateValue}
                    classes={classes}
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
    focusElementRef: PropTypes.any.isRequired,
    defaultNextTestDateValue: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    saveAssetTypeSaving: PropTypes.bool,
    isMobileView: PropTypes.bool,
    canAddAssetType: PropTypes.bool,
    confirmationAlert: PropTypes.object,
    openConfirmationAlert: PropTypes.func,
    closeConfirmationAlert: PropTypes.func,
};

export default React.memo(AssetPanel);

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import DataTable from './../../../SharedComponents/DataTable/DataTable';
import { useDataTableRow, useDataTableColumns } from '../../../SharedComponents/DataTable/DataTableHooks';
import { useLocation, useSelectLocation } from '../../../SharedComponents/LocationPicker/LocationPickerHooks';
import AutoLocationPicker from '../../../SharedComponents/LocationPicker/AutoLocationPicker';
import AssetTypeSelector from '../../../SharedComponents/AssetTypeSelector/AssetTypeSelector';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';

import { isValidAssetTypeId } from '../../../Inspection/utils/helpers';
import { transformFilterRow } from './utils';
import { useConfirmationAlert } from '../../../helpers/hooks';

const rootId = 'filter-dialog';
const rootIdLower = 'filter_dialog';

const useStyles = makeStyles(() => ({
    dialogPaper: {
        minHeight: '30vh',
        maxWidth: '100%',
    },
    gridRoot: {
        border: 0,
    },
}));

const FilterDialog = ({
    id,
    actions,
    isOpen = false,
    isBusy = false,
    confirmAlertTimeout = 6000,
    locale,
    locationLocale,
    assetTypeLocale,
    config,
    errorMessageFormatter,
    onCancel,
    onAction,
}) => {
    const componentId = `${rootIdLower}-${id}`;
    const classes = useStyles();
    const { row, setRow } = useDataTableRow([], transformFilterRow);
    const [assetTypeId, setAssetTypeId] = useState('');
    const [selectedAssets, setSelectedAssets] = useState([]);
    const { assetsMineList, assetsMineListLoading, assetsMineListError } = useSelector(state =>
        state.get('testTagAssetsReducer'),
    );
    const locationStore = useSelector(state => state.get('testTagLocationReducer'));

    const onCloseConfirmationAlert = () => actions.clearAssetsMineError();
    const { confirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: confirmAlertTimeout,
        onClose: onCloseConfirmationAlert,
        errorMessage: assetsMineListError,
        errorMessageFormatter,
    });

    const { location, setLocation } = useLocation();
    const { lastSelectedLocation } = useSelectLocation({
        location,
        setLocation,
        actions,
        store: locationStore,
        condition: () => isOpen,
    });
    const { columns } = useDataTableColumns({
        config,
        locale: locale.form.columns,
        withActions: false,
    });
    useEffect(() => {
        if (!assetsMineListLoading) {
            console.log('effect setrow', assetsMineList, assetsMineListLoading);
            setRow(assetsMineList);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetsMineList, assetsMineListLoading]);

    useEffect(() => {
        // locationId, locationType, assetTypeId
        if (isOpen && !isBusy) {
            actions.loadAssetsMine({
                ...((lastSelectedLocation === 'floor' && location.floor !== -1) ||
                (lastSelectedLocation === 'room' && location.room !== -1)
                    ? {
                          locationType: lastSelectedLocation,
                          locationId: lastSelectedLocation === 'room' ? location.room : location.floor,
                      }
                    : {}),
                ...(!!assetTypeId ? { assetTypeId } : {}),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastSelectedLocation, location.floor, location.room, assetTypeId, isOpen, isBusy]);

    // useEffect(() => {
    //     console.log(location, lastSelectedLocation);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [location]);

    const handleCancelAction = () => {
        console.log('cancel');
        onCancel?.();
    };
    const handleAddAction = () => {
        console.log('add');
        onAction?.(selectedAssets);
    };
    const handleAssetTypeChange = row => {
        console.log('handleAssetTypeChange', row);
        setAssetTypeId(row?.asset_type_id ?? '');
    };
    const handleAssetSelectionChange = selectedRowIds => {
        const assets = row.filter(aRow => selectedRowIds.includes(aRow.asset_barcode));

        console.log('handleAssetSelectionChange', row, selectedRowIds, assets);
        setSelectedAssets(assets);
    };

    return (
        <>
            <Dialog
                classes={{ paper: classes.dialogPaper }}
                style={{ padding: 6 }}
                open={isOpen}
                id={`${componentId}`}
                data-testid={`${componentId}`}
                fullWidth
                aria-describedby="messageTitle"
            >
                <DialogTitle id={`${componentId}-title`} data-testid={`${componentId}-title`}>
                    {locale?.title}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        <AutoLocationPicker
                            id={rootId}
                            actions={actions}
                            location={location}
                            setLocation={setLocation}
                            locale={locationLocale}
                            hasAllOption
                        />
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4} padding={3} style={{ flex: 1 }}>
                            <AssetTypeSelector
                                id={rootId}
                                locale={assetTypeLocale}
                                actions={actions}
                                onChange={handleAssetTypeChange}
                                validateAssetTypeId={isValidAssetTypeId}
                                required={false}
                                autoSelect={false}
                                autoHighlight={false}
                                selectOnFocus
                                disableClearable={false}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item padding={3} style={{ flex: 1 }}>
                            <DataTable
                                id={rootId}
                                rows={row}
                                columns={columns}
                                rowId={'asset_id_displayed'}
                                loading={assetsMineListLoading}
                                classes={{ root: classes.gridRoot }}
                                checkboxSelection
                                disableRowSelectionOnClick
                                onSelectionModelChange={handleAssetSelectionChange}
                                autoHeight={false}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={4} className={classes.actionButtons}>
                        <Grid item xs={12} sm={6} container justifyContent="flex-start">
                            <Button
                                variant="outlined"
                                onClick={handleCancelAction}
                                id={`${componentId}-cancel-button`}
                                data-testid={`${componentId}-cancel-button`}
                                color={'default'}
                            >
                                {locale.button.cancel}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} container justifyContent="flex-end">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddAction}
                                id={`${componentId}-action-button`}
                                data-testid={`${componentId}-action-button`}
                                disabled={row.length === 0}
                            >
                                {locale.button.submit}
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>

            <ConfirmationAlert
                isOpen={confirmationAlert.visible}
                message={confirmationAlert.message}
                type={confirmationAlert.type}
                autoHideDuration={confirmationAlert.autoHideDuration}
                closeAlert={closeConfirmationAlert}
            />
        </>
    );
};

FilterDialog.propTypes = {
    id: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    locale: PropTypes.object.isRequired,
    locationLocale: PropTypes.object.isRequired,
    confirmAlertTimeout: PropTypes.number,
    dialogueContent: PropTypes.any,
    isOpen: PropTypes.bool,
    assetTypeLocale: PropTypes.object,
    errorMessageFormatter: PropTypes.func,
    onCancel: PropTypes.func,
    onAction: PropTypes.func,
    isBusy: PropTypes.bool,
};

export default React.memo(FilterDialog);

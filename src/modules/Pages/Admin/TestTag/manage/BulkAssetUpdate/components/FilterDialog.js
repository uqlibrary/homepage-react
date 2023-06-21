import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { isValidAssetTypeId } from '../../../Inspection/utils/helpers';
import DataTable from './../../../SharedComponents/DataTable/DataTable';
import { useDataTableRow, useDataTableColumns } from '../../../SharedComponents/DataTable/DataTableHooks';
import { useLocation, useSelectLocation } from '../../../SharedComponents/LocationPicker/LocationPickerHooks';
import AutoLocationPicker from '../../../SharedComponents/LocationPicker/AutoLocationPicker';
import AssetTypeSelector from '../../../SharedComponents/AssetTypeSelector/AssetTypeSelector';
import FooterBar from '../../../SharedComponents/DataTable/FooterBar';

// eslint-disable-next-line no-unused-vars
export const useStyles = makeStyles(theme => ({
    dialogPaper: {
        minHeight: '30vh',
        maxWidth: '100%',
    },
    gridRoot: {
        border: 0,
    },
}));

export const transformRow = row => {
    return row.map(line => {
        if (!!line?.asset_id_displayed) return line;
        return {
            ...line,
            asset_id_displayed: line?.asset_barcode ?? '',
            asset_location: line?.asset_room_id_last_seen ?? '',
        };
    });
};

const FilterDialog = ({
    id,
    actions,
    isOpen = false,
    isBusy = false,
    locationLocale,
    assetTypeLocale,
    locale,
    config,
    onCancel,
    onAction,
}) => {
    const classes = useStyles();
    const { row, setRow } = useDataTableRow([], transformRow);
    const [assetTypeId, setAssetTypeId] = useState('');
    const [selectedAssets, setSelectedAssets] = useState([]);
    const { assetsMineList, assetsMineListLoading } = useSelector(state => state.get('testTagAssetsReducer'));
    const locationStore = useSelector(state => state.get('testTagLocationReducer'));
    const { location, setLocation } = useLocation();
    const { lastSelectedLocation } = useSelectLocation({
        location,
        setLocation,
        actions,
        store: locationStore,
    });
    const { columns } = useDataTableColumns({
        config,
        locale: locale.form.columns,
        withActions: false,
    });
    useEffect(() => {
        console.log('effect setrow', assetsMineList, assetsMineListLoading);
        if (!assetsMineListLoading) setRow(assetsMineList);
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
        console.log('handleAssetSelectionChange', selectedRowIds);
        const assets = row.filter(aRow => selectedRowIds.includes(aRow.asset_id));
        setSelectedAssets(assets);
    };

    return (
        <Dialog
            classes={{ paper: classes.dialogPaper }}
            style={{ padding: 6 }}
            open={isOpen}
            data-testid={`dialogbox-${id}`}
            fullWidth
            aria-describedby="messageTitle"
        >
            <DialogTitle id="messageTitle" data-testid="messageTitle">
                {locale?.title}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <AutoLocationPicker
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
                            id="bulkAssetUpdateFilterDialog"
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
                            rows={row}
                            columns={columns}
                            rowId={'asset_id'}
                            loading={assetsMineListLoading}
                            classes={{ root: classes.gridRoot }}
                            components={{ Footer: FooterBar }}
                            componentsProps={{
                                footer: {
                                    id: 'bulkAssetUpdateFilterDialog',
                                    actionLabel: locale.button.submit,
                                    altLabel: locale.button.cancel,
                                    onAltClick: handleCancelAction,
                                    onActionClick: handleAddAction,
                                },
                            }}
                            checkboxSelection
                            disableRowSelectionOnClick
                            onSelectionModelChange={handleAssetSelectionChange}
                            autoHeight={false}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

FilterDialog.propTypes = {
    actions: PropTypes.object.isRequired,
    dialogueContent: PropTypes.any,
    isOpen: PropTypes.bool,
    locale: PropTypes.object.isRequired,
    locationLocale: PropTypes.object.isRequired,
    assetTypeLocale: PropTypes.object,
    config: PropTypes.object.isRequired,
    id: PropTypes.string,
    onCancel: PropTypes.func,
    onAction: PropTypes.func,
    isBusy: PropTypes.bool,
};

export default React.memo(FilterDialog);

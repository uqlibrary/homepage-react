import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import * as actions from 'data/actions';

import { isValidAssetTypeId } from '../../../Inspection/utils/helpers';
import DataTable from './../../../SharedComponents/DataTable/DataTable';
import { useDataTableRow, useDataTableColumns } from '../../../SharedComponents/DataTable/DataTableHooks';
import { useLocation, useSelectLocation } from '../../../SharedComponents/LocationPicker/LocationPickerHooks';
import AutoLocationPicker from '../../../SharedComponents/LocationPicker/AutoLocationPicker';
import AssetTypeSelector from '../../../SharedComponents/AssetTypeSelector/AssetTypeSelector';
import FooterBar from '../../../SharedComponents/DataTable/FooterBar';

export const useStyles = makeStyles(theme => ({
    dialogPaper: {
        minHeight: '30vh',
        maxHeight: '50vh',
    },
    gridRoot: {
        border: 0,
    },
}));

export const transformRow = row => {
    return row.map(line => {
        if (!!line?.asset_location) return line;
        return {
            ...line,
            asset_id_displayed: line?.asset_barcode ?? '',
            asset_location: line?.asset_room_id_last_seen ?? '',
        };
    });
};

const FilterDialog = ({ id, isOpen = false, isBusy = false, locationLocale, locale, config, onCancel, onAction }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { row, setRow } = useDataTableRow([], transformRow);
    const [assetTypeId, setAssetTypeId] = useState('');
    const [selectedAssets, setSelectedAssets] = useState([]);
    const { assetsMineList, assetsMineListLoading } = useSelector(state => state.get('testTagAssetsReducer'));
    const locationStore = useSelector(state => state.get('testTagLocationReducer'));
    const { location, setLocation } = useLocation();
    const { selectedLocation } = useSelectLocation({
        location,
        setLocation,
        actions,
        store: locationStore,
    });
    const { columns } = useDataTableColumns({
        config,
        locale: locale.form.columns,
    });
    useEffect(() => {
        console.log('effect setrow', assetsMineList, assetsMineListLoading);
        if (!assetsMineListLoading) setRow(assetsMineList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetsMineList, assetsMineListLoading]);

    useEffect(() => {
        // locationId, locationType, assetTypeId
        if (isOpen && !isBusy) {
            dispatch(
                actions.loadAssetsMine({
                    ...(selectedLocation === 'floor' || selectedLocation === 'room'
                        ? {
                              locationType: selectedLocation,
                              locationId: selectedLocation === 'room' ? location.room : location.floor,
                          }
                        : {}),
                    ...(!!assetTypeId ? { assetTypeId } : {}),
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLocation, location.floor, location.room, assetTypeId, isOpen, isBusy]);

    useEffect(() => {
        console.log(location, selectedLocation);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const handleCancelAction = () => {
        console.log('cancel');
        onCancel?.();
    };
    const handleAddAction = () => {
        console.log('add');
        onAction?.(selectedAssets);
    };
    const handleAssetTypeChange = id => {
        console.log('handleAssetTypeChange', id);
        setAssetTypeId(id);
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
        >
            <DialogTitle data-testid="message-title">{locale?.title}</DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <AutoLocationPicker
                        actions={actions}
                        location={location}
                        setLocation={setLocation}
                        locale={locationLocale}
                    />
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} padding={3} style={{ flex: 1 }}>
                        <AssetTypeSelector
                            id="bulkAssetUpdateFilterDialog"
                            locale={locale.form.assetType}
                            actions={actions}
                            onChange={handleAssetTypeChange}
                            validateAssetTypeId={isValidAssetTypeId}
                            required={false}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item padding={3} style={{ flex: 1 }}>
                        <DataTable
                            rows={row}
                            columns={columns}
                            rowId={'asset_id'}
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
                        />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

FilterDialog.propTypes = {
    dialogueContent: PropTypes.any,
    isOpen: PropTypes.bool,
    locale: PropTypes.object.isRequired,
    locationLocale: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    id: PropTypes.string,
    onCancel: PropTypes.func,
    onAction: PropTypes.func,
    isBusy: PropTypes.bool,
};

export default React.memo(FilterDialog);

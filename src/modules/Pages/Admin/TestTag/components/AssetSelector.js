import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { isValidAssetId } from '../utils/helpers';

const filter = createFilterOptions();

const AssetSelector = ({ assetBarcode, assetsListLoading, assetList, assignCurrentAsset, assetsSearch, locale }) => {
    AssetSelector.propTypes = {
        assetBarcode: PropTypes.string,
        assetsListLoading: PropTypes.bool,
        assetList: PropTypes.array,
        assignCurrentAsset: PropTypes.func.isRequired,
        assetsSearch: PropTypes.func.isRequired,
        locale: PropTypes.object.isRequired,
    };

    const onChangeHandler = React.useCallback(
        (event, newValue) => {
            if (typeof newValue === 'string') {
                assignCurrentAsset({ asset_id_displayed: newValue, isNew: true });
            } else if (newValue && newValue.inputValue) {
                // Create a new value from the user input
                assignCurrentAsset({
                    asset_id_displayed: newValue.inputValue,
                    isNew: true,
                });
            } else {
                assignCurrentAsset(newValue);
            }
        },
        [assignCurrentAsset],
    );

    const filterOptionsHandler = React.useCallback((options, params) => {
        const filtered = filter(options, params);
        // Suggest the creation of a new value
        if (params.inputValue !== '') {
            filtered.push({
                inputValue: params.inputValue,
                asset_id_displayed: locale.form.asset.addText(params.inputValue),
            });
        }

        return filtered;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const optionLabelHandler = React.useCallback(option => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
            return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
            return option.inputValue;
        }
        // Regular option
        return `${option.asset_id_displayed ?? ''}`;
    }, []);

    const renderOptionHandler = React.useCallback(option => option.asset_id_displayed, []);

    const assetSearchHandler = React.useCallback(e => assetsSearch(e.target.value), []);

    const renderInputHandler = React.useCallback(
        params => (
            <TextField
                {...params}
                {...locale.form.asset.assetId}
                required
                error={!isValidAssetId(assetBarcode)}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <React.Fragment>
                            {!!assetsListLoading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                        </React.Fragment>
                    ),
                }}
                onChange={assetSearchHandler}
            />
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [assetBarcode, assetsListLoading],
    );

    return (
        <Autocomplete
            fullWidth
            value={assetBarcode ?? null}
            onChange={onChangeHandler}
            filterOptions={filterOptionsHandler}
            selectOnFocus
            handleHomeEndKeys
            options={assetList}
            getOptionLabel={optionLabelHandler}
            renderOption={renderOptionHandler}
            freeSolo
            renderInput={renderInputHandler}
            loading={!!assetsListLoading}
        />
    );
};

export default React.memo(AssetSelector);

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import ZebraBrowserPrintWrapper from 'zebra-browser-print-wrapper';

import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';

import { isEmptyObject } from '../../helpers/helpers';

const rootId = 'label_printer_selector';

const enumerateAvailablePrinters = async wrapper => {
    const printers = await wrapper.getAvailablePrinters();
    return printers;
};

const LabelPrinterSelector = async ({ id, classNames }) => {
    const componentId = `${rootId}-${id}`;
    const wrapper = useMemo(() => new ZebraBrowserPrintWrapper(), []);

    return (
        <FormControl variant="standard" className={classNames?.formControl} fullWidth>
            <Autocomplete
                id={`${componentId}`}
                data-testid={`${componentId}`}
                className={classNames?.autocomplete}
                fullWidth
                options={_assetTypeList ?? /* istanbul ignore next */ []}
                value={_assetTypeList?.find(assetType => assetType.asset_type_id === _value) ?? null}
                onChange={handleChange}
                getOptionLabel={option => option.asset_type_name ?? /* istanbul ignore next */ null}
                isOptionEqualToValue={(option, value) => option.asset_type_id === value.asset_type_id}
                autoHighlight
                renderInput={params => (
                    <TextField
                        {...params}
                        {...locale.props}
                        required={required}
                        error={
                            (!disabled && required && !validateAssetTypeId?.(value)) ?? /* istanbul ignore next */ false
                        }
                        variant="standard"
                        InputLabelProps={{ shrink: true, htmlFor: `${componentId}-input` }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {assetTypesListLoading ? (
                                        <CircularProgress
                                            color="inherit"
                                            size={20}
                                            id={`${componentId}-progress`}
                                            data-testid={`${componentId}-progress`}
                                        />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                        inputProps={{
                            ...params.inputProps,
                            id: `${componentId}-input`,
                            'data-testid': `${componentId}-input`,
                        }}
                    />
                )}
                filterOptions={(options, params) => {
                    const filtered = filterOptions(options, params);
                    canAddNew &&
                        filtered.push({
                            asset_type_name: locale.addNewLabel.toUpperCase(),
                            asset_type_id: ADD_NEW_ID,
                        });

                    return filtered;
                }}
                PopperComponent={customPopper}
                disabled={disabled || assetTypesListLoading}
                disableClearable
                autoSelect
                loading={!!assetTypesListLoading}
                {...rest}
            />
        </FormControl>
    );
};
LabelPrinterSelector.propTypes = {
    id: PropTypes.string.isRequired,
    locale: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    required: PropTypes.bool,
    canAddNew: PropTypes.bool,
    hasAllOption: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
    classNames: PropTypes.shape({ formControl: PropTypes.string, autocomplete: PropTypes.string }),
    validateAssetTypeId: PropTypes.func,
};

export default LabelPrinterSelector;

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import { Grid } from '@mui/material';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Collapse from '@mui/material/Collapse';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';

import ActionPanel from './ActionPanel';
import MonthsSelector from '../../SharedComponents/MonthsSelector/MonthsSelector';
import locale from '../../testTag.locale';
import {
    isValidTestingDeviceId,
    isValidTestingDeviceForPassInspection,
    isValidFailReason,
    statusEnum,
} from '../utils/helpers';

const rootId = 'inspection-panel';
const rootIdLower = 'inspection_panel';

const testStatusEnum = statusEnum(locale.pages.inspect.config);
const moment = require('moment');

const StyledCollapse = styled(Collapse)(({ theme }) => ({
    '& .toggleButtonRoot': {
        color: 'rgba(0, 0, 0, 0.87)',
        '& :disabled': {
            color: `${theme.palette.text.main} !important`,
        },
    },
    '& .toggleButtonSuccess': {
        color: `${theme.palette.primary.contrastText} !important`,
        backgroundColor: `${theme.palette.success.main} !important`,
    },
    '& .toggleButtonFailed': {
        color: `${theme.palette.primary.contrastText} !important`,
        backgroundColor: `${theme.palette.error.main} !important`,
    },
}));

const InspectionPanel = ({
    id,
    formValues,
    selectedAsset,
    handleChange,
    defaultNextTestDateValue,
    disabled,
    isMobileView,
}) => {
    const componentId = `${!!id ? `${id}-` : ''}${rootId}`;
    const componentIdLower = `${!!id ? `${id}-` : ''}${rootIdLower}`;

    const pageLocale = locale.pages.inspect;
    const monthsOptions = locale.config.monthsOptions;

    const { user } = useSelector(state => state.get('testTagUserReducer'));

    const { inspectionConfig, inspectionConfigLoading } = useSelector(state =>
        state.get?.('testTagOnLoadInspectionReducer'),
    );

    const [formNextTestDate, setFormNextTestDate] = useState(defaultNextTestDateValue);
    useEffect(() => {
        /* istanbul ignore else */ if (formValues.inspection_status === testStatusEnum.PASSED.value) {
            handleChange('inspection_date_next')(
                moment(formValues.action_date, pageLocale.config.dateFormat).add(formNextTestDate, 'months'),
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues.inspection_status, formNextTestDate]);

    const onNextDateChange = value => {
        setFormNextTestDate(value);
    };

    const handleFailReasonChange = e => handleChange('inspection_fail_reason')(e);
    const handleInspectionNotesChange = e => handleChange('inspection_notes')(e);

    const invalidTestingDevice = !isValidTestingDeviceId(
        formValues.inspection_device_id,
        user?.department_visual_inspection_device_id,
        formValues.inspection_status,
        testStatusEnum,
    );

    const invalidTestingDeviceForPassStatus = !isValidTestingDeviceForPassInspection(
        formValues.inspection_device_id,
        user?.department_visual_inspection_device_id,
        formValues.inspection_status,
        testStatusEnum,
    );

    return (
        <StandardCard
            standardCardId={componentIdLower}
            title={`${pageLocale.form.inspection.title}`}
            style={{ marginBottom: 30 }}
            smallTitle
            variant="outlined"
            noPadding={selectedAsset?.asset_status === testStatusEnum.DISCARDED.value}
        >
            <StyledCollapse in={selectedAsset?.asset_status !== testStatusEnum.DISCARDED.value} timeout="auto">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl
                            variant="standard"
                            className={'formControl'}
                            fullWidth
                            error={invalidTestingDevice}
                        >
                            <InputLabel required htmlFor={`${componentIdLower}-inspection-device-input`}>
                                {pageLocale.form.inspection.deviceLabel}
                            </InputLabel>
                            <Select
                                variant="standard"
                                id={`${componentIdLower}-inspection-device`}
                                data-testid={`${componentIdLower}-inspection-device`}
                                MenuProps={{
                                    id: `${componentIdLower}-inspection-device-options`,
                                    'data-testid': `${componentIdLower}-inspection-device-options`,
                                }}
                                inputProps={{
                                    id: `${componentIdLower}-inspection-device-input`,
                                    'aria-label': pageLocale.form.inspection.deviceLabel,
                                    ['data-testid']: `${componentIdLower}-inspection-device-input`,
                                }}
                                SelectDisplayProps={{
                                    id: `${componentIdLower}-inspection-device-select`,
                                    'data-testid': `${componentIdLower}-inspection-device-select`,
                                }}
                                fullWidth
                                className={'formSelect'}
                                value={formValues.inspection_device_id ?? ''}
                                onChange={e => {
                                    handleChange('inspection_device_id')(e.target.value);
                                }}
                                required
                                error={invalidTestingDevice}
                                disabled={disabled}
                            >
                                {!!inspectionConfigLoading && (
                                    <MenuItem value={-1} disabled key={'devicetypes-loading'}>
                                        {pageLocale.form.loading}
                                    </MenuItem>
                                )}
                                {!!!inspectionConfigLoading &&
                                    !!inspectionConfig &&
                                    !!inspectionConfig?.inspection_devices &&
                                    inspectionConfig?.inspection_devices?.length > 0 &&
                                    inspectionConfig.inspection_devices.map((device, index) => (
                                        <MenuItem
                                            value={device.device_id}
                                            key={device.device_id}
                                            id={`${componentIdLower}-inspection-device-option-${index}`}
                                            data-testid={`${componentIdLower}-inspection-device-option-${index}`}
                                        >
                                            {device.device_model_name}
                                        </MenuItem>
                                    ))}
                            </Select>
                            {invalidTestingDeviceForPassStatus && (
                                <FormHelperText
                                    id={`${componentIdLower}-inspection-device-validation-text`}
                                    data-testid={`${componentIdLower}-inspection-device-validation-text`}
                                >
                                    {pageLocale.form.inspection.deviceInvalidForPass(
                                        inspectionConfig.inspection_devices.find(
                                            device => device.device_id === user?.department_visual_inspection_device_id,
                                        )?.device_model_name,
                                    )}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Box>
                            <InputLabel
                                shrink
                                required
                                htmlFor={`${componentIdLower}-inspection-result-toggle-buttons`}
                            >
                                {pageLocale.form.inspection.testResultLabel}
                            </InputLabel>
                            <ToggleButtonGroup
                                value={formValues.inspection_status ?? testStatusEnum.NONE.value}
                                exclusive
                                id={`${componentIdLower}-inspection-result-toggle-buttons`}
                                data-testid={`${componentIdLower}-inspection-result-toggle-buttons`}
                                size={isMobileView ? 'large' : 'small'}
                                defaultChecked={false}
                                onChange={(/* istanbul ignore next*/ _, child) => {
                                    handleChange('inspection_status')(child ?? /* istanbul ignore next*/ undefined);
                                }}
                                sx={{ display: 'flex' }}
                            >
                                <ToggleButton
                                    id={`${componentIdLower}-inspection-result-${testStatusEnum.PASSED.value.toLowerCase()}-button`}
                                    data-testid={`${componentIdLower}-inspection-result-${testStatusEnum.PASSED.value.toLowerCase()}-button`}
                                    value={testStatusEnum.PASSED.value}
                                    aria-label={testStatusEnum.PASSED.label}
                                    classes={{
                                        root: 'toggleButtonRoot',
                                        selected: 'toggleButtonSuccess',
                                        sizeLarge: 'toggleButtonMobile',
                                    }}
                                    disabled={disabled}
                                >
                                    <DoneIcon /> {testStatusEnum.PASSED.label}
                                </ToggleButton>
                                <ToggleButton
                                    id={`${componentIdLower}-inspection-result-${testStatusEnum.FAILED.value.toLowerCase()}-button`}
                                    data-testid={`${componentIdLower}-inspection-result-${testStatusEnum.FAILED.value.toLowerCase()}-button`}
                                    value={testStatusEnum.FAILED.value}
                                    aria-label={testStatusEnum.FAILED.label}
                                    classes={{
                                        root: 'toggleButtonRoot',
                                        selected: 'toggleButtonFailed',
                                        sizeLarge: 'toggleButtonMobile',
                                    }}
                                    disabled={disabled}
                                >
                                    <ClearIcon /> {testStatusEnum.FAILED.label}
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Grid>
                    {formValues.inspection_status === testStatusEnum.PASSED.value && (
                        <Grid item xs={12} sm={4}>
                            <MonthsSelector
                                id={componentId}
                                label={pageLocale.form.inspection.nextTestDateLabel}
                                options={monthsOptions}
                                currentValue={formNextTestDate}
                                onChange={onNextDateChange}
                                required
                                responsive
                                disabled={disabled}
                                nextDateTextFormatter={pageLocale.form.inspection.nextTestDateFormatted}
                                fromDate={formValues.action_date}
                                fromDateFormat={pageLocale.config.dateFormat}
                                dateDisplayFormat={pageLocale.config.dateFormatDisplay}
                                classNames={{ formControl: 'formControl', select: 'formSelect' }}
                            />
                        </Grid>
                    )}
                    {formValues.inspection_status === testStatusEnum.FAILED.value && (
                        <Grid item xs={12} sm={12}>
                            <FormControl variant="standard" className={'formControl'} fullWidth>
                                <TextField
                                    {...pageLocale.form.inspection.failReason}
                                    multiline
                                    minRows={4}
                                    variant="standard"
                                    required
                                    disabled={disabled}
                                    error={!isValidFailReason(formValues, testStatusEnum.FAILED.value)}
                                    value={formValues?.inspection_fail_reason ?? ''}
                                    onChange={handleFailReasonChange}
                                    id={`${componentIdLower}-fail-reason`}
                                    InputProps={{ fullWidth: true }}
                                    InputLabelProps={{ htmlFor: `${componentIdLower}-fail-reason` }}
                                    inputProps={{
                                        'data-testid': `${componentIdLower}-fail-reason-input`,
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    )}

                    <Grid item xs={12} sm={12}>
                        <FormControl variant="standard" className={'formControl'} fullWidth>
                            <TextField
                                {...pageLocale.form.inspection.inspectionNotes}
                                multiline
                                minRows={4}
                                variant="standard"
                                disabled={disabled}
                                value={formValues?.inspection_notes ?? ''}
                                onChange={handleInspectionNotesChange}
                                id={`${componentIdLower}-inspection-notes`}
                                InputProps={{ fullWidth: true }}
                                InputLabelProps={{ htmlFor: `${componentIdLower}-inspection-notes` }}
                                inputProps={{
                                    'data-testid': `${componentIdLower}-inspection-notes-input`,
                                }}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <ActionPanel
                    formValues={formValues}
                    selectedAsset={selectedAsset}
                    handleChange={handleChange}
                    isMobileView={isMobileView}
                    disabled={disabled}
                />
            </StyledCollapse>
        </StandardCard>
    );
};

InspectionPanel.propTypes = {
    id: PropTypes.string,
    formValues: PropTypes.object.isRequired,
    selectedAsset: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
    defaultNextTestDateValue: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    isMobileView: PropTypes.bool.isRequired,
};

export default React.memo(InspectionPanel);

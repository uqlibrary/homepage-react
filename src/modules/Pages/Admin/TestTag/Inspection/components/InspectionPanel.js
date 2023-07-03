import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Grid } from '@material-ui/core';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Collapse from '@material-ui/core/Collapse';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import Box from '@material-ui/core/Box';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles } from '@material-ui/core/styles';

import ActionPanel from './ActionPanel';
import DebouncedTextField from '../../SharedComponents/DebouncedTextField/DebouncedTextField';
import MonthsSelector from '../../SharedComponents/MonthsSelector/MonthsSelector';
import locale from '../../testTag.locale';
import { isValidTestingDeviceId, isValidFailReason, statusEnum } from '../utils/helpers';

const testStatusEnum = statusEnum(locale.pages.inspect.config);
const moment = require('moment');

const useStyles = makeStyles(theme => ({
    toggleButtonRoot: {
        color: `${theme.palette.text.main} !important`,
        backgroundColor: `${theme.palette.grey[300]} !important`,
    },
    toggleButtonSuccess: {
        color: `${theme.palette.primary.contrastText} !important`,
        backgroundColor: `${theme.palette.success.main} !important`,
    },
    toggleButtonFailed: {
        color: `${theme.palette.primary.contrastText} !important`,
        backgroundColor: `${theme.palette.error.main} !important`,
    },
}));

const InspectionPanel = ({
    formValues,
    selectedAsset,
    handleChange,
    defaultNextTestDateValue,
    classes,
    disabled,
    isMobileView,
}) => {
    InspectionPanel.propTypes = {
        formValues: PropTypes.object.isRequired,
        selectedAsset: PropTypes.object,
        handleChange: PropTypes.func.isRequired,
        defaultNextTestDateValue: PropTypes.string.isRequired,
        classes: PropTypes.any.isRequired,
        disabled: PropTypes.bool.isRequired,
        isMobileView: PropTypes.bool.isRequired,
    };
    const pageLocale = locale.pages.inspect;
    const monthsOptions = locale.config.monthsOptions;
    const classesInternal = useStyles();

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

    return (
        <StandardCard
            title={`${pageLocale.form.inspection.title}`}
            style={{ marginBottom: 30 }}
            smallTitle
            variant="outlined"
            noPadding={selectedAsset?.asset_status === testStatusEnum.DISCARDED.value}
        >
            <Collapse
                in={selectedAsset?.asset_status !== testStatusEnum.DISCARDED.value}
                timeout="auto"
                data-testid="collapseActionPanel"
            >
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel required htmlFor="testResultTestingDevice">
                                {pageLocale.form.inspection.deviceLabel}
                            </InputLabel>
                            <Select
                                fullWidth
                                className={classes.formSelect}
                                id="testResultTestingDevice"
                                data-testid="testResultTestingDevice"
                                value={formValues.inspection_device_id ?? ''}
                                onChange={e => handleChange('inspection_device_id')(e.target.value)}
                                required
                                error={
                                    !isValidTestingDeviceId(
                                        formValues.inspection_device_id,
                                        formValues.inspection_status,
                                        testStatusEnum,
                                    )
                                }
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
                                    inspectionConfig.inspection_devices.map(device => (
                                        <MenuItem value={device.device_id} key={device.device_id}>
                                            {device.device_model_name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Box>
                            <InputLabel shrink required htmlFor="testResultToggleButtons">
                                {pageLocale.form.inspection.testResultLabel}
                            </InputLabel>
                            <ToggleButtonGroup
                                value={formValues.inspection_status ?? testStatusEnum.NONE.value}
                                exclusive
                                id="testResultToggleButtons"
                                data-testid="testResultToggleButtons"
                                size={isMobileView ? 'large' : 'small'}
                                defaultChecked={false}
                                onChange={(/* istanbul ignore next*/ _, child) => {
                                    handleChange('inspection_status')(child ?? /* istanbul ignore next*/ undefined);
                                }}
                                style={{ display: 'flex' }}
                            >
                                <ToggleButton
                                    id={`testResultToggleButtons-${testStatusEnum.PASSED.value}`}
                                    data-testid={`testResultToggleButtons-${testStatusEnum.PASSED.value}`}
                                    value={testStatusEnum.PASSED.value}
                                    aria-label={testStatusEnum.PASSED.label}
                                    classes={{
                                        root: classesInternal.toggleButtonRoot,
                                        selected: classesInternal.toggleButtonSuccess,
                                        sizeLarge: classes.toggleButtonMobile,
                                    }}
                                    disabled={disabled}
                                >
                                    <DoneIcon /> {testStatusEnum.PASSED.label}
                                </ToggleButton>
                                <ToggleButton
                                    id={`testResultToggleButtons-${testStatusEnum.FAILED.value}`}
                                    data-testid={`testResultToggleButtons-${testStatusEnum.FAILED.value}`}
                                    value={testStatusEnum.FAILED.value}
                                    aria-label={testStatusEnum.FAILED.label}
                                    classes={{
                                        root: classesInternal.toggleButtonRoot,
                                        selected: classesInternal.toggleButtonFailed,
                                        sizeLarge: classes.toggleButtonMobile,
                                    }}
                                    disabled={disabled}
                                >
                                    <ClearIcon /> {testStatusEnum.FAILED.label}
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Grid>
                    {formValues.inspection_status === testStatusEnum.PASSED.value && (
                        <Grid item xs={12}>
                            <MonthsSelector
                                id="testResultNextDate"
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
                                classNames={{ formControl: classes.formControl, select: classes.formSelect }}
                            />
                        </Grid>
                    )}
                    {formValues.inspection_status === testStatusEnum.FAILED.value && (
                        <Grid item xs={12} sm={12}>
                            <FormControl className={classes.formControl} fullWidth>
                                <DebouncedTextField
                                    {...pageLocale.form.inspection.failReason}
                                    multiline
                                    minRows={4}
                                    variant="standard"
                                    InputProps={{ fullWidth: true }}
                                    required
                                    disabled={disabled}
                                    error={!isValidFailReason(formValues, testStatusEnum.FAILED.value)}
                                    value={formValues?.inspection_fail_reason ?? ''}
                                    handleChange={handleChange}
                                    updateKey="inspection_fail_reason"
                                    id="inspectionFailReason"
                                    data-testid="inspectionFailReason"
                                />
                            </FormControl>
                        </Grid>
                    )}

                    <Grid item xs={12} sm={12}>
                        <FormControl className={classes.formControl} fullWidth>
                            <DebouncedTextField
                                {...pageLocale.form.inspection.inspectionNotes}
                                multiline
                                minRows={4}
                                variant="standard"
                                InputProps={{ fullWidth: true }}
                                disabled={disabled}
                                value={formValues?.inspection_notes ?? ''}
                                handleChange={handleChange}
                                updateKey="inspection_notes"
                                id="inspectionNotes"
                                data-testid="inspectionNotes"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <ActionPanel
                    formValues={formValues}
                    selectedAsset={selectedAsset}
                    handleChange={handleChange}
                    classes={classes}
                    isMobileView={isMobileView}
                    disabled={disabled}
                />
            </Collapse>
        </StandardCard>
    );
};

export default React.memo(InspectionPanel);

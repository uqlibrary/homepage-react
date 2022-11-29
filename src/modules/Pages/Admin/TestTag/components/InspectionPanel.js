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
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles } from '@material-ui/core/styles';

import ActionPanel from './ActionPanel';
import DebouncedTextField from './DebouncedTextField';
import locale from '../testTag.locale';
import { isValidTestingDeviceId, isValidFailReason, statusEnum } from '../utils/helpers';

const testStatusEnum = statusEnum(locale);
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
    currentRetestList,
    defaultNextTestDateValue,
    classes,
    disabled,
    isMobileView,
}) => {
    InspectionPanel.propTypes = {
        formValues: PropTypes.object.isRequired,
        selectedAsset: PropTypes.object,
        handleChange: PropTypes.func.isRequired,
        currentRetestList: PropTypes.array.isRequired,
        defaultNextTestDateValue: PropTypes.number.isRequired,
        classes: PropTypes.any.isRequired,
        disabled: PropTypes.bool.isRequired,
        isMobileView: PropTypes.bool.isRequired,
    };

    const classesInternal = useStyles();

    const { initConfig, initConfigLoading } = useSelector(state => state.get?.('testTagOnLoadReducer'));

    const [formNextTestDate, setFormNextTestDate] = useState(defaultNextTestDateValue);
    useEffect(() => {
        if (formValues.inspection_status === testStatusEnum.PASSED.value) {
            handleChange('inspection_date_next')(moment().add(formNextTestDate, 'months'));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues.inspection_status, formNextTestDate]);

    return (
        <StandardCard
            title={locale.form.inspection.title}
            style={{ marginTop: 30, marginBottom: 30 }}
            smallTitle
            variant="outlined"
            noPadding={selectedAsset?.asset_status === testStatusEnum.DISCARDED.value}
        >
            <Collapse in={selectedAsset?.asset_status !== testStatusEnum.DISCARDED.value} timeout="auto">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel required htmlFor="testResultTestingDevice">
                                {locale.form.inspection.deviceLabel}
                            </InputLabel>
                            <Select
                                fullWidth
                                className={classes.formSelect}
                                id="testResultTestingDevice"
                                value={formValues.inspection_device_id ?? ''}
                                onChange={e => handleChange('inspection_device_id')(e.target.value)}
                                required
                                error={!isValidTestingDeviceId(formValues.inspection_device_id)}
                                disabled={disabled}
                            >
                                {!!initConfigLoading && (
                                    <MenuItem value={-1} disabled key={'devicetypes-loading'}>
                                        {locale.form.loading}
                                    </MenuItem>
                                )}
                                {!!!initConfigLoading &&
                                    !!initConfig &&
                                    !!initConfig?.inspection_devices &&
                                    initConfig?.inspection_devices?.length > 0 &&
                                    initConfig.inspection_devices.map(device => (
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
                                {locale.form.inspection.testResultLabel}
                            </InputLabel>
                            <ToggleButtonGroup
                                value={formValues.inspection_status ?? testStatusEnum.NONE.value}
                                exclusive
                                id="testResultToggleButtons"
                                size={isMobileView ? 'large' : 'small'}
                                defaultChecked={false}
                                onChange={(_, child) => {
                                    handleChange('inspection_status')(child);
                                }}
                                style={{ display: 'flex' }}
                            >
                                <ToggleButton
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
                            <FormControl className={classes.formControl} fullWidth={isMobileView}>
                                <InputLabel shrink required>
                                    {locale.form.inspection.nextTestDateLabel}
                                </InputLabel>
                                <Select
                                    fullWidth
                                    className={classes.formSelect}
                                    value={formNextTestDate}
                                    onChange={e => setFormNextTestDate(e.target.value)}
                                    required
                                    disabled={disabled}
                                >
                                    {currentRetestList.map(retestPeriod => (
                                        <MenuItem value={retestPeriod.value} key={retestPeriod.value}>
                                            {retestPeriod.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Typography component={'span'}>
                                    {locale.form.inspection.nextTestDateFormatted(
                                        moment()
                                            .add(formNextTestDate, 'months')
                                            .format(locale.config.dateFormatDisplay),
                                    )}
                                </Typography>
                            </FormControl>
                        </Grid>
                    )}
                    {formValues.inspection_status === testStatusEnum.FAILED.value && (
                        <Grid item xs={12} sm={12}>
                            <FormControl className={classes.formControl} fullWidth>
                                <DebouncedTextField
                                    {...locale.form.inspection.failReason}
                                    multiline
                                    rows={4}
                                    variant="standard"
                                    InputProps={{ fullWidth: true }}
                                    required
                                    disabled={disabled}
                                    error={!isValidFailReason(formValues, testStatusEnum.FAILED.value)}
                                    value={formValues?.inspection_fail_reason ?? ''}
                                    handleChange={handleChange}
                                    updateKey="inspection_fail_reason"
                                />
                            </FormControl>
                        </Grid>
                    )}

                    <Grid item xs={12} sm={12}>
                        <FormControl className={classes.formControl} fullWidth>
                            <DebouncedTextField
                                {...locale.form.inspection.inspectionNotes}
                                multiline
                                rows={4}
                                variant="standard"
                                InputProps={{ fullWidth: true }}
                                disabled={disabled}
                                value={formValues?.inspection_notes ?? ''}
                                handleChange={handleChange}
                                updateKey="inspection_notes"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <ActionPanel
                    formValues={formValues}
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

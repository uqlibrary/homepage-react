import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { useTheme } from '@material-ui/core';

import { Grid } from '@material-ui/core';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Collapse from '@material-ui/core/Collapse';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Alert from '@material-ui/lab/Alert';
import TabPanel from './TabPanel';

import locale from '../testTag.locale';
const a11yProps = index => ({
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
});

import { isValidTestingDeviceId, isValidFailReason, isValidRepair, isValidDiscard, statusEnum } from '../utils/helpers';
const testStatusEnum = statusEnum(locale);

const moment = require('moment');

const InspectionPanel = ({
    formValues,
    selectedAsset,
    handleChange,
    currentRetestList,
    defaultNextTestDateValue,
    classes,
    isMobileView,
}) => {
    InspectionPanel.propTypes = {
        formValues: PropTypes.object.isRequired,
        selectedAsset: PropTypes.object,
        handleChange: PropTypes.func.isRequired,
        currentRetestList: PropTypes.object.isRequired,
        defaultNextTestDateValue: PropTypes.number.isRequired,
        classes: PropTypes.any.isRequired,
        isMobileView: PropTypes.bool.isRequired,
    };

    const theme = useTheme();
    const [selectedTabValue, setSelectedTabValue] = useState(0);

    const { initConfig, initConfigLoading } = useSelector(state => state.get?.('testTagOnLoadReducer'));

    const [formNextTestDate, setFormNextTestDate] = useState(defaultNextTestDateValue);
    useEffect(() => {
        console.log('date effect', formValues.with_inspection);
        if (formValues?.with_inspection?.inspection_status === testStatusEnum.PASSED.value) {
            handleChange('with_inspection.inspection_date_next')(moment().add(formNextTestDate, 'months'));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues?.with_inspection?.inspection_status, formNextTestDate]);

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
                                value={formValues?.with_inspection?.inspection_device_id ?? ''}
                                onChange={e => handleChange('with_inspection.inspection_device_id')(e.target.value)}
                                required
                                error={!isValidTestingDeviceId(formValues.with_inspection.inspection_device_id)}
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
                        <Box margin={1}>
                            <InputLabel shrink required htmlFor="testResultToggleButtons">
                                {locale.form.inspection.testResultLabel}
                            </InputLabel>
                            <ToggleButtonGroup
                                value={formValues?.with_inspection?.inspection_status ?? testStatusEnum.NONE.value}
                                exclusive
                                id="testResultToggleButtons"
                                size={isMobileView ? 'large' : 'small'}
                                defaultChecked={false}
                                onChange={(_, child) => {
                                    handleChange('with_inspection.inspection_status')(child);
                                }}
                                style={{ display: 'flex' }}
                            >
                                <ToggleButton
                                    value={testStatusEnum.PASSED.value}
                                    aria-label={testStatusEnum.PASSED.label}
                                    style={{
                                        backgroundColor:
                                            formValues?.with_inspection?.inspection_status ===
                                            testStatusEnum.PASSED.value
                                                ? theme.palette.success.main
                                                : theme.palette.grey[300],
                                        color:
                                            formValues?.with_inspection?.inspection_status ===
                                            testStatusEnum.PASSED.value
                                                ? theme.palette.primary.contrastText
                                                : theme.palette.text.main,
                                    }}
                                    classes={{ sizeLarge: classes.toggleButtonMobile }}
                                >
                                    <DoneIcon /> {testStatusEnum.PASSED.label}
                                </ToggleButton>
                                <ToggleButton
                                    value={testStatusEnum.FAILED.value}
                                    aria-label={testStatusEnum.FAILED.label}
                                    style={{
                                        backgroundColor:
                                            formValues?.with_inspection?.inspection_status ===
                                            testStatusEnum.FAILED.value
                                                ? theme.palette.error.main
                                                : theme.palette.grey[300],
                                        color:
                                            formValues?.with_inspection?.inspection_status ===
                                            testStatusEnum.FAILED.value
                                                ? theme.palette.primary.contrastText
                                                : theme.palette.text.main,
                                    }}
                                    classes={{ sizeLarge: classes.toggleButtonMobile }}
                                >
                                    <ClearIcon /> {testStatusEnum.FAILED.label}
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Grid>
                    {formValues?.with_inspection?.inspection_status === testStatusEnum.PASSED.value && (
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
                    {formValues?.with_inspection?.inspection_status === testStatusEnum.FAILED.value && (
                        <Grid item xs={12} sm={12}>
                            <FormControl className={classes.formControl} fullWidth>
                                <TextField
                                    {...locale.form.inspection.failReason}
                                    multiline
                                    rows={4}
                                    variant="standard"
                                    InputProps={{ fullWidth: true }}
                                    required
                                    error={!isValidFailReason(formValues.with_inspection, testStatusEnum.FAILED.value)}
                                    value={formValues?.with_inspection?.inspection_fail_reason ?? undefined}
                                    onChange={handleChange('with_inspection.inspection_fail_reason')}
                                />
                            </FormControl>
                        </Grid>
                    )}

                    <Grid item xs={12} sm={12}>
                        <FormControl className={classes.formControl} fullWidth>
                            <TextField
                                {...locale.form.inspection.inspectionNotes}
                                multiline
                                rows={4}
                                variant="standard"
                                InputProps={{ fullWidth: true }}
                                value={formValues?.with_inspection?.inspection_notes ?? undefined}
                                onChange={handleChange('with_inspection.inspection_notes')}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item sm={12}>
                        <Typography component={'h4'} variant={'h6'}>
                            {locale.form.action.title}
                        </Typography>
                    </Grid>
                </Grid>
                <Tabs
                    value={selectedTabValue}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={(e, value) => setSelectedTabValue(value)}
                    variant={isMobileView ? 'fullWidth' : 'standard'}
                >
                    {locale.form.action.tabs.map((tab, index) => (
                        <Tab
                            label={tab.label}
                            {...a11yProps(index)}
                            key={tab.value}
                            disabled={
                                (tab.value === 1 && !!formValues.with_discarded.isDiscarded) ||
                                (tab.value === 2 && !!formValues.with_repair.isRepair)
                            } // here make page mobile friendly test responses etc
                        />
                    ))}
                </Tabs>
                <TabPanel value={selectedTabValue} index={0}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl className={classes.formControl} fullWidth={isMobileView}>
                                <InputLabel shrink>{locale.form.action.repair.label}</InputLabel>
                                <Select
                                    fullWidth
                                    className={classes.formSelect}
                                    value={formValues.with_repair.isRepair ? 2 : 1}
                                    onChange={e => handleChange('with_repair.isRepair')(e.target.value === 2)}
                                    style={{ minWidth: 200 }}
                                >
                                    {locale.form.action.repair.options.map(option => (
                                        <MenuItem value={option.value} key={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl className={classes.formControl} fullWidth required>
                                <TextField
                                    {...locale.form.action.repair.repairerDetails}
                                    required
                                    error={!!formValues.with_repair.isRepair && !isValidRepair(formValues.with_repair)}
                                    multiline
                                    rows={4}
                                    variant="standard"
                                    InputProps={{ fullWidth: true }}
                                    disabled={!formValues.with_repair.isRepair}
                                    value={formValues?.with_repair?.repairer_contact_details ?? undefined}
                                    onChange={handleChange('with_repair.repairer_contact_details')}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={selectedTabValue} index={1}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Alert severity="warning">{locale.form.action.discard.alertMessage}</Alert>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl className={classes.formControl} fullWidth={isMobileView}>
                                <InputLabel shrink>{locale.form.action.discard.label}</InputLabel>
                                <Select
                                    fullWidth
                                    className={classes.formSelect}
                                    value={formValues.with_discarded.isDiscarded ? 2 : 1}
                                    onChange={e => handleChange('with_discarded.isDiscarded')(e.target.value === 2)}
                                    style={{ minWidth: 200 }}
                                >
                                    {locale.form.action.discard.options.map(option => (
                                        <MenuItem value={option.value} key={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl className={classes.formControl} fullWidth required>
                                <TextField
                                    {...locale.form.action.discard.discardReason}
                                    required
                                    error={
                                        !!formValues.with_discarded.isDiscarded &&
                                        !isValidDiscard(formValues.with_discarded)
                                    }
                                    multiline
                                    rows={4}
                                    variant="standard"
                                    InputProps={{ fullWidth: true }}
                                    disabled={!formValues.with_discarded.isDiscarded}
                                    value={formValues?.with_discarded?.discard_reason ?? undefined}
                                    onChange={handleChange('with_discarded.discard_reason')}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </TabPanel>
            </Collapse>
        </StandardCard>
    );
};

export default React.memo(InspectionPanel);

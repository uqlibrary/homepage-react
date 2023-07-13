import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Alert from '@material-ui/lab/Alert';
import DebouncedTextField from '../../SharedComponents/DebouncedTextField/DebouncedTextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';

import locale from '../../testTag.locale';
import TabPanel from './TabPanel';
import { isValidRepair, isValidDiscard, statusEnum } from '../utils/helpers';
import { isEmptyStr } from '../../helpers/helpers';

export const componentId = 'action_panel';

const testStatusEnum = statusEnum(locale.pages.inspect.config);

const ActionPanel = ({ formValues, selectedAsset, handleChange, classes, isMobileView, disabled }) => {
    const a11yProps = index => ({
        id: `${componentId}-tab-panel-${index}`,
        'aria-controls': `${componentId}-tab-panel-${index}`,
    });

    const pageLocale = locale.pages.inspect;
    const [selectedTabValue, setSelectedTabValue] = React.useState(0);

    React.useEffect(() => {
        if (isEmptyStr(formValues?.inspection_status)) {
            handleChange('isRepair')(false);
            handleChange('isDiscarded')(false);
        }
        if (
            formValues?.inspection_status === testStatusEnum.PASSED.value ||
            selectedAsset?.last_inspection?.inspect_status === testStatusEnum.PASSED.value
        ) {
            if (!!formValues.isRepair) {
                handleChange('isRepair')(false);
            }
            if (selectedTabValue === 0) {
                setSelectedTabValue(1);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues?.inspection_status, selectedAsset?.last_inspection?.inspect_status]);

    const isRepairDisabled = React.useMemo(
        () =>
            !!formValues.isDiscarded ||
            (isEmptyStr(formValues?.inspection_status) && isEmptyStr(selectedAsset?.last_inspection?.inspect_status)) ||
            (isEmptyStr(formValues?.inspection_status) &&
                !isEmptyStr(selectedAsset?.last_inspection?.inspect_status) &&
                selectedAsset?.last_inspection?.inspect_status !== testStatusEnum.FAILED.value) ||
            (!isEmptyStr(formValues?.inspection_status) &&
                formValues?.inspection_status !== testStatusEnum.FAILED.value),
        [formValues?.isDiscarded, formValues?.inspection_status, selectedAsset?.last_inspection?.inspect_status],
    );
    const isDiscardDisabled = React.useMemo(
        () =>
            !!formValues.isRepair ||
            (isEmptyStr(formValues?.inspection_status) && isEmptyStr(selectedAsset?.last_inspection?.inspect_status)) ||
            (!isEmptyStr(selectedAsset?.last_inspection?.inspect_status) &&
                selectedAsset?.last_inspection?.inspect_status === testStatusEnum.OUTFORREPAIR.value) ||
            (!isEmptyStr(formValues?.inspection_status) &&
                formValues?.inspection_status !== testStatusEnum.FAILED.value &&
                formValues?.inspection_status !== testStatusEnum.PASSED.value),
        [formValues?.isRepair, formValues?.inspection_status, selectedAsset?.last_inspection?.inspect_status],
    );

    const handleRepairerDetailsChange = e => handleChange('repairer_contact_details')(e);
    const handleDiscardReasonChange = e => handleChange('discard_reason')(e);

    return (
        <>
            <Grid container spacing={3}>
                <Grid item sm={12}>
                    <Typography component={'h3'} variant={'h6'}>
                        {pageLocale.form.action.title}
                    </Typography>
                </Grid>
            </Grid>

            <Tabs
                value={selectedTabValue}
                indicatorColor="primary"
                textColor="primary"
                onChange={(e, value) => setSelectedTabValue(value)}
                variant={isMobileView ? 'fullWidth' : 'standard'}
                id={`${componentId}-tabs`}
                data-testid={`${componentId}-tabs`}
            >
                <Tab
                    label="Repair"
                    key="Repair"
                    {...a11yProps(1)}
                    disabled={disabled || isRepairDisabled}
                    id={`${componentId}-repair-tab-button`}
                    data-testid={`${componentId}-repair-tab-button`}
                />
                <Tab
                    label="Discard"
                    key="Discard"
                    {...a11yProps(2)}
                    disabled={disabled || isDiscardDisabled}
                    id={`${componentId}-discard-tab-button`}
                    data-testid={`${componentId}-discard-tab-button`}
                />
            </Tabs>
            <TabPanel id={componentId} value={selectedTabValue} index={0}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl className={classes.formControl} fullWidth={isMobileView}>
                            <InputLabel shrink>{pageLocale.form.action.repair.label}</InputLabel>
                            <Select
                                fullWidth
                                className={classes.formSelect}
                                value={formValues.isRepair ? 2 : 1}
                                onChange={e => handleChange('isRepair')(e.target.value === 2)}
                                style={{ minWidth: 200 }}
                                disabled={disabled || isRepairDisabled}
                                id={`${componentId}-is-repair`}
                                data-testid={`${componentId}-is-repair`}
                                inputProps={{
                                    id: `${componentId}-is-repair-input`,
                                    'data-testid': `${componentId}-is-repair-input`,
                                }}
                            >
                                {pageLocale.form.action.repair.options.map(option => (
                                    <MenuItem
                                        value={option.value}
                                        key={option.value}
                                        id={`${componentId}-is-repair-option-${option.value}`}
                                        data-testid={`${componentId}-is-repair-option-${option.value}`}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl className={classes.formControl} fullWidth required>
                            <DebouncedTextField
                                {...pageLocale.form.action.repair.repairerDetails}
                                required
                                error={
                                    !!formValues.isRepair &&
                                    !isValidRepair({
                                        formValues,
                                        lastInspection: selectedAsset?.last_inspection ?? {},
                                        passed: testStatusEnum.FAILED.value,
                                    })
                                }
                                multiline
                                minRows={4}
                                variant="standard"
                                InputProps={{ fullWidth: true }}
                                disabled={disabled || isRepairDisabled || !!!formValues.isRepair}
                                value={formValues?.repairer_contact_details ?? ''}
                                onChange={handleRepairerDetailsChange}
                                id={`${componentId}-repairer-details`}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel id={componentId} value={selectedTabValue} index={1}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Alert severity="warning">{pageLocale.form.action.discard.alertMessage}</Alert>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl className={classes.formControl} fullWidth={isMobileView}>
                            <InputLabel shrink>{pageLocale.form.action.discard.label}</InputLabel>
                            <Select
                                fullWidth
                                className={classes.formSelect}
                                value={formValues.isDiscarded ? 2 : 1}
                                onChange={e => handleChange('isDiscarded')(e.target.value === 2)}
                                style={{ minWidth: 200 }}
                                disabled={disabled || isDiscardDisabled}
                                id={`${componentId}-is-discarded`}
                                data-testid={`${componentId}-is-discarded`}
                                inputProps={{
                                    id: `${componentId}-is-discarded-input`,
                                    'data-testid': `${componentId}-is-discarded-input`,
                                }}
                            >
                                {pageLocale.form.action.discard.options.map(option => (
                                    <MenuItem
                                        value={option.value}
                                        key={option.value}
                                        id={`${componentId}-is-discarded-option-${option.value}`}
                                        data-testid={`${componentId}-is-discarded-option-${option.value}`}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl className={classes.formControl} fullWidth required>
                            <DebouncedTextField
                                {...pageLocale.form.action.discard.discardReason}
                                required
                                error={
                                    !!formValues.isDiscarded &&
                                    !isValidDiscard({
                                        formValues,
                                        lastInspection: selectedAsset?.last_inspection ?? {},
                                        passed: testStatusEnum.PASSED.value,
                                        failed: testStatusEnum.FAILED.value,
                                    })
                                }
                                multiline
                                minRows={4}
                                variant="standard"
                                InputProps={{ fullWidth: true }}
                                disabled={disabled || isDiscardDisabled || !!!formValues.isDiscarded}
                                value={formValues?.discard_reason ?? ''}
                                onChange={handleDiscardReasonChange}
                                id={`${componentId}-discard-reason`}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </TabPanel>
        </>
    );
};

ActionPanel.propTypes = {
    formValues: PropTypes.object.isRequired,
    selectedAsset: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
    classes: PropTypes.any.isRequired,
    isMobileView: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
};

export default React.memo(ActionPanel);

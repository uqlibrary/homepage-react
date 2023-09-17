import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';

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
            if (selectedTabValue === 1) {
                setSelectedTabValue(0);
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
                    label="Discard"
                    key="Discard"
                    {...a11yProps(1)}
                    disabled={disabled || isDiscardDisabled}
                    id={`${componentId}-discard-tab-button`}
                    data-testid={`${componentId}-discard-tab-button`}
                />
                <Tab
                    label="Repair"
                    key="Repair"
                    {...a11yProps(2)}
                    disabled={disabled || isRepairDisabled}
                    id={`${componentId}-repair-tab-button`}
                    data-testid={`${componentId}-repair-tab-button`}
                />
            </Tabs>
            <TabPanel id={componentId} value={selectedTabValue} index={0}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Alert severity="warning">{pageLocale.form.action.discard.alertMessage}</Alert>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl variant="standard" className={classes.formControl} fullWidth={isMobileView}>
                            <InputLabel shrink>{pageLocale.form.action.discard.label}</InputLabel>
                            <Select
                                variant="standard"
                                id={`${componentId}-is-discard`}
                                data-testid={`${componentId}-is-discard`}
                                MenuProps={{
                                    id: `${componentId}-is-discard-options`,
                                    'data-testid': `${componentId}-is-discard-options`,
                                }}
                                inputProps={{
                                    id: `${componentId}-is-discard-input`,
                                    ['data-testid']: `${componentId}-is-discard-input`,
                                }}
                                SelectDisplayProps={{
                                    id: `${componentId}-is-discard-select`,
                                    'data-testid': `${componentId}-is-discard-select`,
                                }}
                                fullWidth
                                className={classes.formSelect}
                                value={formValues.isDiscarded ? 2 : 1}
                                onChange={e => handleChange('isDiscarded')(e.target.value === 2)}
                                style={{ minWidth: 200 }}
                                disabled={disabled || isDiscardDisabled}
                            >
                                {pageLocale.form.action.discard.options.map((option, index) => (
                                    <MenuItem
                                        value={option.value}
                                        key={option.value}
                                        id={`${componentId}-is-discard-option-${index}`}
                                        data-testid={`${componentId}-is-discard-option-${index}`}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="standard" className={classes.formControl} fullWidth required>
                            <TextField
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
                                id={`${componentId}-discard-reason-input`}
                                InputProps={{ fullWidth: true }}
                                InputLabelProps={{ htmlFor: `${componentId}-discard-reason-input` }}
                                inputProps={{
                                    'data-testid': `${componentId}-discard-reason-input`,
                                }}
                                disabled={disabled || isDiscardDisabled || !!!formValues.isDiscarded}
                                value={formValues?.discard_reason ?? ''}
                                onChange={handleDiscardReasonChange}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel id={componentId} value={selectedTabValue} index={1}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl variant="standard" className={classes.formControl} fullWidth={isMobileView}>
                            <InputLabel shrink>{pageLocale.form.action.repair.label}</InputLabel>
                            <Select
                                variant="standard"
                                id={`${componentId}-is-repair`}
                                data-testid={`${componentId}-is-repair`}
                                MenuProps={{
                                    id: `${componentId}-is-repair-options`,
                                    'data-testid': `${componentId}-is-repair-options`,
                                }}
                                inputProps={{
                                    id: `${componentId}-is-repair-input`,
                                    ['data-testid']: `${componentId}-is-repair-input`,
                                }}
                                SelectDisplayProps={{
                                    id: `${componentId}-is-repair-select`,
                                    'data-testid': `${componentId}-is-repair-select`,
                                }}
                                fullWidth
                                className={classes.formSelect}
                                value={formValues.isRepair ? 2 : 1}
                                onChange={e => handleChange('isRepair')(e.target.value === 2)}
                                style={{ minWidth: 200 }}
                                disabled={disabled || isRepairDisabled}
                            >
                                {pageLocale.form.action.repair.options.map((option, index) => (
                                    <MenuItem
                                        value={option.value}
                                        key={option.value}
                                        id={`${componentId}-is-repair-option-${index}`}
                                        data-testid={`${componentId}-is-repair-option-${index}`}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="standard" className={classes.formControl} fullWidth required>
                            <TextField
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
                                id={`${componentId}-repairer-details-input`}
                                InputProps={{ fullWidth: true }}
                                InputLabelProps={{ htmlFor: `${componentId}-repairer-details-input` }}
                                inputProps={{
                                    'data-testid': `${componentId}-repairer-details-input`,
                                }}
                                disabled={disabled || isRepairDisabled || !!!formValues.isRepair}
                                value={formValues?.repairer_contact_details ?? ''}
                                onChange={handleRepairerDetailsChange}
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

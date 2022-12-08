/* istanbul ignore file */
import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Alert from '@material-ui/lab/Alert';
import DebouncedTextField from './DebouncedTextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';

import locale from '../testTag.locale';
import TabPanel from './TabPanel';
import { isValidRepair, isValidDiscard } from '../utils/helpers';

const a11yProps = index => ({
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
});

const ActionPanel = ({ formValues, handleChange, classes, isMobileView, disabled }) => {
    ActionPanel.propTypes = {
        formValues: PropTypes.object.isRequired,
        handleChange: PropTypes.func.isRequired,
        classes: PropTypes.any.isRequired,
        isMobileView: PropTypes.bool.isRequired,
        disabled: PropTypes.bool.isRequired,
    };

    const [selectedTabValue, setSelectedTabValue] = React.useState(0);

    return (
        <>
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
                            disabled ||
                            (tab.value === 1 && !!formValues.isDiscarded) ||
                            (tab.value === 2 && !!formValues.isRepair)
                        }
                        id={`tab-${tab.label.replace(' ', '_').toLowerCase()}`}
                        data-testid={`tab-${tab.label.replace(' ', '_').toLowerCase()}`}
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
                                value={formValues.isRepair ? 2 : 1}
                                onChange={e => handleChange('isRepair')(e.target.value === 2)}
                                style={{ minWidth: 200 }}
                                disabled={disabled}
                                id="selectIsRepair"
                                data-testid="selectIsRepair"
                                inputProps={{ id: 'selectIsRepair-input', 'data-testid': 'selectIsRepair-input' }}
                            >
                                {locale.form.action.repair.options.map(option => (
                                    <MenuItem
                                        value={option.value}
                                        key={option.value}
                                        id={`selectIsRepair-option-${option.value}`}
                                        data-testid={`selectIsRepair-option-${option.value}`}
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
                                {...locale.form.action.repair.repairerDetails}
                                required
                                error={!!formValues.isRepair && !isValidRepair(formValues)}
                                multiline
                                rows={4}
                                variant="standard"
                                InputProps={{ fullWidth: true }}
                                disabled={disabled || !formValues.isRepair}
                                value={formValues?.repairer_contact_details ?? ''}
                                handleChange={handleChange}
                                updateKey="repairer_contact_details"
                                id="repairerDetails"
                                data-testid="repairerDetails"
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
                                value={formValues.isDiscarded ? 2 : 1}
                                onChange={e => handleChange('isDiscarded')(e.target.value === 2)}
                                style={{ minWidth: 200 }}
                                disabled={disabled}
                                id="selectIsDiscarded"
                                data-testid="selectIsDiscarded"
                                inputProps={{ id: 'selectIsDiscarded-input', 'data-testid': 'selectIsDiscarded-input' }}
                            >
                                {locale.form.action.discard.options.map(option => (
                                    <MenuItem
                                        value={option.value}
                                        key={option.value}
                                        id={`selectIsDiscarded-option-${option.value}`}
                                        data-testid={`selectIsDiscarded-option-${option.value}`}
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
                                {...locale.form.action.discard.discardReason}
                                required
                                error={!!formValues.isDiscarded && !isValidDiscard(formValues)}
                                multiline
                                rows={4}
                                variant="standard"
                                InputProps={{ fullWidth: true }}
                                disabled={disabled || !formValues.isDiscarded}
                                value={formValues?.discard_reason ?? ''}
                                handleChange={handleChange}
                                updateKey="discard_reason"
                                id="discardReason"
                                data-testid="discardReason"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </TabPanel>
        </>
    );
};

export default React.memo(ActionPanel);

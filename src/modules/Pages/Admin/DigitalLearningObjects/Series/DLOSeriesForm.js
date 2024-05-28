import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useCookies } from 'react-cookie';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { dlorAdminLink, isValidEmail } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import { useConfirmationState } from 'hooks';
import { scrollToTopOfPage } from 'helpers/general';

const useStyles = makeStyles(theme => ({
    titleBlock: {
        '& p:first-child': {
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            fontSize: 16,
            '& a': {
                color: 'rgba(0, 0, 0, 0.87)',
                textDecoration: 'underline',
            },
        },
    },
    errorMessage: {
        color: '#d62929', // uq $error-500
        fontSize: '0.8em',
        marginTop: 2,
    },
}));

export const DLOSeriesForm = ({
    actions,
    formDefaults,
    dlorSeriesLoading,
    dlorSeriesError,
    // dlorSeries, // provided by formDefaults
    dlorSeriesSaving,
    dlorSavedSeriesError,
    dlorSavedSeries,
    dlorList,
    dlorListLoading,
    dlorListError,
    mode,
}) => {
    const { dlorSeriesId } = useParams();
    const classes = useStyles();
    const [cookies, setCookie] = useCookies();
    console.log('DLOSeriesForm data', dlorSeriesId, ' l=', dlorSeriesLoading, '; e=', dlorSeriesError, '; d=', formDefaults);
    console.log(
        'DLOSeriesForm dlorSavedSeries l=',
        dlorSeriesSaving,
        '; e=',
        dlorSavedSeriesError,
        '; d=',
        dlorSavedSeries,
    );

    const [formValues, setFormValues2] = useState({
        object_series_name: '',
    });
    const setFormValues = x => {
        console.log('setFormValues', x);
        setFormValues2(x);
    }

    const [saveStatus, setSaveStatus] = useState(null); // control confirmation box display
    const [isFormValid, setFormValidity] = useState(false); // enable-disable the save button

    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();

    useEffect(() => {
        if (mode === 'edit' && !!formDefaults && !dlorSeriesLoading && !dlorSeriesError) {
            setFormValues({
                object_series_name: formDefaults?.object_series_name,
            });
        }
        setFormValidity(validateValues(formValues));
    }, [mode, formDefaults, dlorSeriesLoading, dlorSeriesError]);

    useEffect(() => {
        if (!!dlorSavedSeriesError) {
            setSaveStatus('error');
            showConfirmation();
        } else if (!!dlorSavedSeries?.data?.object_series_id) {
            setSaveStatus('complete');
            showConfirmation();
        }
    }, [showConfirmation, dlorSavedSeries, dlorSavedSeriesError]);

    function closeConfirmationBox() {
        setSaveStatus(null);
        hideConfirmation();
    }

    const navigateToSeriesManagementHomePage = () => {
        // TODO also want to clear form here too before nav, so back button gives clear form?

        closeConfirmationBox();
        window.location.href = dlorAdminLink('/series/manage');
        scrollToTopOfPage();
    };
    const navigateToPreviousPage = () => {
        window.history.back();
    };

    const clearForm = actiontype => {
        closeConfirmationBox();
        mode === 'edit' && window.location.reload(false);
    };

    const locale = {
        successMessage: {
            confirmationTitle: mode === 'add' ? 'The series has been created' : 'Changes have been saved',
            confirmationMessage: '',
            cancelButtonLabel: mode === 'add' ? 'Add another Series' : 'Re-edit Series',
            confirmButtonLabel: 'Return to Admin Seriess page',
        },
        errorMessage: {
            confirmationTitle: dlorSavedSeriesError,
            confirmationMessage: '',
            confirmButtonLabel: 'Close',
        },
    };

    const handleChange = (prop, value) => e => {
        const theNewValue = e.target.value;
        const newValues = { ...formValues, [prop]: theNewValue };

        setFormValidity(validateValues(newValues));
        setFormValues(newValues);
    };

    const validateValues = currentValues => {
        return isValidSeriesName(currentValues?.object_series_name);
    };

    const saveChanges = () => {
        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', formValues);
        }

        return mode === 'add'
            ? actions.createDlorSeries(formValues)
            : actions.updateDlorSeries(dlorSeriesId, formValues);
    };

    const isValidSeriesName = seriesName => {
        return (mode === 'edit' && seriesName === formDefaults?.object_series_name) || seriesName?.trim() !== '';
    };

    const listForThisSeries =
        !dlorListError && !dlorListLoading && dlorList?.filter(d => d?.object_series_id === dlorSeriesId);
    const listNOTForThisSeries =
        !dlorListError && !dlorListLoading && dlorList?.filter(d => d?.object_series_id !== dlorSeriesId && d?.object_series_id > 0);

    return (
        <Grid container spacing={2}>
            {(() => {
                if (
                    (!!dlorSeriesLoading || !!dlorSeriesSaving || (!dlorSeriesError && !formDefaults)) &&
                    mode === 'edit'
                ) {
                    return (
                        <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                            <div style={{ minHeight: 600 }}>
                                <InlineLoader message="Loading" />
                            </div>
                        </Grid>
                    );
                } else if (!!dlorSeriesError) {
                    return (
                        <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                            <Typography variant="body1" data-testid="dlor-seriesItem-error">
                                {dlorSeriesError}
                            </Typography>
                        </Grid>
                    );
                } else if (!!formDefaults) {
                    return (
                        <>
                            <Grid item xs={12} data-testid="dlor-series-item-list">
                                <Grid container key={`list-series-${formDefaults?.object_series_id}`}>
                                    {(saveStatus === 'complete' || saveStatus === 'error') && (
                                        <ConfirmationBox
                                            actionButtonColor="primary"
                                            actionButtonVariant="contained"
                                            confirmationBoxId="dlor-series-save-outcome"
                                            onAction={() => {
                                                saveStatus === 'error'
                                                    ? closeConfirmationBox()
                                                    : navigateToSeriesManagementHomePage();
                                            }}
                                            hideCancelButton={
                                                saveStatus === 'error' || !locale.successMessage.cancelButtonLabel
                                            }
                                            cancelButtonLabel={locale.successMessage.cancelButtonLabel}
                                            onCancelAction={() => clearForm()}
                                            onClose={closeConfirmationBox}
                                            isOpen={isOpen}
                                            locale={
                                                saveStatus === 'error' ? locale.errorMessage : locale.successMessage
                                            }
                                        />
                                    )}
                                    <form id="dlor-editSeries-form" style={{ width: '100%' }}>
                                        <Grid item xs={12}>
                                            <FormControl variant="standard" fullWidth>
                                                <InputLabel htmlFor="object_series_name">Series name *</InputLabel>
                                                <Input
                                                    id="object_series_name"
                                                    data-testid="object_series_name"
                                                    required
                                                    value={formValues?.object_series_name || ''}
                                                    onChange={handleChange('object_series_name')}
                                                    error={!isValidSeriesName(formValues?.object_series_name)}
                                                />
                                            </FormControl>
                                            {!isValidSeriesName(formValues?.object_series_name) && (
                                                <div
                                                    className={classes.errorMessage}
                                                    data-testid="error-message-object_series_name"
                                                >
                                                    This series name is not valid.
                                                </div>
                                            )}
                                        </Grid>
                                    </form>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                {!!listForThisSeries && listForThisSeries.length > 0 && listForThisSeries.map(item => <li>{item.object_title}</li>)
                            </Grid>

                            <Grid item xs={12}>
                                {!!listNOTForThisSeries && listNOTForThisSeries.length > 0 && listNOTForThisSeries.map(item => <li>{item.object_title}</li>)
                            </Grid>

                            <Grid item xs={3} align="left">
                                <Button
                                    color="secondary"
                                    children="Cancel"
                                    data-testid="admin-dlor-form-button-cancel"
                                    onClick={() => navigateToPreviousPage()}
                                    variant="contained"
                                />
                            </Grid>
                            <Grid item xs={9} align="right">
                                <Button
                                    color="primary"
                                    data-testid="admin-dlor-series-form-save-button"
                                    variant="contained"
                                    children="Save"
                                    disabled={!isFormValid}
                                    onClick={saveChanges}
                                    // className={classes.saveButton}
                                />
                            </Grid>
                        </>
                    );
                }
            })()}
        </Grid>
    );
};

DLOSeriesForm.propTypes = {
    actions: PropTypes.any,
    formDefaults: PropTypes.object,
    dlorSeriesLoading: PropTypes.bool,
    dlorSeriesError: PropTypes.any,
    dlorSeriesSaving: PropTypes.bool,
    dlorSavedSeriesError: PropTypes.any,
    dlorSavedSeries: PropTypes.object,
    dlorListLoading: PropTypes.bool,
    dlorListError: PropTypes.any,
    dlorList: PropTypes.object,
    mode: PropTypes.string,
};

export default DLOSeriesForm;

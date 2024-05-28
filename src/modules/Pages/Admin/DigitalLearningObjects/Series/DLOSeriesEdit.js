import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import { dlorAdminLink } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import VisitHomepage from 'modules/Pages/Admin/DigitalLearningObjects//SharedDlorComponents/VisitHomepage';

import { scrollToTopOfPage } from 'helpers/general';
import { useConfirmationState } from 'hooks';
import { fullPath } from 'config/routes';

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
        color: theme.palette.error.light,
        fontSize: '0.8em',
        marginTop: 2,
    },
    draggableItem: {
        minHeight: '2em',
        backgroundColor: '#e7f0fa', // $utility-50
        marginBottom: '0.5em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingInline: '1.5em',
    },
}));

export const DLOSeriesEdit = ({
    actions,
    dlorSeries,
    dlorSeriesLoading,
    dlorSeriesError,
    dlorItemUpdating,
    dlorUpdatedItemError,
    dlorUpdatedItem,
    dlorList,
    dlorListLoading,
    dlorListError,
    dlorSeriesSaving,
    dlorSavedSeriesError,
    dlorSavedSeries,
}) => {
    const { dlorSeriesId } = useParams();
    const classes = useStyles();

    console.log('dlorSingle l=', dlorSeriesLoading, '; e=', dlorSeriesError, '; d=', dlorSeries);
    console.log('dlorList l=', dlorListLoading, '; e=', dlorListError, '; d=', dlorList);

    const [saveStatus, setSaveStatus] = useState(null); // control confirmation box display
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    const [isFormValid, setFormValidity] = useState(false); // enable-disable the save button
    const [formValues, setFormValues2] = useState({
        object_series_name: '',
    });
    const setFormValues = x => {
        console.log('setFormValues', x);
        setFormValues2(x);
    };

    useEffect(() => {
        if (!!dlorSeriesId) {
            actions.loadADLORSeries(dlorSeriesId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dlorSeriesId]);

    useEffect(() => {
        if (!dlorListError && !dlorListLoading && !dlorList) {
            actions.loadAllDLORs();
        }
    }, [dlorList]);

    useEffect(() => {
        if (!!dlorSeries && !dlorSeriesLoading && !dlorSeriesError) {
            setFormValues({
                object_series_name: dlorSeries?.object_series_name,
            });
        }
        setFormValidity(validateValues(formValues));
    }, [dlorSeries, dlorSeriesLoading, dlorSeriesError]);

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
        window.location.reload(false);
    };

    const locale = {
        successMessage: {
            confirmationTitle: 'Changes have been saved',
            confirmationMessage: '',
            cancelButtonLabel: 'Re-edit Series',
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

        actions.updateDlorSeries(dlorSeriesId, formValues);
    };

    const isValidSeriesName = seriesName => {
        return seriesName === dlorSeries?.object_series_name || seriesName?.trim() !== '';
    };

    const listForThisSeries =
        !dlorListError &&
        !dlorListLoading &&
        dlorList
            ?.filter(d => {
                return d?.object_series_id === Number(dlorSeriesId);
            })
            .sort();
    const listNOTForThisSeries =
        !dlorListError &&
        !dlorListLoading &&
        dlorList?.filter(d => d?.object_series_id !== Number(dlorSeriesId) && d?.object_series_id > 0);

    return (
        <StandardPage title="Digital Learning Hub - Edit Series">
            <Grid container spacing={2} style={{ marginBottom: 25 }}>
                <Grid item xs={11}>
                    <div className={classes.titleBlock}>
                        <Typography component={'p'} variant={'h6'} data-testid="dlor-detailpage-sitelabel">
                            <a data-testid="dlor-edit-form-homelink" href={dlorAdminLink()}>
                                Digital Learning Hub admin
                            </a>
                            <ArrowForwardIcon style={{ height: 15 }} />
                            <a data-testid="dlor-edit-form-uplink" href={dlorAdminLink('/series/manage')}>
                                Series management
                            </a>
                            <ArrowForwardIcon style={{ height: 15 }} />
                            Edit series {dlorSeries?.object_series_name}
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={1}>
                    <VisitHomepage />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                {(() => {
                    if (!!dlorSeriesLoading || !!dlorSeriesSaving || (!dlorSeriesError && !dlorSeries)) {
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
                    } else if (!!dlorSeries) {
                        return (
                            <>
                                <Grid item xs={12} data-testid="dlor-series-item-list">
                                    <Grid container key={`list-series-${dlorSeries?.object_series_id}`}>
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
                                                        value={dlorSeries?.object_series_name || ''}
                                                        onChange={handleChange('object_series_name')}
                                                        error={!isValidSeriesName(dlorSeries?.object_series_name)}
                                                    />
                                                </FormControl>
                                                {!isValidSeriesName(dlorSeries?.object_series_name) && (
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
                                    <p>Drag to reorder, drag between lists</p>
                                    <h2>Objects in this series ({dlorSeries.object_series_id})</h2>
                                    <div id="dragLandingAarea" style={{ minHeight: '10em' }}>
                                        {listForThisSeries.length === 0 && <p>(None yet)</p>}
                                        <ul style={{ listStyleType: 'none' }}>
                                            {!!listForThisSeries &&
                                                listForThisSeries.length > 0 &&
                                                listForThisSeries.map(o => (
                                                    <li key={o.object_id} className={classes.draggableItem}>
                                                        <span>{o.object_title}</span>
                                                        <div>
                                                            <a
                                                                href={`${fullPath}/digital-learning-hub/view/${o?.object_public_uuid}`}
                                                                data-testid={`dlor-series-edit-view-${o.object_id}`}
                                                            >
                                                                <VisibilityIcon style={{ color: 'black' }} />
                                                            </a>
                                                        </div>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                </Grid>

                                <Grid item xs={12}>
                                    <h2>Objects available to add to this series</h2>
                                    <ul style={{ listStyleType: 'none' }}>
                                        {!!listNOTForThisSeries &&
                                            listNOTForThisSeries.length > 0 &&
                                            listNOTForThisSeries.map(o => (
                                                <li key={o.object_id} className={classes.draggableItem}>
                                                    {' '}
                                                    <span>{o.object_title}</span>
                                                    <div>
                                                        <a
                                                            href={`${fullPath}/digital-learning-hub/view/${o?.object_public_uuid}`}
                                                        >
                                                            <VisibilityIcon style={{ color: 'black' }} />
                                                        </a>
                                                    </div>
                                                </li>
                                            ))}
                                    </ul>
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
        </StandardPage>
    );
};

DLOSeriesEdit.propTypes = {
    actions: PropTypes.any,
    dlorSeries: PropTypes.object,
    dlorSeriesLoading: PropTypes.bool,
    dlorSeriesError: PropTypes.any,
    dlorItemUpdating: PropTypes.bool,
    dlorUpdatedItemError: PropTypes.any,
    dlorUpdatedItem: PropTypes.object,
    dlorList: PropTypes.array,
    dlorListLoading: PropTypes.bool,
    dlorListError: PropTypes.any,
};

export default DLOSeriesEdit;

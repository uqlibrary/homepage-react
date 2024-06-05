import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useCookies } from 'react-cookie';

import Button from '@mui/material/Button';
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

const useStyles = makeStyles(() => ({
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

export const DLOTeamForm = ({
    actions,
    formDefaults,
    dlorTeamLoading,
    dlorTeamError,
    dlorTeamSaving,
    dlorSavedTeamError,
    dlorSavedTeam,
    mode,
}) => {
    const { dlorTeamId } = useParams();
    const classes = useStyles();
    const [cookies, setCookie] = useCookies();
    console.log('DLOTeamForm', dlorTeamId, ' l=', dlorTeamLoading, '; e=', dlorTeamError, '; d=', formDefaults);
    console.log('DLOTeamForm dlorSavedTeam l=', dlorTeamSaving, '; e=', dlorSavedTeamError, '; d=', dlorSavedTeam);

    const [formValues, setFormValues] = useState({
        team_name: '',
        team_manager: '',
        team_email: '',
    });
    const [saveStatus, setSaveStatus2] = useState(null); // control confirmation box display
    const setSaveStatus = x => {
        console.log('setSaveStatus was ', saveStatus, '; now ', x);
        setSaveStatus2(x);
    };
    console.log('saveStatus=', saveStatus);
    const [isFormValid, setFormValidity] = useState(false); // enable-disable the save button

    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();

    useEffect(() => {
        if (mode === 'edit' && !!formDefaults && !dlorTeamLoading && !dlorTeamError) {
            setFormValues({
                team_name: formDefaults?.team_name,
                team_manager: formDefaults?.team_manager,
                team_email: formDefaults?.team_email,
            });
        }
        setFormValidity(validateValues(formValues));
    }, [mode, formDefaults, dlorTeamLoading, dlorTeamError]);

    useEffect(() => {
        if (!!dlorSavedTeamError || !!dlorTeamError) {
            setSaveStatus('error');
            showConfirmation();
        } else if (!!dlorSavedTeam?.data?.team_id) {
            setSaveStatus('complete');
            showConfirmation();
        }
    }, [showConfirmation, dlorSavedTeam, dlorSavedTeamError]);

    function closeConfirmationBox() {
        setSaveStatus(null);
        hideConfirmation();
    }

    const navigateToTeamManagementHomePage = () => {
        // TODO also want to clear form here too before nav, so back button gives clear form?

        closeConfirmationBox();
        window.location.href = dlorAdminLink('/team/manage');
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
            confirmationTitle: mode === 'add' ? 'The team has been created' : 'Changes have been saved',
            confirmationMessage: '',
            cancelButtonLabel: mode === 'add' ? 'Add another Team' : 'Re-edit Team',
            confirmButtonLabel: 'Return to Admin Teams page',
        },
        errorMessage: {
            confirmationTitle: dlorSavedTeamError,
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
        return isValidTeamName(currentValues?.team_name) && isValidEmailLocal(currentValues?.team_email);
    };

    const saveChanges = () => {
        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', formValues);
        }

        return mode === 'add' ? actions.createDlorTeam(formValues) : actions.updateDlorTeam(dlorTeamId, formValues);
    };

    const isValidTeamName = teamName => {
        return (mode === 'edit' && teamName === formDefaults?.team_name) || teamName?.trim() !== '';
    };

    const isValidEmailLocal = emailAddress => {
        return (emailAddress === formDefaults?.team_email || emailAddress?.trim() !== '') && isValidEmail(emailAddress);
    };

    return (
        <Grid container spacing={2}>
            {(() => {
                if ((!!dlorTeamLoading || !!dlorTeamSaving || (!dlorTeamError && !formDefaults)) && mode === 'edit') {
                    return (
                        <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                            <div style={{ minHeight: 600 }}>
                                <InlineLoader message="Loading" />
                            </div>
                        </Grid>
                    );
                } else if (!!dlorTeamError) {
                    return (
                        <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                            <Typography variant="body1" data-testid="dlor-teamItem-error">
                                {dlorTeamError}
                            </Typography>
                        </Grid>
                    );
                } else if (!!formDefaults) {
                    return (
                        <>
                            <Grid item xs={12} data-testid="dlor-team-item-list">
                                <Grid container key={`list-team-${formDefaults?.team_id}`}>
                                    {(saveStatus === 'complete' || saveStatus === 'error') && (
                                        <ConfirmationBox
                                            actionButtonColor="primary"
                                            actionButtonVariant="contained"
                                            confirmationBoxId="dlor-team-save-outcome"
                                            onAction={() => {
                                                saveStatus === 'error'
                                                    ? closeConfirmationBox()
                                                    : navigateToTeamManagementHomePage();
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
                                    <form id="dlor-editTeam-form" style={{ width: '100%' }}>
                                        <Grid item xs={12}>
                                            <FormControl variant="standard" fullWidth>
                                                <InputLabel htmlFor="team_name">Team name *</InputLabel>
                                                <Input
                                                    id="team_name"
                                                    data-testid="team_name"
                                                    required
                                                    value={formValues?.team_name || ''}
                                                    onChange={handleChange('team_name')}
                                                    error={!isValidTeamName(formValues?.team_name)}
                                                />
                                            </FormControl>
                                            {!isValidTeamName(formValues?.team_name) && (
                                                <div
                                                    className={classes.errorMessage}
                                                    data-testid="error-message-team_name"
                                                >
                                                    This team name is not valid.
                                                </div>
                                            )}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl variant="standard" fullWidth>
                                                <InputLabel htmlFor="team_manager">Name of Team Manager</InputLabel>
                                                <Input
                                                    id="team_manager"
                                                    data-testid="team_manager"
                                                    value={formValues?.team_manager || ''}
                                                    onChange={handleChange('team_manager')}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl variant="standard" fullWidth>
                                                <InputLabel htmlFor="team_email">
                                                    Email address to contact team *
                                                </InputLabel>
                                                <Input
                                                    id="team_email"
                                                    data-testid="team_email"
                                                    value={formValues?.team_email || ''}
                                                    onChange={handleChange('team_email')}
                                                    error={!isValidEmailLocal(formValues?.team_email)}
                                                />
                                                {!isValidEmailLocal(formValues?.team_email) && (
                                                    <div
                                                        className={classes.errorMessage}
                                                        data-testid="error-message-team_email"
                                                    >
                                                        This email address is not valid.
                                                    </div>
                                                )}
                                            </FormControl>
                                        </Grid>
                                    </form>
                                </Grid>
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
                                    data-testid="admin-dlor-team-form-save-button"
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

DLOTeamForm.propTypes = {
    actions: PropTypes.any,
    formDefaults: PropTypes.object,
    dlorTeamLoading: PropTypes.bool,
    dlorTeamError: PropTypes.any,
    dlorTeamSaving: PropTypes.bool,
    dlorSavedTeamError: PropTypes.any,
    dlorSavedTeam: PropTypes.object,
    mode: PropTypes.string,
};

export default DLOTeamForm;

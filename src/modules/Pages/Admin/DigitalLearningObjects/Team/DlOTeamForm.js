import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useCookies } from 'react-cookie';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { dlorAdminLink, isValidEmail } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import { scrollToTopOfPage } from 'helpers/general';

const StyledForm = styled('form')(() => ({
    width: '100%',
}));

export const DLOTeamForm = ({
    actions,
    formDefaults,
    dlorTeamLoading,
    dlorTeamError,
    // saving team
    dlorTeamSaving,
    dlorSavedTeamError,
    dlorSavedTeam,
    mode,
}) => {
    const { dlorTeamId } = useParams();
    const [cookies, setCookie] = useCookies();

    const [formValues, setFormValues] = useState({
        team_name: '',
        team_manager: '',
        team_email: '',
    });
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [isFormValid, setFormValidity] = useState(false); // enable-disable the save button

    useEffect(() => {
        setConfirmationOpen(false);
        if (mode === 'edit' && !!formDefaults && !dlorTeamLoading && !dlorTeamError) {
            setFormValues({
                team_name: formDefaults?.team_name,
                team_manager: formDefaults?.team_manager,
                team_email: formDefaults?.team_email,
            });
        }
    }, [mode, dlorTeamLoading, dlorTeamError, formDefaults]);

    useEffect(() => {
        setConfirmationOpen(!dlorTeamSaving && (!!dlorSavedTeamError || !!dlorSavedTeam));
    }, [dlorSavedTeam, dlorSavedTeamError, dlorTeamSaving]);

    function closeConfirmationBox() {
        setConfirmationOpen(false);
    }

    const navigateToTeamManagementHomePage = () => {
        closeConfirmationBox();
        window.location.href = dlorAdminLink('/team/manage');
        scrollToTopOfPage();
    };
    const navigateToPreviousPage = () => {
        window.location.href = dlorAdminLink('/team/manage');
    };

    const clearForm = () => {
        closeConfirmationBox();
        /* istanbul ignore next */
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

    const isValidTeamName = teamName => {
        return (mode === 'edit' && teamName === formDefaults?.team_name) || teamName?.trim() !== '';
    };

    const isValidEmailLocal = emailAddress => {
        return (emailAddress === formDefaults?.team_email || emailAddress?.trim() !== '') && isValidEmail(emailAddress);
    };

    const validateValues = currentValues => {
        return isValidTeamName(currentValues?.team_name) && isValidEmailLocal(currentValues?.team_email);
    };

    const handleChange = prop => e => {
        const theNewValue = e.target.value;
        const newValues = { ...formValues, [prop]: theNewValue };

        setFormValidity(validateValues(newValues));
        setFormValues(newValues);
    };

    const saveChanges = () => {
        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', formValues);
        }

        return mode === 'add' ? actions.createDlorTeam(formValues) : actions.updateDlorTeam(dlorTeamId, formValues);
    };

    return (
        <Grid container spacing={2}>
            {(() => {
                /* istanbul ignore else */
                if ((!!dlorTeamLoading || !!dlorTeamSaving || (!dlorTeamError && !formDefaults)) && mode === 'edit') {
                    return (
                        <Grid item xs={12} md={9} sx={{ marginTop: '12px' }}>
                            <Box sx={{ minHeight: '600px' }}>
                                <InlineLoader message="Loading" />
                            </Box>
                        </Grid>
                    );
                } else if (!!dlorTeamError) {
                    return (
                        <Grid item xs={12} md={9} sx={{ marginTop: '12px' }}>
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
                                    <ConfirmationBox
                                        actionButtonColor="primary"
                                        actionButtonVariant="contained"
                                        confirmationBoxId="dlor-team-save-outcome"
                                        onAction={() => {
                                            !!dlorSavedTeamError
                                                ? closeConfirmationBox()
                                                : navigateToTeamManagementHomePage();
                                        }}
                                        hideCancelButton={
                                            !!dlorSavedTeamError || !locale.successMessage.cancelButtonLabel
                                        }
                                        cancelButtonLabel={locale.successMessage.cancelButtonLabel}
                                        onCancelAction={() => clearForm()}
                                        onClose={closeConfirmationBox}
                                        isOpen={confirmationOpen}
                                        locale={!!dlorSavedTeamError ? locale.errorMessage : locale.successMessage}
                                    />

                                    <StyledForm id="dlor-editTeam-form">
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
                                                <Box
                                                    sx={{
                                                        color: '#d62929', // uq $error-500
                                                        fontSize: '0.8em',
                                                        marginTop: 2,
                                                    }}
                                                    data-testid="error-message-team_name"
                                                >
                                                    This team name is not valid.
                                                </Box>
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
                                                    <Box
                                                        sx={{
                                                            color: '#d62929', // uq $error-500
                                                            fontSize: '0.8em',
                                                            marginTop: 2,
                                                        }}
                                                        data-testid="error-message-team_email"
                                                    >
                                                        This email address is not valid.
                                                    </Box>
                                                )}
                                            </FormControl>
                                        </Grid>
                                    </StyledForm>
                                </Grid>
                            </Grid>

                            <Grid item xs={3} align="left">
                                <Button
                                    color="secondary"
                                    children="Cancel"
                                    data-testid="admin-dlor-team-form-button-cancel"
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
                                />
                            </Grid>
                        </>
                    );
                }
                /* istanbul ignore next */
                return <></>;
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

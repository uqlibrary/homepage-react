import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { dlorAdminLink, isValidEmail } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import { scrollToTopOfPage } from 'helpers/general';
import { breadcrumbs } from 'config/routes';
import { useAccountContext } from 'context';
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, TableContainer } from '@mui/material';
import { ExpandMore, PausePresentation } from '@mui/icons-material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import moment from 'moment';
import { isDlorAdminUser } from 'helpers/access';

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
    const { account } = useAccountContext();
    const { dlorTeamId } = useParams();
    const [cookies, setCookie] = useCookies();

    console.log("Account", account)

    const [formValues, setFormValues] = useState({
        team_name: '',
        team_manager: '',
        team_email: '',
    });
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [isFormValid, setFormValidity] = useState(false); // enable-disable the save button
    const [editingMemberIdx, setEditingMemberIdx] = useState(null);
    const [editingMember, setEditingMember] = useState(null);
    const [newMember, setNewMember] = useState({ team_admin_username: '', team_admin_email: '' });
    const [addMemberError, setAddMemberError] = useState('');

    // Add to your component's state
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.dloradmin.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.dloradmin.pathname);
    }, []);

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
        window.location.href = dlorAdminLink('/team/manage', account);
        scrollToTopOfPage();
    };
    const navigateToPreviousPage = () => {
        window.location.href = dlorAdminLink('/team/manage', account);
    };

    const clearForm = () => {
        closeConfirmationBox();
        /* istanbul ignore next */
        mode === 'edit' && window.location.reload(false);
    };

    const isCurrentUserTeamMember = () => {
        if (isDlorAdminUser(account)) return true; // Admins can always edit teams
        if (!formDefaults?.team_members || !account?.id) return false;
        return formDefaults.team_members.some(member => member.team_admin_username === account.id);
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

    const handleEditTeamMember = (member, idx) => {
        setEditingMemberIdx(idx);
        setEditingMember({ ...member });
    };

    const handleSaveEditMember = () => {
        // Implement save logic here (e.g., call an action or update state)
        // For now, just close the edit form
        actions.editDlorTeamMember(editingMember.team_admin_id, {
            ...editingMember,
            team_id: formDefaults.team_id,
        });

        console.log('Save edited team member:', editingMember);
        setEditingMemberIdx(null);
        setEditingMember(null);
    };

    const handleCancelEditMember = () => {
        setEditingMemberIdx(null);
        setEditingMember(null);
    };

    const handleNewMemberChange = prop => e => {
        let value = e.target.value;
        if (prop === 'team_admin_username') {
            value = value.replace(/\s/g, '').slice(0, 15);
        }
        setNewMember({ ...newMember, [prop]: value });
        setAddMemberError('');
    };

    const handleAddNewMember = () => {
        actions.addDlorTeamMember({
            ...newMember,
            team_id: formDefaults.team_id,
        });
        setNewMember({ team_admin_username: '', team_admin_email: '' });
        setAddMemberError('');
    };

    const isAddButtonDisabled =
        !newMember.team_admin_username.trim() ||
        !isValidEmail(newMember.team_admin_email) ||
        !!addMemberError ||
        !!dlorTeamSaving || !!dlorTeamLoading;

    console.log("Form Values")
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
                    // Only render the form if the user is a team member
                    if (!isCurrentUserTeamMember()) {
                        return (
                            <Grid item xs={12}>
                                <Typography variant="body1" data-testid="dlor-teamItem-error-message">
                                    You are not a member of this team and cannot edit it.
                                </Typography>
                            </Grid>
                        );
                    }
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
                                                    data-testid="admin-dlor-team-form-team-name"
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
                                                    data-testid="admin-dlor-team-form-error-message-team-name"
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
                                                    data-testid="admin-dlor-team-form-team-manager"
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
                                                    data-testid="admin-dlor-team-form-team-email"
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
                                                        data-testid="admin-dlor-team-form-error-message-team-email"
                                                    >
                                                        This email address is not valid.
                                                    </Box>
                                                )}
                                            </FormControl>
                                        </Grid>
                                    </StyledForm>
                                    <Grid item xs={12}>
                                        <Accordion
                                            sx={{ marginTop: 2 }}
                                            defaultExpanded={!!formDefaults?.team_members && formDefaults.team_members.length > 0}
                                        >
                                            <AccordionSummary expandIcon={<ExpandMore />}>
                                                <Typography variant="p" data-testid='team-members-title'>Team Admins</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <TableContainer component={Paper}>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <strong>Username</strong>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <strong>Email</strong>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <strong>Notifications</strong>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <strong>Date Added</strong>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <strong>Actions</strong>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {!!formDefaults?.team_members && formDefaults.team_members.length > 0 ? (
                                                                formDefaults.team_members.map((member, idx) => (
                                                                    editingMemberIdx === idx ? (
                                                                        <TableRow key={idx}>
                                                                            <TableCell>
                                                                                <Input
                                                                                    value={editingMember.team_admin_username}
                                                                                    onChange={e => setEditingMember({ ...editingMember, team_admin_username: e.target.value })}
                                                                                    fullWidth
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Input
                                                                                    value={editingMember.team_admin_email}
                                                                                    onChange={e => setEditingMember({ ...editingMember, team_admin_email: e.target.value })}
                                                                                    fullWidth
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Checkbox
                                                                                    checked={editingMember.team_admin_receive_object_notifications}
                                                                                    onChange={e => setEditingMember({ ...editingMember, team_admin_receive_object_notifications: e.target.checked })}
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {moment(editingMember.created_at).format('DD/MM/YYYY, h:mm A')}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Button
                                                                                    color="primary"
                                                                                    size="small"
                                                                                    onClick={handleSaveEditMember}
                                                                                    data-testid={`team-member-save-${idx}`}
                                                                                >
                                                                                    Save
                                                                                </Button>
                                                                                <Button
                                                                                    color="secondary"
                                                                                    size="small"
                                                                                    onClick={handleCancelEditMember}
                                                                                    data-testid={`team-member-cancel-${idx}`}
                                                                                >
                                                                                    Cancel
                                                                                </Button>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ) : (
                                                                        <TableRow key={idx}>
                                                                            <TableCell data-testid={`team-member-username-${idx}`}>
                                                                                {member.team_admin_username}
                                                                            </TableCell>
                                                                            <TableCell data-testid={`team-member-email-${idx}`}>
                                                                                {member.team_admin_email}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Checkbox
                                                                                    checked={member.team_admin_receive_object_notifications}
                                                                                    disabled
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell data-testid={`team-member-date-${idx}`}>
                                                                                {moment(member.created_at).format('DD/MM/YYYY, h:mm A')}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <IconButton
                                                                                    aria-label="Edit team admin"
                                                                                    data-testid={`team-member-edit-${idx}`}
                                                                                    onClick={() => handleEditTeamMember(member, idx)}
                                                                                    size="small"
                                                                                >
                                                                                    <EditIcon />
                                                                                </IconButton>
                                                                                <IconButton
                                                                                    aria-label="Delete team admin"
                                                                                    data-testid={`team-member-delete-${idx}`}
                                                                                    onClick={() => {
                                                                                        setMemberToDelete(member);
                                                                                        setDeleteConfirmOpen(true);
                                                                                    }}
                                                                                    size="small"
                                                                                >
                                                                                    <DeleteIcon />
                                                                                </IconButton>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )
                                                                ))
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell colSpan={5} align="center">
                                                                        No team admins found.
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                {mode === 'edit' && (
                                                    <Grid item xs={12}>
                                                        <Box sx={{ marginTop: 2 }}>
                                                            <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                                                                Add Team Admin
                                                            </Typography>
                                                            <Grid container spacing={2} alignItems="center">
                                                                <Grid item xs={4}>
                                                                    <Input
                                                                        placeholder="Username"
                                                                        value={newMember.team_admin_username}
                                                                        onChange={handleNewMemberChange('team_admin_username')}
                                                                        fullWidth
                                                                        data-testid="add-team-member-username"
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={5}>
                                                                    <Input
                                                                        placeholder="Email"
                                                                        value={newMember.team_admin_email}
                                                                        onChange={handleNewMemberChange('team_admin_email')}
                                                                        fullWidth
                                                                        data-testid="add-team-member-email"
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={3}>
                                                                    <Button
                                                                        color="primary"
                                                                        variant="contained"
                                                                        onClick={handleAddNewMember}
                                                                        data-testid="add-team-member-button"
                                                                        fullWidth
                                                                        disabled={isAddButtonDisabled}
                                                                    >
                                                                        Add
                                                                    </Button>
                                                                </Grid>
                                                                {addMemberError && (
                                                                    <Grid item xs={12}>
                                                                        <Typography color="error" variant="body2" data-testid="add-team-member-error">
                                                                            {addMemberError}
                                                                        </Typography>
                                                                    </Grid>
                                                                )}
                                                            </Grid>
                                                        </Box>
                                                    </Grid>
                                                )}
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                    
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

                            {deleteConfirmOpen && (
                                <ConfirmationBox
                                    confirmationBoxId="dlor-team-member-delete-confirm"
                                    isOpen={deleteConfirmOpen}
                                    locale={{
                                        confirmationTitle: "Delete Team Admin",
                                        confirmationMessage: `Are you sure you want to delete ${memberToDelete?.team_admin_username}?`,
                                        cancelButtonLabel: "Cancel",
                                        confirmButtonLabel: "Delete",
                                    }}
                                    onAction={() => {
                                        actions.deleteDlorTeamMember(memberToDelete.team_admin_id, memberToDelete.team_id);
                                        setDeleteConfirmOpen(false);
                                        setMemberToDelete(null);
                                    }}
                                    onCancelAction={() => {
                                        setDeleteConfirmOpen(false);
                                        setMemberToDelete(null);
                                    }}
                                    onClose={() => {
                                        setDeleteConfirmOpen(false);
                                        setMemberToDelete(null);
                                    }}
                                />
                            )}
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

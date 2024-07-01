import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import { pluraliseWord } from 'modules/Pages/DigitalLearningObjects/dlorHelpers';
import { dlorAdminLink } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import { ObjectListItem } from 'modules/Pages/Admin/DigitalLearningObjects//SharedDlorComponents/ObjectListItem';
import DlorAdminBreadcrumbs from 'modules/Pages/Admin/DigitalLearningObjects//SharedDlorComponents/DlorAdminBreadcrumbs';

const StyledObjectDetails = styled('details')(() => ({
    marginLeft: '20px',
}));

export const DLOTeamList = ({
    actions,
    dlorTeamList,
    dlorTeamListLoading,
    dlorTeamListError,
    dlorList,
    dlorListLoading,
    dlorListError,
    dlorTeamDeleting,
    dlorTeamDeleted,
    dlorTeamDeleteError,
}) => {
    const DELETION_STEP_NULL = null;
    const DELETION_STEP_ONE_CONFIRM = 1;
    const DELETION_STEP_TWO_HAPPENING = 2;

    const [teamToDelete, setObjectToDelete] = React.useState(null);
    const [deleteStep, setDeleteStep] = React.useState(DELETION_STEP_NULL);
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    useEffect(() => {
        if (!dlorTeamListError && !dlorTeamListLoading && !dlorTeamList) {
            actions.loadOwningTeams();
        }
    }, [actions, dlorTeamList, dlorTeamListError, dlorTeamListLoading]);

    useEffect(() => {
        if (!dlorListError && !dlorListLoading && !dlorList) {
            actions.loadAllDLORs();
        }
    }, [actions, dlorList, dlorListError, dlorListLoading]);

    useEffect(() => {
        if (!!dlorTeamDeleteError && deleteStep === DELETION_STEP_TWO_HAPPENING) {
            // delete failed
            setConfirmationOpen(true);
        } else if (!dlorTeamDeleting && !!dlorTeamDeleted && deleteStep === DELETION_STEP_TWO_HAPPENING) {
            // success
            setConfirmationOpen(true);
        }
    }, [dlorTeamDeleting, dlorTeamDeleted, dlorTeamDeleteError, deleteStep]);

    const navigateToAddPage = () => {
        window.location.href = dlorAdminLink('/team/add');
    };

    const deleteADlorTeam = teamId => {
        return actions.deleteDlorTeam(teamId);
    };
    const confirmDelete = teamId => {
        setObjectToDelete(teamId);
        setDeleteStep(DELETION_STEP_ONE_CONFIRM);
        setConfirmationOpen(true);
    };
    const deleteSelectedObject = () => {
        setDeleteStep(DELETION_STEP_TWO_HAPPENING);
        !!teamToDelete &&
            deleteADlorTeam(teamToDelete)
                .then(() => {
                    setObjectToDelete('');
                    actions.loadOwningTeams();
                })
                .catch(() => {
                    setObjectToDelete('');
                    setConfirmationOpen(true);
                });
    };

    const navigateToTeamEditPage = teamId => {
        window.location.href = dlorAdminLink(`/team/edit/${teamId}`);
    };
    const deletionConfirmationBoxLocale = {
        confirmItMessage: {
            confirmationTitle: 'Do you want to delete this team?',
            confirmationMessage: '',
            cancelButtonLabel: 'No',
            confirmButtonLabel: 'Yes',
        },
        successMessage: {
            confirmationTitle: 'The team has been deleted.',
            confirmationMessage: '',
            confirmButtonLabel: 'Close',
        },
        errorMessage: {
            confirmationTitle: dlorTeamDeleteError?.message || dlorTeamDeleteError,
            confirmationMessage: '',
            confirmButtonLabel: 'Close',
        },
    };

    function getLocale() {
        if (!!dlorTeamDeleteError) {
            return deletionConfirmationBoxLocale.errorMessage;
        }
        if (!!dlorTeamDeleted && deleteStep === DELETION_STEP_TWO_HAPPENING) {
            return deletionConfirmationBoxLocale.successMessage;
        }
        return deletionConfirmationBoxLocale.confirmItMessage;
    }

    function localHideDeleteConfirmation() {
        setDeleteStep(null);
        setConfirmationOpen(false);
    }

    function closeConfirmationBox() {
        setConfirmationOpen(false);
    }

    return (
        <StandardPage title="Digital Learning Hub - Team management">
            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="dlor-team-delete-confirm"
                onAction={() => {
                    !!dlorTeamDeleteError || (!!dlorTeamDeleted && deleteStep === DELETION_STEP_TWO_HAPPENING)
                        ? localHideDeleteConfirmation()
                        : deleteSelectedObject();
                }}
                onClose={closeConfirmationBox}
                hideCancelButton={
                    !!dlorTeamDeleteError || (!!dlorTeamDeleted && deleteStep === DELETION_STEP_TWO_HAPPENING)
                }
                onCancelAction={closeConfirmationBox}
                isOpen={!!confirmationOpen}
                locale={getLocale()}
            />
            <DlorAdminBreadcrumbs
                breadCrumbList={[
                    {
                        title: 'Team management',
                    },
                ]}
            />
            <Grid container spacing={2} sx={{ marginBottom: '25px' }}>
                <Grid item xs={12} sx={{ textAlign: 'right' }}>
                    <Button
                        children="Add team"
                        color="primary"
                        data-testid="admin-dlor-visit-add-button"
                        onClick={() => navigateToAddPage()}
                        variant="contained"
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
                {(() => {
                    if (!!dlorTeamListLoading || !!dlorTeamDeleting) {
                        return (
                            <Grid item xs={12} md={9} sx={{ marginTop: '12px' }}>
                                <div sx={{ minHeight: '600px' }}>
                                    <InlineLoader message="Loading" />
                                </div>
                            </Grid>
                        );
                    } else if (!!dlorTeamListError) {
                        return (
                            <Grid item xs={12} md={9} sx={{ marginTop: '12px' }}>
                                <Typography variant="body1" data-testid="dlor-teamlist-error">
                                    {dlorTeamListError}
                                </Typography>
                            </Grid>
                        );
                    } else if (!dlorTeamList || dlorTeamList.length === 0) {
                        return (
                            <Grid item xs={12} md={9} sx={{ marginTop: '12px' }}>
                                <Typography variant="body1" data-testid="dlor-teamlist-noresult">
                                    We did not find any entries in the system - please try again later.
                                </Typography>
                            </Grid>
                        );
                    } else {
                        return (
                            <>
                                <Grid item sx={{ width: '100%' }} data-testid="dlor-teamlist-list">
                                    {dlorTeamList?.length > 0 &&
                                        dlorTeamList.map(team => {
                                            return (
                                                <div key={`list-team-${team?.team_id}`}>
                                                    <Grid container alignItems="center">
                                                        <Grid
                                                            item
                                                            xs={10}
                                                            data-testid={`dlor-teamlist-panel-${team?.team_id}`}
                                                        >
                                                            <Typography variant="body1">{team?.team_name}</Typography>{' '}
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            {team?.objects_count === 0 && (
                                                                <IconButton
                                                                    data-testid={`dlor-teamlist-delete-${team?.team_id}`}
                                                                    sx={{ height: '40px' }}
                                                                    onClick={() => confirmDelete(team?.team_id)}
                                                                    // disabled={team?.object_status === 'deleted'}
                                                                >
                                                                    <DeleteForeverIcon />
                                                                </IconButton>
                                                            )}
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <IconButton
                                                                data-testid={`dlor-teamlist-edit-${team?.team_id}`}
                                                                onClick={() => navigateToTeamEditPage(team?.team_id)}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container>
                                                        <Grid item xs={12} sx={{ marginBottom: '24px' }}>
                                                            {!dlorTeamListLoading &&
                                                                !dlorListError &&
                                                                !!dlorList &&
                                                                dlorList.filter(
                                                                    d => d?.object_owning_team_id === team?.team_id,
                                                                ).length > 0 && (
                                                                    <StyledObjectDetails
                                                                        data-testid={`dlor-team-object-list-${team?.team_id}`}
                                                                    >
                                                                        <summary>
                                                                            {`${team?.objects_count} ${pluraliseWord(
                                                                                'Object',
                                                                                team?.objects_count,
                                                                            )}`}
                                                                        </summary>
                                                                        {!!dlorList &&
                                                                            dlorList
                                                                                .filter(
                                                                                    d =>
                                                                                        d?.object_owning_team_id ===
                                                                                        team?.team_id,
                                                                                )
                                                                                .map(o => (
                                                                                    <ObjectListItem
                                                                                        key={`team-object-${o.object_public_uuid}`}
                                                                                        object={o}
                                                                                    />
                                                                                ))}
                                                                    </StyledObjectDetails>
                                                                )}
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            );
                                        })}
                                </Grid>
                            </>
                        );
                    }
                })()}
            </Grid>
        </StandardPage>
    );
};

DLOTeamList.propTypes = {
    actions: PropTypes.any,
    dlorTeamList: PropTypes.array,
    dlorTeamListLoading: PropTypes.bool,
    dlorTeamListError: PropTypes.any,
    dlorList: PropTypes.array,
    dlorListLoading: PropTypes.bool,
    dlorListError: PropTypes.any,
    dlorTeamDeleted: PropTypes.array,
    dlorTeamDeleting: PropTypes.bool,
    dlorTeamDeleteError: PropTypes.any,
};

export default DLOTeamList;

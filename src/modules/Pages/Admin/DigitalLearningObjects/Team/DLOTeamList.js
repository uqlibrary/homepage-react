import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import { useConfirmationState } from 'hooks';
import { dlorAdminLink } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';

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
    details: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
    },
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
    account,
}) => {
    const classes = useStyles();
    console.log('DLOTeamList l=', dlorTeamListLoading, '; e=', dlorTeamListError, '; d=', dlorTeamList);
    console.log('dlorList l=', dlorListLoading, '; e=', dlorListError, '; d=', dlorList);
    console.log('deleting l=', dlorTeamDeleting, '; e=', dlorTeamDeleted, '; d=', dlorTeamDeleteError);

    const [teamToDelete, setObjectToDelete] = React.useState(null);
    const [isDeleteConfirmOpen, showDeleteConfirmation, hideDeleteConfirmation] = useConfirmationState();

    useEffect(() => {
        if (!dlorTeamListError && !dlorTeamListLoading && !dlorTeamList) {
            actions.loadOwningTeams();
        }
    }, [actions, dlorTeamList, dlorTeamListError, dlorTeamListLoading]);

    useEffect(() => {
        if (!dlorListError && !dlorListLoading && !dlorList) {
            actions.loadCurrentDLORs();
        }
    }, [dlorList]);

    useEffect(() => {
        if (!!dlorTeamDeleteError) {
            // delete failed
            showDeleteConfirmation();
        } else if (!dlorTeamDeleting && !!dlorTeamDeleted) {
            // success
            showDeleteConfirmation();
        }
    }, [dlorTeamDeleting, dlorTeamDeleted, dlorTeamDeleteError]);

    const navigateToAddPage = () => {
        window.location.href = dlorAdminLink('/team/add');
    };

    const deleteADlorTeam = teamId => {
        return actions.deleteDlorTeam(teamId);
    };
    const confirmDelete = teamId => {
        setObjectToDelete(teamId);
        showDeleteConfirmation();
    };
    const deleteSelectedObject = () => {
        !!teamToDelete &&
            deleteADlorTeam(teamToDelete)
                .then(() => {
                    setObjectToDelete('');
                    actions.loadOwningTeams();
                })
                .catch(() => {
                    setObjectToDelete('');
                    showDeleteConfirmation();
                });
    };

    const navigateToTeamEditPage = teamId => {
        window.location.href = dlorAdminLink(`/team/edit/${teamId}`);
    };
    const navigateToDlorEditPage = uuid => {
        window.location.href = dlorAdminLink(`/edit/${uuid}`);
    };
    const deletionConfirmationBoxLocale = {
        confirmationMessage: {
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
        if (!!dlorTeamDeleted) {
            return deletionConfirmationBoxLocale.successMessage;
        }
        return deletionConfirmationBoxLocale.confirmationMessage;
    }

    return (
        <StandardPage title="Digital learning hub - Team Management">
            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="dlor-team-delete-confirm"
                onAction={() => {
                    !!dlorTeamDeleteError || !!dlorTeamDeleted ? hideDeleteConfirmation() : deleteSelectedObject();
                }}
                onClose={hideDeleteConfirmation}
                hideCancelButton={!!dlorTeamDeleteError || !!dlorTeamDeleted}
                onCancelAction={hideDeleteConfirmation}
                isOpen={isDeleteConfirmOpen}
                locale={getLocale()}
            />
            <Grid container spacing={2} style={{ marginBottom: 25 }}>
                <Grid item xs={6}>
                    <div className={classes.titleBlock}>
                        <Typography component={'p'} variant={'h6'} data-testid="dlor-detailpage-sitelabel">
                            <a href={dlorAdminLink()}>Digital learning hub admin</a>
                            <ArrowForwardIcon style={{ height: 15 }} />
                            Team management
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={6} style={{ textAlign: 'right' }}>
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
                            <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                                <div style={{ minHeight: 600 }}>
                                    <InlineLoader message="Loading" />
                                </div>
                            </Grid>
                        );
                    } else if (!!dlorTeamListError) {
                        return (
                            <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                                <Typography variant="body1" data-testid="dlor-teamlist-error">
                                    {dlorTeamListError}
                                </Typography>
                            </Grid>
                        );
                    } else if (!dlorTeamList || dlorTeamList.length === 0) {
                        return (
                            <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                                <Typography variant="body1" data-testid="dlor-teamlist-noresult">
                                    We did not find any entries in the system - please try again later.
                                </Typography>
                            </Grid>
                        );
                    } else {
                        return (
                            <>
                                <Grid item style={{ width: '100%' }} data-testid="dlor-teamlist-list">
                                    {dlorTeamList?.length > 0 &&
                                        dlorTeamList.map(team => {
                                            return (
                                                <div key={`list-team-${team?.team_id}`}>
                                                    <Grid container alignItems="center">
                                                        <Grid
                                                            item
                                                            xs={10}
                                                            data-testid={`dlor-homepage-panel-${team?.team_id}`}
                                                        >
                                                            <Typography variant="body1">{team?.team_name}</Typography>{' '}
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            {team?.objects_count === 0 && (
                                                                <IconButton
                                                                    data-testid={`dlor-homepage-delete-${team?.team_id}`}
                                                                    style={{ height: 40 }}
                                                                    onClick={() => confirmDelete(team?.team_id)}
                                                                    // disabled={team?.object_status === 'deleted'}
                                                                >
                                                                    <DeleteForeverIcon />
                                                                </IconButton>
                                                            )}
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <IconButton
                                                                data-testid={`dlor-homepage-edit-${team?.team_id}`}
                                                                onClick={() => navigateToTeamEditPage(team?.team_id)}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container>
                                                        <Grid item xs={12} style={{ marginBottom: 24 }}>
                                                            {!dlorTeamListLoading &&
                                                                !dlorListError &&
                                                                !!dlorList &&
                                                                dlorList.filter(
                                                                    d => d?.object_owning_team_id === team?.team_id,
                                                                ).length > 0 && (
                                                                    <details
                                                                        style={{ marginLeft: 20 }}
                                                                        data-testid={`dlor-team-object-list-${team?.team_id}`}
                                                                    >
                                                                        <summary>
                                                                            {`${
                                                                                team?.objects_count
                                                                            } Object${team?.objects_count > 1 && 's'}`}
                                                                        </summary>
                                                                        {!!dlorList &&
                                                                            dlorList
                                                                                .filter(
                                                                                    d =>
                                                                                        d?.object_owning_team_id ===
                                                                                        team?.team_id,
                                                                                )
                                                                                .map(o => (
                                                                                    <Grid
                                                                                        container
                                                                                        key={`team-object-${o.object_id}`}
                                                                                    >
                                                                                        <Grid item xs={1} />
                                                                                        <Grid
                                                                                            item
                                                                                            xs={9}
                                                                                            // data-testid={`dlor-homepage-panel-${o?.object_public_uuid}`}
                                                                                        >
                                                                                            <div>
                                                                                                <Typography
                                                                                                    component={'h2'}
                                                                                                    variant={'h6'}
                                                                                                >
                                                                                                    {o?.object_title}
                                                                                                </Typography>
                                                                                                <Typography
                                                                                                    variant={'p'}
                                                                                                >
                                                                                                    <p>
                                                                                                        {
                                                                                                            o?.object_summary
                                                                                                        }
                                                                                                    </p>
                                                                                                </Typography>
                                                                                            </div>
                                                                                        </Grid>
                                                                                        <Grid item xs={1}>
                                                                                            <IconButton
                                                                                                data-testid={`dlor-team-object-list-item-${o?.object_id}`}
                                                                                                onClick={() =>
                                                                                                    navigateToDlorEditPage(
                                                                                                        o?.object_public_uuid,
                                                                                                    )
                                                                                                }
                                                                                                disabled={
                                                                                                    o?.object_status ===
                                                                                                    'deleted'
                                                                                                }
                                                                                            >
                                                                                                <EditIcon />
                                                                                            </IconButton>
                                                                                        </Grid>
                                                                                        <Grid item xs={1} />
                                                                                    </Grid>
                                                                                ))}
                                                                    </details>
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
    account: PropTypes.object,
};

export default DLOTeamList;
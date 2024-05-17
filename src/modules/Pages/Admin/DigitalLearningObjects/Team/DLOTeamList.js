import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import { useConfirmationState } from 'hooks';
import { getUserPostfix } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
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
}));

export const DLOTeamList = ({ actions, dlorTeamList, dlorTeamListLoading, dlorTeamListError, account }) => {
    const classes = useStyles();
    console.log('DLOTeamList l=', dlorTeamListLoading, '; e=', dlorTeamListError, '; d=', dlorTeamList);

    const [teamToDelete, setObjectToDelete] = React.useState(null);
    const [isDeleteConfirmOpen, showDeleteConfirmation, hideDeleteConfirmation] = useConfirmationState();

    React.useEffect(() => {
        if (!dlorTeamListError && !dlorTeamListLoading && !dlorTeamList) {
            actions.loadOwningTeams();
        }
    }, [actions, dlorTeamList, dlorTeamListError, dlorTeamListLoading]);

    const navigateToAddPage = () => {
        // TODO
    };

    const deleteADlorTeam = teamId => {
        return actions.deleteDlorTeam(teamId);
    };
    const confirmDelete = teamId => {
        setObjectToDelete(teamId);
        showDeleteConfirmation();
    };
    const deleteSelectedObject = () => {
        console.log('deleteSelectedObject start');
        !!teamToDelete &&
            deleteADlorTeam(teamToDelete)
                .then(() => {
                    console.log('deleteSelectedObject delete success', teamToDelete);
                    setObjectToDelete('');
                    // setAlertNotice(''); // needed?
                    actions.loadOwningTeams();
                })
                .catch(() => {
                    console.log('deleteSelectedObject delete fail', teamToDelete);
                    setObjectToDelete('');
                    showDeleteFailureConfirmation();
                });
    };

    const adminHomepageLink = () => {
        const userString = getUserPostfix();
        return `${fullPath}/admin/dlor${userString}`;
    };

    const navigateToEditPage = teamId => {
        const userString = getUserPostfix();
        window.location.href = `${fullPath}/admin/dlor/team/edit/${teamId}${userString}`;
    };

    return (
        <StandardPage title="Digital learning hub - Team Management">
            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="dlor-team-delete-confirm"
                onAction={() => deleteSelectedObject()}
                onClose={hideDeleteConfirmation}
                onCancelAction={hideDeleteConfirmation}
                isOpen={isDeleteConfirmOpen}
                locale={{
                    confirmationTitle: 'Do you want to delete this team?',
                    confirmationMessage: '',
                    cancelButtonLabel: 'No',
                    confirmButtonLabel: 'Yes',
                }}
            />
            <Grid container spacing={2} style={{ marginBottom: 25 }}>
                <Grid item xs={6}>
                    <div className={classes.titleBlock}>
                        <Typography component={'p'} variant={'h6'} data-testid="dlor-detailpage-sitelabel">
                            <ArrowBackIcon fontSize="small" />{' '}
                            <a href={adminHomepageLink()}>Digital learning hub admin</a>
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
            <Grid container spacing={2}>
                {(() => {
                    if (!!dlorTeamListLoading) {
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
                                                <Grid
                                                    container
                                                    className={classes.listItem}
                                                    key={`list-team-${team?.team_id}`}
                                                >
                                                    <Grid
                                                        item
                                                        xs={9}
                                                        className={classes.sidebyside}
                                                        data-testid={`dlor-homepage-panel-${team?.team_id}`}
                                                    >
                                                        <div>
                                                            <Typography component={'span'}>
                                                                {team?.team_name}
                                                            </Typography>{' '}
                                                            <Typography component={'span'}>
                                                                ({team?.objects_count})
                                                            </Typography>
                                                        </div>
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
                                                            onClick={() => navigateToEditPage(team?.team_id)}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
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
    account: PropTypes.object,
};

export default DLOTeamList;

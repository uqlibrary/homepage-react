import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

const useStyles = makeStyles(theme => ({}));

export const TeamList = ({ actions, dlorTeamList, dlorTeamListLoading, dlorTeamListError, account }) => {
    const classes = useStyles();
    console.log('TeamList l=', dlorTeamListLoading, '; e=', dlorTeamListError, '; d=', dlorTeamList);

    React.useEffect(() => {
        if (!dlorTeamListError && !dlorTeamListLoading && !dlorTeamList) {
            actions.loadOwningTeams();
        }
    }, [actions, dlorTeamList, dlorTeamListError, dlorTeamListLoading]);

    const navigateToAddPage = () => {
        // TODO
    };

    return (
        <StandardPage title="Digital learning hub - Team Management">
            <Grid container spacing={2} style={{ marginBottom: 25 }}>
                <Grid item xs={12} style={{ textAlign: 'right' }}>
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
                                                        <IconButton onClick={() => navigateToEditPage(team?.team_name)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <IconButton
                                                            data-testid={`dlor-homepage-delete-${team?.team_name}`}
                                                            style={{ height: 40 }}
                                                            onClick={() => confirmDelete(team?.team_name)}
                                                            // disabled={team?.object_status === 'deleted'}
                                                        >
                                                            <DeleteForeverIcon />
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

TeamList.propTypes = {
    actions: PropTypes.any,
    dlorTeamList: PropTypes.array,
    dlorTeamListLoading: PropTypes.bool,
    dlorTeamListError: PropTypes.any,
    account: PropTypes.object,
};

export default TeamList;

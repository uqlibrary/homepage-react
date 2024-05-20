import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';

import DlOTeamForm from 'modules/Pages/Admin/DigitalLearningObjects/Team/DlOTeamForm';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
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
    errorMessage: {
        color: theme.palette.error.light,
        fontSize: '0.8em',
        marginTop: 2,
    },
}));

export const DLOTeamEdit = ({
    actions,
    dlorTeam,
    dlorTeamLoading,
    dlorTeamError,
    dlorItemUpdating,
    dlorUpdatedItemError,
    dlorUpdatedItem,
}) => {
    const { dlorTeamId } = useParams();
    const classes = useStyles();
    console.log('DLOTeamEdit', dlorTeamId, ' l=', dlorTeamLoading, '; e=', dlorTeamError, '; d=', dlorTeam);
    console.log(
        'DLOTeamEdit dlorUpdatedItem l=',
        dlorItemUpdating,
        '; e=',
        dlorUpdatedItemError,
        '; d=',
        dlorUpdatedItem,
    );

    // const formDefaults = {
    //     team_id: dlorTeam.team_id,
    //     team_name: dlorTeam.team_name,
    //     team_email: dlorTeam.team_email,
    //     team_manager: dlorTeam.team_manager,
    //     objects_count: dlorTeam.objects_count,
    // };

    useEffect(() => {
        if (!!dlorTeamId) {
            actions.loadADLORTeam(dlorTeamId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dlorTeamId]);

    console.log('DLOTeamEdit formDefaults=', dlorTeam);
    return (
        <StandardPage title="Digital learning hub - Edit Team">
            <Grid container spacing={2} style={{ marginBottom: 25 }}>
                <Grid item xs={12}>
                    <div className={classes.titleBlock}>
                        <Typography component={'p'} variant={'h6'} data-testid="dlor-detailpage-sitelabel">
                            <a data-testid="dlor-edit-form-homelink" href={dlorAdminLink()}>
                                Digital learning hub admin
                            </a>
                            <ArrowForwardIcon style={{ height: 15 }} />
                            <a data-testid="dlor-edit-form-uplink" href={dlorAdminLink('/team/manage')}>
                                Team management
                            </a>
                            <ArrowForwardIcon style={{ height: 15 }} />
                            Edit team {dlorTeam?.team_name}
                        </Typography>
                    </div>
                </Grid>
            </Grid>
            <DlOTeamForm
                actions={actions}
                formDefaults={dlorTeam}
                dlorTeamLoading={dlorTeamLoading}
                dlorTeamError={dlorTeamError}
                dlorTeamSaving={dlorItemUpdating}
                dlorSavedTeamError={dlorUpdatedItemError}
                dlorSavedTeam={dlorUpdatedItem}
                mode="edit"
            />
        </StandardPage>
    );
};

DLOTeamEdit.propTypes = {
    actions: PropTypes.any,
    dlorTeam: PropTypes.object,
    dlorTeamLoading: PropTypes.bool,
    dlorTeamError: PropTypes.any,
    account: PropTypes.object,
    dlorItemUpdating: PropTypes.bool,
    dlorUpdatedItemError: PropTypes.any,
    dlorUpdatedItem: PropTypes.object,
};

export default DLOTeamEdit;

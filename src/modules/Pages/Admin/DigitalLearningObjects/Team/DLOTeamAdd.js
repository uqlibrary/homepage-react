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

export const DLOTeamAdd = ({ actions, dlorItemCreating, dlorCreatedItemError, dlorCreatedItem }) => {
    const classes = useStyles();

    const formDefaults = {
        team_name: '',
        team_email: '',
        team_manager: '',
    };

    return (
        <StandardPage title="Digital Learning Hub - Add a new Team">
            <Grid container spacing={2} style={{ marginBottom: 25 }}>
                <Grid item xs={12}>
                    <div className={classes.titleBlock}>
                        <Typography component={'p'} variant={'h6'} data-testid="dlor-detailpage-sitelabel">
                            <a data-testid="dlor-add-form-homelink" href={dlorAdminLink()}>
                                Digital Learning Hub admin
                            </a>
                            <ArrowForwardIcon style={{ height: 15 }} />
                            <a data-testid="dlor-add-form-uplink" href={dlorAdminLink('/team/manage')}>
                                Team management
                            </a>
                            <ArrowForwardIcon style={{ height: 15 }} />
                            Add new team
                        </Typography>
                    </div>
                </Grid>
            </Grid>
            <DlOTeamForm
                actions={actions}
                formDefaults={formDefaults}
                dlorTeamSaving={dlorItemCreating}
                dlorSavedTeamError={dlorCreatedItemError}
                dlorSavedTeam={dlorCreatedItem}
                mode="add"
            />
        </StandardPage>
    );
};

DLOTeamAdd.propTypes = {
    actions: PropTypes.any,
    dlorTeam: PropTypes.object,
    dlorTeamLoading: PropTypes.bool,
    dlorTeamError: PropTypes.any,
    dlorItemCreating: PropTypes.bool,
    dlorCreatedItemError: PropTypes.any,
    dlorCreatedItem: PropTypes.object,
};

export default DLOTeamAdd;

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';

import DlOSeriesForm from 'modules/Pages/Admin/DigitalLearningObjects/Series/DlOSeriesForm';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { dlorAdminLink } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import VisitHomepage from 'modules/Pages/Admin/DigitalLearningObjects//SharedDlorComponents/VisitHomepage';

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
}) => {
    const { dlorSeriesId } = useParams();
    const classes = useStyles();

    console.log('dlorList l=', dlorListLoading, '; e=', dlorListError, '; d=', dlorList);

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
                            Edit series {dlorSeries?.data?.series_name}
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={1}>
                    <VisitHomepage />
                </Grid>
            </Grid>
            <DlOSeriesForm
                actions={actions}
                formDefaults={dlorSeries?.data}
                dlorSeriesLoading={dlorSeriesLoading}
                dlorSeriesError={dlorSeriesError}
                dlorSeriesSaving={dlorItemUpdating}
                dlorSavedSeriesError={dlorUpdatedItemError}
                dlorSavedSeries={dlorUpdatedItem}
                dlorListLoading={dlorListLoading}
                dlorListError={dlorListError}
                dlorList={dlorList}
                mode="edit"
            />
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

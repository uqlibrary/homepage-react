import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';

import { pathConfig } from 'config/routes';
import StandardAuthPage from '../../SharedComponents/StandardAuthPage/StandardAuthPage';
import locale from '../../testTag.locale';
import AuthWrapper from '../../SharedComponents/AuthWrapper/AuthWrapper';
import { PERMISSIONS, ROLES } from '../../config/auth';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

const Dashboard = ({ actions /* , initDashboard*/, initDashboardLoading, initDashboardError }) => {
    const classes = useStyles();

    useEffect(() => {
        actions.loadDashboard();
    }, [actions]);

    return (
        <StandardAuthPage title={locale.form.pageTitle} requiredPermissions={ROLES.all} inclusive={false}>
            <div className={classes.root}>
                <Grid container spacing={3} padding={3}>
                    <AuthWrapper requiredPermissions={[PERMISSIONS.can_inspect]}>
                        <Grid item xs>
                            {initDashboardLoading && !initDashboardError ? (
                                <Skeleton animation="wave" height={150} />
                            ) : (
                                <Paper className={classes.paper}>
                                    <Link
                                        to={`${pathConfig.admin.testntaginspection}?user=uqtesttag`}
                                        data-testid="linkInspection"
                                    >
                                        Inspections
                                    </Link>
                                </Paper>
                            )}
                        </Grid>
                    </AuthWrapper>
                    <Grid item xs>
                        {initDashboardLoading && !initDashboardError ? (
                            <Skeleton animation="wave" height={150} />
                        ) : (
                            <Paper className={classes.paper}>xs</Paper>
                        )}
                    </Grid>
                    <Grid item xs>
                        {initDashboardLoading && !initDashboardError ? (
                            <Skeleton animation="wave" height={150} />
                        ) : (
                            <Paper className={classes.paper}>xs</Paper>
                        )}
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs>
                        {initDashboardLoading && !initDashboardError ? (
                            <Skeleton animation="wave" height={150} />
                        ) : (
                            <Paper className={classes.paper}>xs</Paper>
                        )}
                    </Grid>
                    <Grid item xs>
                        {initDashboardLoading && !initDashboardError ? (
                            <Skeleton animation="wave" height={150} />
                        ) : (
                            <Paper className={classes.paper}>xs</Paper>
                        )}
                    </Grid>
                </Grid>
            </div>
        </StandardAuthPage>
    );
};

Dashboard.propTypes = {
    actions: PropTypes.object,
    initDashboard: PropTypes.any,
    initDashboardLoading: PropTypes.bool,
    initDashboardError: PropTypes.bool,
};

export default React.memo(Dashboard);

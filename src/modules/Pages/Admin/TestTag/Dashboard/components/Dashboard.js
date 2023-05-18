import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
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
    Card: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

const Dashboard = ({ actions /* , initDashboard*/, initDashboardLoading, initDashboardLoaded, initDashboardError }) => {
    const classes = useStyles();

    useEffect(() => {
        if (!initDashboardLoaded) actions.loadDashboard();
    }, [actions, initDashboardLoaded]);

    return (
        <StandardAuthPage title={locale.form.pageTitle} requiredPermissions={ROLES.all} inclusive={false}>
            <div className={classes.root}>
                <Grid container spacing={3} padding={3}>
                    <AuthWrapper requiredPermissions={[PERMISSIONS.can_inspect]}>
                        <Grid item xs>
                            {initDashboardLoading && !initDashboardError ? (
                                <Skeleton animation="wave" height={150} />
                            ) : (
                                <Card className={classes.Card}>
                                    <Link
                                        to={`${pathConfig.admin.testntaginspection}?user=uqtesttag`}
                                        data-testid="linkInspection"
                                    >
                                        Inspections
                                    </Link>
                                </Card>
                            )}
                        </Grid>
                    </AuthWrapper>
                    <Grid item xs>
                        {initDashboardLoading && !initDashboardError ? (
                            <Skeleton animation="wave" height={150} />
                        ) : (
                            <Card className={classes.Card}>xs</Card>
                        )}
                    </Grid>
                    <Grid item xs>
                        {initDashboardLoading && !initDashboardError ? (
                            <Skeleton animation="wave" height={150} />
                        ) : (
                            <Card className={classes.Card}>xs</Card>
                        )}
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs>
                        {initDashboardLoading && !initDashboardError ? (
                            <Skeleton animation="wave" height={150} />
                        ) : (
                            <Card className={classes.Card}>xs</Card>
                        )}
                    </Grid>
                    <Grid item xs>
                        {initDashboardLoading && !initDashboardError ? (
                            <Skeleton animation="wave" height={150} />
                        ) : (
                            <Card className={classes.Card}>xs</Card>
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
    initDashboardLoaded: PropTypes.bool,
    initDashboardError: PropTypes.bool,
};

export default React.memo(Dashboard);

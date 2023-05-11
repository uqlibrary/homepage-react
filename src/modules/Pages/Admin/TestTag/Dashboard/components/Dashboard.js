import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

import TestTagHeader from '../../SharedComponents/TestTagHeader/TestTagHeader';
import locale from '../../testTag.locale';

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

const Dashboard = ({ actions, initDashboard, initDashboardLoading, initDashboardError }) => {
    const classes = useStyles();

    useEffect(() => {
        actions.loadDashboard();
    }, [actions]);

    const headerDepartmentText = React.useMemo(
        () =>
            initDashboard?.user
                ? locale?.form?.pageSubtitle?.(
                      initDashboard?.user?.department_display_name ??
                          /* istanbul ignore next */ initDashboard?.user?.user_department ??
                          /* istanbul ignore next */ '',
                  )
                : /* istanbul ignore next */ '',
        [initDashboard],
    );

    return (
        <StandardPage title={locale.form.pageTitle}>
            <TestTagHeader
                departmentText={headerDepartmentText}
                requiredText={locale?.form?.requiredText ?? /* istanbul ignore next */ ''}
            />
            <div className={classes.root}>
                <Grid container spacing={3} padding={3}>
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
        </StandardPage>
    );
};

Dashboard.propTypes = {
    actions: PropTypes.object,
    initDashboard: PropTypes.any,
    initDashboardLoading: PropTypes.bool,
    initDashboardError: PropTypes.bool,
};

export default React.memo(Dashboard);

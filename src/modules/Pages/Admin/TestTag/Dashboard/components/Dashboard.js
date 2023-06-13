import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import clsx from 'clsx';

import Avatar from '@material-ui/core/Avatar';
import InspectionIcon from '@material-ui/icons/Search';
import InspectionDeviceIcon from '@material-ui/icons/Build';

import { pathConfig } from '../../../../../../config/pathConfig';
import StandardAuthPage from '../../SharedComponents/StandardAuthPage/StandardAuthPage';
import locale from '../../testTag.locale';
import AuthWrapper from '../../SharedComponents/AuthWrapper/AuthWrapper';
import { PERMISSIONS, ROLES } from '../../config/auth';
import Panel from './Panel';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    flexParent: {
        display: 'flex',
    },
    card: {
        flex: 1,
        color: theme.palette.text.secondary,
    },
    centreAlignParent: {
        display: 'flex',
        flexDirection: 'column',
    },
    centreAlign: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
}));

const Dashboard = ({
    actions,
    dashboardConfig,
    dashboardConfigLoading,
    dashboardConfigLoaded,
    dashboardConfigError,
}) => {
    const pageLocale = locale.pages.dashboard;
    const classes = useStyles();

    useEffect(() => {
        if (!dashboardConfigLoaded) actions.loadDashboard();
    }, [actions, dashboardConfigLoaded]);

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={ROLES.all}
            inclusive={false}
        >
            <div className={classes.root}>
                <Grid container spacing={3} padding={3}>
                    <AuthWrapper requiredPermissions={[PERMISSIONS.can_inspect]}>
                        <Grid item xs={12} sm className={classes.flexParent}>
                            {dashboardConfigLoading && !dashboardConfigError ? (
                                <Skeleton animation="wave" height={300} width={'100%'} />
                            ) : (
                                <Panel
                                    title={pageLocale.panel.inspections.title}
                                    icon={
                                        <Avatar aria-label="inspections" style={{ backgroundColor: '#388E3C' }}>
                                            <InspectionIcon />
                                        </Avatar>
                                    }
                                    className={clsx([classes.card, classes.centreAlignParent])}
                                    contentProps={{ className: classes.centreAlign }}
                                >
                                    <Link
                                        to={`${pathConfig.admin.testntaginspect}?user=uqtesttag`}
                                        data-testid="linkInspection"
                                    >
                                        {pageLocale.panel.inspections.link}
                                    </Link>
                                </Panel>
                            )}
                        </Grid>
                    </AuthWrapper>
                    <Grid item xs={12} sm className={classes.flexParent}>
                        {dashboardConfigLoading && !dashboardConfigError ? (
                            <Skeleton animation="wave" height={300} width={'100%'} />
                        ) : (
                            <Panel
                                title={pageLocale.panel.assets.title}
                                icon={
                                    <Avatar aria-label="assets" style={{ backgroundColor: '#FFA726' }}>
                                        <InspectionIcon />
                                    </Avatar>
                                }
                                className={classes.card}
                            >
                                <Typography component={'div'} variant={'h4'}>
                                    {dashboardConfig?.retest?.soon}
                                </Typography>
                                <Typography variant={'body1'}>
                                    <AuthWrapper
                                        requiredPermissions={[PERMISSIONS.can_see_reports]}
                                        fallback={pageLocale.panel.assets.subtext(
                                            `${dashboardConfig?.periodLength} ${dashboardConfig?.periodType}`,
                                        )}
                                    >
                                        {pageLocale.panel.assets.subtext(
                                            <Link
                                                to={`${pathConfig.admin.testntagreportinspectionsdue}?period=3`}
                                                data-testid="dashboardLinkReportInspectionsDue"
                                            >
                                                {`${dashboardConfig?.periodLength} ${dashboardConfig?.periodType}`}
                                            </Link>,
                                        )}
                                    </AuthWrapper>
                                </Typography>
                            </Panel>
                        )}
                    </Grid>
                    <Grid item xs={12} sm className={classes.flexParent}>
                        {dashboardConfigLoading && !dashboardConfigError ? (
                            <Skeleton animation="wave" height={300} width={'100%'} />
                        ) : (
                            <Panel
                                title={pageLocale.panel.inspectionDevices.title}
                                icon={
                                    <Avatar aria-label="inspection devices" style={{ backgroundColor: '#0288D2' }}>
                                        <InspectionDeviceIcon />
                                    </Avatar>
                                }
                                className={classes.card}
                            >
                                <Typography component={'div'} variant={'h4'}>
                                    {dashboardConfig?.recalibration?.soon}
                                </Typography>
                                <Typography variant={'body1'}>
                                    <AuthWrapper
                                        requiredPermissions={[PERMISSIONS.can_see_reports]}
                                        fallback={pageLocale.panel.assets.subtext(
                                            `${dashboardConfig?.periodLength} ${dashboardConfig?.periodType}`,
                                        )}
                                    >
                                        {pageLocale.panel.assets.subtext(
                                            <Link
                                                to={pathConfig.admin.testntagreport}
                                                data-testid="dashboardLinkReportInspectionDevices"
                                            >
                                                {`${dashboardConfig?.periodLength} ${dashboardConfig?.periodType}`}
                                            </Link>,
                                        )}
                                    </AuthWrapper>
                                </Typography>
                            </Panel>
                        )}
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <AuthWrapper requiredPermissions={[PERMISSIONS.can_inspect]}>
                        <Grid item xs={12} sm className={classes.flexParent}>
                            {dashboardConfigLoading && !dashboardConfigError ? (
                                <Skeleton animation="wave" height={300} width={'100%'} />
                            ) : (
                                <Panel
                                    title={pageLocale.panel.management.title}
                                    className={classes.card}
                                    headerProps={{ titleTypographyProps: { variant: 'body2' } }}
                                >
                                    <List component="nav" aria-label="management actions">
                                        {pageLocale.panel.management.links.map(link => {
                                            if (!!link?.permissions) {
                                                return (
                                                    <AuthWrapper
                                                        requiredPermissions={link.permissions}
                                                        key={`listItem${link.title.replace(' ', '')}`}
                                                    >
                                                        <ListItem button component={Link} to={link.path}>
                                                            {link.icon && <ListItemIcon>{link.icon}</ListItemIcon>}
                                                            <ListItemText primary={link.title} />
                                                        </ListItem>
                                                    </AuthWrapper>
                                                );
                                            } else {
                                                return (
                                                    <ListItem
                                                        button
                                                        key={`listItem${link.title.replace(' ', '')}`}
                                                        component={Link}
                                                        to={link.path}
                                                    >
                                                        {link.icon && <ListItemIcon>{link.icon}</ListItemIcon>}
                                                        <ListItemText primary={link.title} />
                                                    </ListItem>
                                                );
                                            }
                                        })}
                                    </List>
                                </Panel>
                            )}
                        </Grid>
                    </AuthWrapper>
                    <AuthWrapper requiredPermissions={[PERMISSIONS.can_see_reports]}>
                        <Grid item xs={12} sm className={classes.flexParent}>
                            {dashboardConfigLoading && !dashboardConfigError ? (
                                <Skeleton animation="wave" height={300} width={'100%'} />
                            ) : (
                                <Panel
                                    title={pageLocale.panel.reporting.title}
                                    className={classes.card}
                                    headerProps={{ titleTypographyProps: { variant: 'body2' } }}
                                >
                                    <List component="nav" aria-label="reporting actions">
                                        {pageLocale.panel.reporting.links.map(link => {
                                            if (!!link?.permissions) {
                                                return (
                                                    <AuthWrapper
                                                        requiredPermissions={link.permissions}
                                                        key={`listItem${link.title.replace(' ', '')}`}
                                                    >
                                                        <ListItem button component={Link} to={link.path}>
                                                            {link.icon && <ListItemIcon>{link.icon}</ListItemIcon>}
                                                            <ListItemText primary={link.title} />
                                                        </ListItem>
                                                    </AuthWrapper>
                                                );
                                            } else {
                                                return (
                                                    <ListItem
                                                        button
                                                        key={`listItem${link.title.replace(' ', '')}`}
                                                        component={Link}
                                                        to={link.path}
                                                    >
                                                        {link.icon && <ListItemIcon>{link.icon}</ListItemIcon>}
                                                        <ListItemText primary={link.title} />
                                                    </ListItem>
                                                );
                                            }
                                        })}
                                    </List>
                                </Panel>
                            )}
                        </Grid>
                    </AuthWrapper>
                </Grid>
            </div>
        </StandardAuthPage>
    );
};

Dashboard.propTypes = {
    actions: PropTypes.object,
    dashboardConfig: PropTypes.any,
    dashboardConfigLoading: PropTypes.bool,
    dashboardConfigLoaded: PropTypes.bool,
    dashboardConfigError: PropTypes.bool,
};

export default React.memo(Dashboard);

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

import Avatar from '@material-ui/core/Avatar';
import InspectionIcon from '@material-ui/icons/Search';
import UsersIcon from '@material-ui/icons/People';
import AssetTypeIcon from '@material-ui/icons/DevicesOther';
import LocationIcon from '@material-ui/icons/MyLocation';
import InspectionDeviceIcon from '@material-ui/icons/Build';
import BulkUpdateIcon from '@material-ui/icons/DynamicFeed';
import OutForRepairIcon from '@material-ui/icons/ExitToApp';
import AssetsInspectedByDateIcon from '@material-ui/icons/EventNote';

import { pathConfig } from 'config/routes';
import StandardAuthPage from '../../SharedComponents/StandardAuthPage/StandardAuthPage';
import locale from '../../testTag.locale';
import AuthWrapper from '../../SharedComponents/AuthWrapper/AuthWrapper';
import { PERMISSIONS, ROLES } from '../../config/auth';
import Panel from './Panel';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    Card: {
        color: theme.palette.text.secondary,
    },
}));

const managementLinks = [
    {
        title: 'USERS',
        icon: <UsersIcon />,
        permissions: [PERMISSIONS.can_admin],
        path: '#',
    },
    {
        title: 'ASSET TYPES',
        icon: <AssetTypeIcon />,
        path: '#',
    },
    {
        title: 'LOCATIONS',
        icon: <LocationIcon />,
        permissions: [PERMISSIONS.can_admin],
        path: '#',
    },
    {
        title: 'INSPECTION DEVICES',
        icon: <InspectionDeviceIcon />,
        path: '#',
    },
    {
        title: 'BULK ASSET UPDATE',
        icon: <BulkUpdateIcon />,
        path: '#',
    },
    {
        title: 'INSPECTIONS',
        icon: <InspectionIcon />,
        path: '#',
    },
];
const reportingLinks = [
    {
        title: 'INSPECTION DEVICES DUE RECALIBRATION',
        icon: <InspectionDeviceIcon />,
        path: '#',
    },
    {
        title: 'ASSETS DUE NEXT INSPECTION',
        icon: <InspectionIcon />,
        path: '#',
    },
    {
        title: 'ASSETS OUT FOR REPAIR',
        icon: <OutForRepairIcon />,
        path: '#',
    },
    {
        title: 'ASSETS INSPECTED BY BUILDING AND DATE RANGE',
        icon: <AssetsInspectedByDateIcon />,
        path: '#',
    },
];

const Dashboard = ({
    actions,
    dashboardConfig,
    dashboardConfigLoading,
    dashboardConfigLoaded,
    dashboardConfigError,
}) => {
    const classes = useStyles();

    useEffect(() => {
        if (!dashboardConfigLoaded) actions.loadDashboard();
    }, [actions, dashboardConfigLoaded]);

    return (
        <StandardAuthPage title={locale.form.pageTitle} requiredPermissions={ROLES.all} inclusive={false}>
            <div className={classes.root}>
                <Grid container spacing={3} padding={3}>
                    <AuthWrapper requiredPermissions={[PERMISSIONS.can_inspect]}>
                        <Grid item xs>
                            {dashboardConfigLoading && !dashboardConfigError ? (
                                <Skeleton animation="wave" height={300} />
                            ) : (
                                <Panel
                                    title="INSPECTIONS"
                                    icon={
                                        <Avatar aria-label="inspections" style={{ backgroundColor: '#388E3C' }}>
                                            <InspectionIcon />
                                        </Avatar>
                                    }
                                    className={classes.Card}
                                >
                                    <Link
                                        to={`${pathConfig.admin.testntaginspection}?user=uqtesttag`}
                                        data-testid="linkInspection"
                                    >
                                        Begin test and tagging of assets
                                    </Link>
                                </Panel>
                            )}
                        </Grid>
                    </AuthWrapper>
                    <Grid item xs>
                        {dashboardConfigLoading && !dashboardConfigError ? (
                            <Skeleton animation="wave" height={300} />
                        ) : (
                            <Panel
                                title="ASSETS"
                                icon={
                                    <Avatar aria-label="assets" style={{ backgroundColor: '#FFA726' }}>
                                        <InspectionIcon />
                                    </Avatar>
                                }
                                className={classes.Card}
                            >
                                <Typography component={'div'} variant={'h4'}>
                                    {dashboardConfig?.retest?.soon}
                                </Typography>
                                <Typography variant={'body1'}>
                                    {`needing a retest in the next ${dashboardConfig?.periodLength} ${dashboardConfig?.periodType}.`}
                                </Typography>
                            </Panel>
                        )}
                    </Grid>
                    <Grid item xs>
                        {dashboardConfigLoading && !dashboardConfigError ? (
                            <Skeleton animation="wave" height={300} />
                        ) : (
                            <Panel
                                title="INSPECTION DEVICES"
                                icon={
                                    <Avatar aria-label="inspection devices" style={{ backgroundColor: '#0288D2' }}>
                                        <InspectionDeviceIcon />
                                    </Avatar>
                                }
                                className={classes.Card}
                            >
                                <Typography component={'div'} variant={'h4'}>
                                    {dashboardConfig?.recalibration?.soon}
                                </Typography>
                                <Typography variant={'body1'}>
                                    {`needing a recalibration in the next ${dashboardConfig?.periodLength} ${dashboardConfig?.periodType}.`}
                                </Typography>
                            </Panel>
                        )}
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs>
                        {dashboardConfigLoading && !dashboardConfigError ? (
                            <Skeleton animation="wave" height={300} />
                        ) : (
                            <Panel
                                title="MANAGEMENT"
                                className={classes.Card}
                                headerProps={{ titleTypographyProps: { variant: 'body2' } }}
                            >
                                <List component="nav" aria-label="management actions">
                                    {managementLinks.map(link => {
                                        if (!!link?.permissions) {
                                            return (
                                                <AuthWrapper
                                                    requiredPermissions={link.permissions}
                                                    key={`listItem${link.title.replace(' ', '')}`}
                                                >
                                                    <ListItem button>
                                                        {link.icon && <ListItemIcon>{link.icon}</ListItemIcon>}
                                                        <ListItemText primary={link.title} />
                                                    </ListItem>
                                                </AuthWrapper>
                                            );
                                        } else {
                                            return (
                                                <ListItem button key={`listItem${link.title.replace(' ', '')}`}>
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
                    <AuthWrapper requiredPermissions={[PERMISSIONS.can_see_reports]}>
                        <Grid item xs>
                            {dashboardConfigLoading && !dashboardConfigError ? (
                                <Skeleton animation="wave" height={300} />
                            ) : (
                                <Panel
                                    title="REPORTING"
                                    className={classes.Card}
                                    headerProps={{ titleTypographyProps: { variant: 'body2' } }}
                                >
                                    <List component="nav" aria-label="management actions">
                                        {reportingLinks.map(link => {
                                            return (
                                                <ListItem button key={`listItem${link.title.replace(' ', '')}`}>
                                                    {link.icon && <ListItemIcon>{link.icon}</ListItemIcon>}
                                                    <ListItemText primary={link.title} />
                                                </ListItem>
                                            );
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

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import clsx from 'clsx';

import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import InspectionIcon from '@material-ui/icons/Search';
import InspectionDeviceIcon from '@material-ui/icons/Build';
import AssetIcon from '@material-ui/icons/Power';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import ConfirmationAlert from '../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import StandardAuthPage from '../../SharedComponents/StandardAuthPage/StandardAuthPage';
import AuthWrapper from '../../SharedComponents/AuthWrapper/AuthWrapper';
import { pathConfig } from '../../../../../../config/pathConfig';
import locale from '../../testTag.locale';
import { PERMISSIONS, ROLES } from '../../config/auth';
import { useConfirmationAlert } from '../../helpers/hooks';

const componentId = 'dashboard';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    flexParent: {
        display: 'flex',
    },
    card: {
        flex: 1,
    },
    centreAlignParent: {
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.down('sm')]: {
            minHeight: '12rem',
            height: '100%',
        },
    },
    centreAlign: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '-30px',
    },
    overDueText: {
        color: theme.palette.error.main,
        textAlign: 'center',
    },
    dueText: {
        textAlign: 'center',
    },
    testButton: {
        textAlign: 'center',
        width: '100%',
    },
}));

const Dashboard = ({ actions, dashboardConfig, dashboardConfigLoading, dashboardConfigError }) => {
    const theme = useTheme();
    const pageLocale = locale.pages.dashboard;
    const classes = useStyles();

    const onCloseConfirmationAlert = () => actions.clearDashboardError();
    const { confirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
        onClose: onCloseConfirmationAlert,
        errorMessage: dashboardConfigError,
    });

    React.useEffect(() => {
        actions.loadDashboard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const retestClass = dashboardConfig?.retest?.overdue > 0 ? classes.overDueText : classes.dueText;
    const recalibrationClass = dashboardConfig?.recalibration?.overdue > 0 ? classes.overDueText : classes.dueText;

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
                                <Skeleton
                                    animation="wave"
                                    height={300}
                                    width={'100%'}
                                    id={`${componentId}-${pageLocale.panel.inspections.id}-skeleton`}
                                    data-testid={`${componentId}-${pageLocale.panel.inspections.id}-skeleton`}
                                />
                            ) : (
                                <StandardCard
                                    title={pageLocale.panel.inspections.title}
                                    primaryHeader
                                    headerProps={{
                                        avatar: (
                                            <Avatar aria-label="inspections" style={{ backgroundColor: 'white' }}>
                                                <InspectionIcon style={{ color: theme.palette.primary.light }} />
                                            </Avatar>
                                        ),
                                    }}
                                    smallTitle
                                    subCard
                                    className={clsx([classes.card, classes.centreAlignParent])}
                                    contentProps={{ className: classes.centreAlign }}
                                    standardCardId={`${componentId}-${pageLocale.panel.inspections.id}-panel`}
                                >
                                    <Link
                                        to={pathConfig.admin.testntaginspect}
                                        id={`${componentId}-${pageLocale.panel.inspections.id}-link`}
                                        data-testid={`${componentId}-${pageLocale.panel.inspections.id}-link`}
                                    >
                                        {pageLocale.panel.inspections.link}
                                    </Link>
                                </StandardCard>
                            )}
                        </Grid>
                    </AuthWrapper>
                    <Grid item xs={12} md className={classes.flexParent}>
                        {dashboardConfigLoading && !dashboardConfigError ? (
                            <Skeleton
                                animation="wave"
                                height={300}
                                width={'100%'}
                                id={`${componentId}-${pageLocale.panel.assets.id}-skeleton`}
                                data-testid={`${componentId}-${pageLocale.panel.assets.id}-skeleton`}
                            />
                        ) : (
                            <StandardCard
                                title={pageLocale.panel.assets.title}
                                smallTitle
                                subCard
                                primaryHeader
                                headerProps={{
                                    avatar: (
                                        <Avatar aria-label="assets" style={{ backgroundColor: 'white' }}>
                                            <AssetIcon style={{ color: theme.palette.primary.light }} />
                                        </Avatar>
                                    ),
                                }}
                                className={classes.card}
                                standardCardId={`${componentId}-${pageLocale.panel.assets.id}-panel`}
                            >
                                <Grid container style={{ marginBottom: 5 }}>
                                    <Grid item xs={6}>
                                        <Box borderRight={1} borderColor="grey.500">
                                            <Typography component={'div'} variant={'h4'} className={classes.dueText}>
                                                {`${dashboardConfig?.retest?.soon}`}
                                            </Typography>
                                            <Typography component={'div'} variant={'h6'} className={classes.dueText}>
                                                {pageLocale.panel.assets.upcomingText}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography component={'div'} variant={'h4'} className={retestClass}>
                                            {`${dashboardConfig?.retest?.overdue}`}
                                        </Typography>
                                        <Typography component={'div'} variant={'h6'} className={retestClass}>
                                            {pageLocale.panel.assets.overdueText}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Typography variant={'body1'} style={{ paddingTop: 5 }}>
                                    <AuthWrapper
                                        requiredPermissions={[PERMISSIONS.can_see_reports]}
                                        fallback={pageLocale.panel.assets.subtext(
                                            pageLocale.config.pluraliser(
                                                `${
                                                    dashboardConfig?.reinspectionPeriodLength
                                                } ${dashboardConfig?.reinspectionPeriodType?.toLowerCase()}`,
                                                dashboardConfig?.reinspectionPeriodLength,
                                            ),
                                        )}
                                    >
                                        {pageLocale.panel.assets.subtextLink(
                                            <Link
                                                to={`${pathConfig.admin.testntagreportinspectionsdue}?period=${dashboardConfig?.reinspectionPeriodLength}`}
                                                id={`${componentId}-${pageLocale.panel.assets.id}-link`}
                                                data-testid={`${componentId}-${pageLocale.panel.assets.id}-link`}
                                            >
                                                {pageLocale.panel.assets.subtextLinkStart}
                                            </Link>,
                                            pageLocale.config.pluraliser(
                                                `${
                                                    dashboardConfig?.reinspectionPeriodLength
                                                } ${dashboardConfig?.reinspectionPeriodType?.toLowerCase()}`,
                                                dashboardConfig?.reinspectionPeriodLength,
                                            ),
                                        )}
                                    </AuthWrapper>
                                </Typography>
                            </StandardCard>
                        )}
                    </Grid>
                    <Grid item xs={12} md className={classes.flexParent}>
                        {dashboardConfigLoading && !dashboardConfigError ? (
                            <Skeleton
                                animation="wave"
                                height={300}
                                width={'100%'}
                                id={`${componentId}-${pageLocale.panel.inspectionDevices.id}-skeleton`}
                                data-testid={`${componentId}-${pageLocale.panel.inspectionDevices.id}-skeleton`}
                            />
                        ) : (
                            <StandardCard
                                title={pageLocale.panel.inspectionDevices.title}
                                smallTitle
                                subCard
                                primaryHeader
                                headerProps={{
                                    avatar: (
                                        <Avatar aria-label="inspection devices" style={{ backgroundColor: 'white' }}>
                                            <InspectionDeviceIcon style={{ color: theme.palette.primary.light }} />
                                        </Avatar>
                                    ),
                                }}
                                className={classes.card}
                                standardCardId={`${componentId}-${pageLocale.panel.inspectionDevices.id}-panel`}
                            >
                                <Grid container style={{ marginBottom: 5 }}>
                                    <Grid item xs={6}>
                                        <Box borderRight={1} borderColor="grey.500">
                                            <Typography component={'div'} variant={'h4'} className={classes.dueText}>
                                                {`${dashboardConfig?.recalibration?.soon}`}
                                            </Typography>
                                            <Typography component={'div'} variant={'h6'} className={classes.dueText}>
                                                {pageLocale.panel.inspectionDevices.upcomingText}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography component={'div'} variant={'h4'} className={recalibrationClass}>
                                            {`${dashboardConfig?.recalibration?.overdue}`}
                                        </Typography>
                                        <Typography component={'div'} variant={'h6'} className={recalibrationClass}>
                                            {pageLocale.panel.inspectionDevices.overdueText}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Typography variant={'body1'} style={{ paddingTop: 5 }}>
                                    <AuthWrapper
                                        requiredPermissions={[PERMISSIONS.can_see_reports]}
                                        fallback={pageLocale.panel.inspectionDevices.subtext(
                                            pageLocale.config.pluraliser(
                                                `${
                                                    dashboardConfig?.calibrationPeriodLength
                                                } ${dashboardConfig?.calibrationPeriodType?.toLowerCase()}`,
                                                dashboardConfig?.calibrationPeriodLength,
                                            ),
                                        )}
                                    >
                                        {pageLocale.panel.inspectionDevices.subtextLink(
                                            <Link
                                                to={`${pathConfig.admin.testntagreportrecalibrationssdue}`}
                                                id={`${componentId}-${pageLocale.panel.inspectionDevices.id}-link`}
                                                data-testid={`${componentId}-${pageLocale.panel.inspectionDevices.id}-link`}
                                            >
                                                {pageLocale.panel.inspectionDevices.subtextLinkStart}
                                            </Link>,
                                            pageLocale.config.pluraliser(
                                                `${
                                                    dashboardConfig?.calibrationPeriodLength
                                                } ${dashboardConfig?.calibrationPeriodType?.toLowerCase()}`,
                                                dashboardConfig?.calibrationPeriodLength,
                                            ),
                                        )}
                                    </AuthWrapper>
                                </Typography>
                            </StandardCard>
                        )}
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <AuthWrapper
                        requiredPermissions={[PERMISSIONS.can_inspect, PERMISSIONS.can_alter, PERMISSIONS.can_admin]}
                        inclusive={false}
                    >
                        <Grid item xs={12} md className={classes.flexParent}>
                            {dashboardConfigLoading && !dashboardConfigError ? (
                                <Skeleton
                                    animation="wave"
                                    height={300}
                                    width={'100%'}
                                    id={`${componentId}-${pageLocale.panel.management.id}-skeleton`}
                                    data-testid={`${componentId}-${pageLocale.panel.management.id}-skeleton`}
                                />
                            ) : (
                                <StandardCard
                                    title={pageLocale.panel.management.title}
                                    smallTitle
                                    subCard
                                    className={classes.card}
                                    primaryHeader
                                    standardCardId={`${componentId}-${pageLocale.panel.management.id}-panel`}
                                >
                                    <List component="nav" aria-label="management actions">
                                        {pageLocale.panel.management.links.map(link => {
                                            if (!!link?.permissions) {
                                                return (
                                                    <AuthWrapper
                                                        requiredPermissions={link.permissions}
                                                        key={`listItem${link.title.replace(' ', '')}`}
                                                    >
                                                        <ListItem
                                                            component={Link}
                                                            to={link.path}
                                                            id={`${componentId}-${pageLocale.panel.management.id}-${link.id}-link`}
                                                            data-testid={`${componentId}-${pageLocale.panel.management.id}-${link.id}-link`}
                                                        >
                                                            {link.icon && <ListItemIcon>{link.icon}</ListItemIcon>}
                                                            <ListItemText primary={link.title} />
                                                        </ListItem>
                                                    </AuthWrapper>
                                                );
                                            } else {
                                                return (
                                                    <ListItem
                                                        key={`listItem${link.title.replace(' ', '')}`}
                                                        component={Link}
                                                        to={link.path}
                                                        id={`${componentId}-${pageLocale.panel.management.id}-${link.id}-link`}
                                                        data-testid={`${componentId}-${pageLocale.panel.management.id}-${link.id}-link`}
                                                    >
                                                        {link.icon && <ListItemIcon>{link.icon}</ListItemIcon>}
                                                        <ListItemText primary={link.title} />
                                                    </ListItem>
                                                );
                                            }
                                        })}
                                    </List>
                                </StandardCard>
                            )}
                        </Grid>
                    </AuthWrapper>
                    <AuthWrapper requiredPermissions={[PERMISSIONS.can_see_reports]}>
                        <Grid item xs={12} md className={classes.flexParent}>
                            {dashboardConfigLoading && !dashboardConfigError ? (
                                <Skeleton
                                    animation="wave"
                                    height={300}
                                    width={'100%'}
                                    id={`${componentId}-${pageLocale.panel.reporting.id}-skeleton`}
                                    data-testid={`${componentId}-${pageLocale.panel.reporting.id}-skeleton`}
                                />
                            ) : (
                                <StandardCard
                                    title={pageLocale.panel.reporting.title}
                                    smallTitle
                                    subCard
                                    className={classes.card}
                                    primaryHeader
                                    standardCardId={`${componentId}-${pageLocale.panel.reporting.id}-panel`}
                                >
                                    <List component="nav" aria-label="reporting actions">
                                        {pageLocale.panel.reporting.links.map(link => {
                                            if (!!link?.permissions) {
                                                return (
                                                    <AuthWrapper
                                                        requiredPermissions={link.permissions}
                                                        key={`listItem${link.title.replace(' ', '')}`}
                                                    >
                                                        <ListItem
                                                            component={Link}
                                                            to={link.path}
                                                            id={`${componentId}-${pageLocale.panel.reporting.id}-${link.id}-link`}
                                                            data-testid={`${componentId}-${pageLocale.panel.reporting.id}-${link.id}-link`}
                                                        >
                                                            {link.icon && <ListItemIcon>{link.icon}</ListItemIcon>}
                                                            <ListItemText primary={link.title} />
                                                        </ListItem>
                                                    </AuthWrapper>
                                                );
                                            } else {
                                                return (
                                                    <ListItem
                                                        key={`listItem${link.title.replace(' ', '')}`}
                                                        component={Link}
                                                        to={link.path}
                                                        id={`${componentId}-${pageLocale.panel.reporting.id}-${link.id}-link`}
                                                        data-testid={`${componentId}-${pageLocale.panel.reporting.id}-${link.id}-link`}
                                                    >
                                                        {link.icon && <ListItemIcon>{link.icon}</ListItemIcon>}
                                                        <ListItemText primary={link.title} />
                                                    </ListItem>
                                                );
                                            }
                                        })}
                                    </List>
                                </StandardCard>
                            )}
                        </Grid>
                    </AuthWrapper>
                </Grid>
            </div>
            <ConfirmationAlert
                isOpen={confirmationAlert.visible}
                message={confirmationAlert.message}
                type={confirmationAlert.type}
                autoHideDuration={confirmationAlert.autoHideDuration}
                closeAlert={closeConfirmationAlert}
            />
        </StandardAuthPage>
    );
};

Dashboard.propTypes = {
    actions: PropTypes.object,
    dashboardConfig: PropTypes.object,
    dashboardConfigLoading: PropTypes.bool,
    dashboardConfigLoaded: PropTypes.bool,
    dashboardConfigError: PropTypes.string,
};

export default React.memo(Dashboard);

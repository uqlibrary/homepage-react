import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import InspectionIcon from '@mui/icons-material/Search';
import InspectionDeviceIcon from '@mui/icons-material/Build';
import AssetIcon from '@mui/icons-material/Power';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import ConfirmationAlert from '../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import StandardAuthPage from '../../SharedComponents/StandardAuthPage/StandardAuthPage';
import AuthWrapper from '../../SharedComponents/AuthWrapper/AuthWrapper';
import { pathConfig } from '../../../../../../config/pathConfig';
import { PERMISSIONS, ROLES } from '../../config/auth';
import { useConfirmationAlert } from '../../helpers/hooks';
import { breadcrumbs } from 'config/routes';

const componentId = 'dashboard';

const StyledWrapper = styled('div')(({ theme }) => ({
    flexGrow: 1,
    '& .flexParent': {
        display: 'flex',
    },
    '& .card': {
        flex: 1,
        border: '1px solid hsla(203, 50%, 30%, 0.15)',
        borderRadius: '4px',
    },
    '& .centreAlignParent': {
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.down('md')]: {
            minHeight: '12rem',
            height: '100%',
        },
    },
    '& .centreAlign': {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '-30px',
    },
    '& .overDueText': {
        color: theme.palette.error.main,
        textAlign: 'center',
    },
    '& .dueText': {
        textAlign: 'center',
    },
    '& .dashboard-link': {
        '&:hover': {
            backgroundColor: 'transparent',
        },
        '& div ': {
            backgroundColor: 'transparent',
            color: '#51247A',
            '& span': {
                display: 'inline',
                fontWeight: 500,
                '&:hover': {
                    backgroundColor: '#51247A',
                    color: 'white',
                },
            },
        },
    },
}));

const Dashboard = ({ locale, actions, dashboardConfig, dashboardConfigLoading, dashboardConfigError }) => {
    const theme = useTheme();
    const pageLocale = locale.pages.dashboard;

    const onCloseConfirmationAlert = () => actions.clearDashboardError();
    const { confirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
        onClose: onCloseConfirmationAlert,
        errorMessage: dashboardConfigError,
    });

    React.useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.testntag.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.testntag.pathname);

        actions.loadDashboard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const retestClass = dashboardConfig?.retest?.overdue > 0 ? 'overDueText' : 'dueText';
    const recalibrationClass = dashboardConfig?.recalibration?.overdue > 0 ? 'overDueText' : 'dueText';

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={ROLES.all}
            inclusive={false}
        >
            <StyledWrapper>
                <Grid container spacing={3} sx={{ paddingBottom: 1.5 }}>
                    <AuthWrapper requiredPermissions={[PERMISSIONS.can_inspect]}>
                        <Grid item xs={12} sm className={'flexParent'}>
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
                                            <Avatar aria-hidden="true" style={{ backgroundColor: 'white' }}>
                                                <InspectionIcon style={{ color: theme.palette.primary.light }} />
                                            </Avatar>
                                        ),
                                    }}
                                    smallTitle
                                    subCard
                                    className={'card centreAlignParent'}
                                    contentProps={{ className: 'centreAlign' }}
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
                    <Grid item xs={12} md className={'flexParent'}>
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
                                        <Avatar aria-hidden="true" style={{ backgroundColor: 'white' }}>
                                            <AssetIcon style={{ color: theme.palette.primary.light }} />
                                        </Avatar>
                                    ),
                                }}
                                className={'card'}
                                standardCardId={`${componentId}-${pageLocale.panel.assets.id}-panel`}
                            >
                                <Grid container style={{ marginBottom: 5 }}>
                                    <Grid item xs={6}>
                                        <Box borderRight={1} borderColor="grey.500">
                                            <Typography
                                                component={'div'}
                                                variant={'h4'}
                                                className={'dueText'}
                                                data-testid={`${componentId}-${pageLocale.panel.assets.id}-upcoming-amount`}
                                            >
                                                {`${dashboardConfig?.retest?.soon}`}
                                            </Typography>
                                            <Typography
                                                component={'div'}
                                                variant={'h6'}
                                                className={'dueText'}
                                                data-testid={`${componentId}-${pageLocale.panel.assets.id}-upcoming-text`}
                                            >
                                                {pageLocale.panel.assets.upcomingText}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography
                                            component={'div'}
                                            variant={'h4'}
                                            className={retestClass}
                                            data-testid={`${componentId}-${pageLocale.panel.assets.id}-overdue-amount`}
                                        >
                                            {`${dashboardConfig?.retest?.overdue}`}
                                        </Typography>
                                        <Typography
                                            component={'div'}
                                            variant={'h6'}
                                            className={retestClass}
                                            data-testid={`${componentId}-${pageLocale.panel.assets.id}-overdue-text`}
                                        >
                                            {pageLocale.panel.assets.overdueText}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Typography variant={'body1'} style={{ paddingTop: 5 }}>
                                    <AuthWrapper
                                        requiredPermissions={[PERMISSIONS.can_see_reports]}
                                        fallback={pageLocale.panel.assets.subtext(
                                            locale.pages.general.pluraliser(
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
                                            locale.pages.general.pluraliser(
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
                    <Grid item xs={12} md className={'flexParent'}>
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
                                        <Avatar aria-hidden="true" style={{ backgroundColor: 'white' }}>
                                            <InspectionDeviceIcon style={{ color: theme.palette.primary.light }} />
                                        </Avatar>
                                    ),
                                }}
                                className={'card'}
                                standardCardId={`${componentId}-${pageLocale.panel.inspectionDevices.id}-panel`}
                            >
                                <Grid container style={{ marginBottom: 5 }}>
                                    <Grid item xs={6}>
                                        <Box borderRight={1} borderColor="grey.500">
                                            <Typography
                                                component={'div'}
                                                variant={'h4'}
                                                className={'dueText'}
                                                data-testid={`${componentId}-${pageLocale.panel.inspectionDevices.id}-upcoming-amount`}
                                            >
                                                {`${dashboardConfig?.recalibration?.soon}`}
                                            </Typography>
                                            <Typography
                                                component={'div'}
                                                variant={'h6'}
                                                className={'dueText'}
                                                data-testid={`${componentId}-${pageLocale.panel.inspectionDevices.id}-upcoming-text`}
                                            >
                                                {pageLocale.panel.inspectionDevices.upcomingText}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography
                                            component={'div'}
                                            variant={'h4'}
                                            className={recalibrationClass}
                                            data-testid={`${componentId}-${pageLocale.panel.inspectionDevices.id}-overdue-amount`}
                                        >
                                            {`${dashboardConfig?.recalibration?.overdue}`}
                                        </Typography>
                                        <Typography
                                            component={'div'}
                                            variant={'h6'}
                                            className={recalibrationClass}
                                            data-testid={`${componentId}-${pageLocale.panel.inspectionDevices.id}-overdue-text`}
                                        >
                                            {pageLocale.panel.inspectionDevices.overdueText}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Typography variant={'body1'} style={{ paddingTop: 5 }}>
                                    <AuthWrapper
                                        requiredPermissions={[PERMISSIONS.can_see_reports]}
                                        fallback={pageLocale.panel.inspectionDevices.subtext(
                                            locale.pages.general.pluraliser(
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
                                            locale.pages.general.pluraliser(
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
                    <AuthWrapper requiredPermissions={[PERMISSIONS.can_see_reports]}>
                        <Grid item xs={12} md className={'flexParent'}>
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
                                    className={'card'}
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
                                                            className={'dashboard-link'}
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
                                                        className={'dashboard-link'}
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
                    <AuthWrapper
                        requiredPermissions={[PERMISSIONS.can_inspect, PERMISSIONS.can_alter, PERMISSIONS.can_admin]}
                        inclusive={false}
                    >
                        <Grid item xs={12} md className={'flexParent'}>
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
                                    className={'card'}
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
                                                            className={'dashboard-link'}
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
                                                        className={'dashboard-link'}
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
            </StyledWrapper>
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
    locale: PropTypes.object,
    actions: PropTypes.object,
    dashboardConfig: PropTypes.object,
    dashboardConfigLoading: PropTypes.bool,
    dashboardConfigLoaded: PropTypes.bool,
    dashboardConfigError: PropTypes.string,
};

export default React.memo(Dashboard);

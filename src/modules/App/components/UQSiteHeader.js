import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { PropTypes } from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Megamenu from './Megamenu';
import { APP_URL, AUTH_URL_LOGIN, AUTH_URL_LOGOUT, routes } from '../../../config';
import locale from '../../../locale/global';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import AppsIcon from '@material-ui/icons/Apps';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import SchoolIcon from '@material-ui/icons/School';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import PrintIcon from '@material-ui/icons/Print';
import AssessmentIcon from '@material-ui/icons/Assessment';
import RoomServiceIcon from '@material-ui/icons/RoomService';
import YoutubeSearchedForIcon from '@material-ui/icons/YoutubeSearchedFor';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FeedbackIcon from '@material-ui/icons/Feedback';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import { pathConfig } from 'config/routes';
import { AuthButton } from '../../SharedComponents/Toolbox/AuthButton';
import { AskUs } from './AskUs';
import { UQSiteHeaderLocale } from './UQSiteHeader.locale';

import {
    seeCourseResources,
    seeDocumentDelivery,
    seeFeedback,
    seeLoans,
    seeMasquerade,
    seePrintBalance,
    seePublicationMetrics,
    seeRoomBookings,
    seeSavedItems,
    seeSavedSearches,
} from 'helpers/access';

const useStyles = makeStyles(
    theme => ({
        siteHeader: {
            width: '100%',
            backgroundColor: theme.palette.white.main,
        },
        siteHeaderTop: {
            // border: '1px solid red',co
            maxWidth: 1280,
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingTop: '1.5rem',
            paddingBottom: '0.5rem',
            paddingLeft: 46,
            paddingRight: 44,
            marginTop: 0,
            marginBottom: 0,
        },
        siteHeaderBottom: {
            // border: '1px solid blue',
            maxWidth: 1280,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 0,
            marginBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
        },
        title: {
            color: theme.palette.primary.main,
            fontSize: '1.25rem',
            fontWeight: 500,
            textTransform: 'capitalize',
            marginLeft: -10,
            '&:hover': {
                textDecoration: 'none !important',
            },
        },
        utility: {
            marginTop: -16,
            marginBottom: -16,
            marginLeft: -24,
            marginRight: 8,
        },
        utilityButton: {
            fontSize: 12,
            fontWeight: 400,
            color: theme.palette.primary.main,
        },
        utilityButtonLabel: {
            display: 'flex',
            flexDirection: 'column',
            color: theme.palette.primary.main,
        },
        icons: {
            marginRight: 6,
        },
    }),
    { withTheme: true },
);

export const UQSiteHeader = ({
    isHdrStudent,
    account,
    author,
    authorDetails,
    history,
    isAuthorizedUser,
    chatStatus,
    libHours,
    libHoursLoading,
}) => {
    const classes = useStyles();
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);
    const menuItems = routes.getMenuConfig(account, author, authorDetails, !!isHdrStudent, false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const _navigateToCourseResources = () => {
        history.push(pathConfig.courseresources);
        handleClose();
    };
    const _navigateToMasquerade = () => {
        history.push(pathConfig.admin.masquerade);
        handleClose();
    };
    const _navigateToUrl = url => {
        window.location.href = url;
        handleClose();
    };
    const redirectUserToLogin = (isAuthorizedUser = false, redirectToCurrentLocation = false) => () => {
        const redirectUrl = isAuthorizedUser ? AUTH_URL_LOGOUT : AUTH_URL_LOGIN;
        const returnUrl = redirectToCurrentLocation || !isAuthorizedUser ? window.location.href : APP_URL;
        window.location.assign(`${redirectUrl}?url=${window.btoa(returnUrl)}`);
    };
    return (
        <div className={classes.siteHeader} id="uq-site-header" data-testid="uq-site-header">
            <Grid container spacing={2} className={classes.siteHeaderTop}>
                <Grid item xs={'auto'}>
                    <Button
                        onClick={() => history.push(pathConfig.index)}
                        className={classes.title}
                        id="uq-site-header-home-button"
                        data-testid="uq-site-header-home-button"
                    >
                        {UQSiteHeaderLocale.title}
                    </Button>
                </Grid>
                <Grid item xs />
                {!!account && (
                    <Grid item xs={'auto'} className={classes.utility}>
                        <IconButton
                            onClick={handleClick}
                            classes={{ label: classes.utilityButtonLabel, root: classes.utilityButton }}
                            id="mylibrary-button"
                            data-testid="mylibrary-button"
                        >
                            <AppsIcon color={'primary'} />
                            <div>{UQSiteHeaderLocale.MyLibraryLabel}</div>
                        </IconButton>
                        <Menu
                            id="mylibrary-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <Grid container spacing={0} style={{ maxWidth: 400 }}>
                                {seeLoans(account) && (
                                    <Grid item xs={6} data-testid="mylibrary-borrowing-link">
                                        <MenuItem onClick={() => _navigateToUrl(UQSiteHeaderLocale.links.borrowing)}>
                                            <ImportContactsIcon color={'secondary'} className={classes.icons} />
                                            Borrowing
                                        </MenuItem>
                                    </Grid>
                                )}
                                {seeCourseResources(account) && (
                                    <Grid item xs={6}>
                                        <MenuItem
                                            onClick={_navigateToCourseResources}
                                            data-testid="mylibrary-course-resources-link"
                                        >
                                            <SchoolIcon color={'secondary'} className={classes.icons} />
                                            Course resources
                                        </MenuItem>
                                    </Grid>
                                )}
                                {seeDocumentDelivery(account) && (
                                    <Grid item xs={6}>
                                        <MenuItem
                                            onClick={() => _navigateToUrl(UQSiteHeaderLocale.links.docdel)}
                                            data-testid="mylibrary-document-delivery-link"
                                        >
                                            <MoveToInboxIcon color={'secondary'} className={classes.icons} />
                                            Document delivery
                                        </MenuItem>
                                    </Grid>
                                )}
                                {seeMasquerade(account) && (
                                    <Grid item xs={6}>
                                        <MenuItem
                                            onClick={_navigateToMasquerade}
                                            data-testid="mylibrary-masquerade-link"
                                        >
                                            <SupervisorAccountIcon color={'secondary'} className={classes.icons} />
                                            Masquerade
                                        </MenuItem>
                                    </Grid>
                                )}
                                {seePrintBalance(account) && (
                                    <Grid item xs={6}>
                                        <MenuItem
                                            onClick={() => _navigateToUrl(UQSiteHeaderLocale.links.papercut)}
                                            data-testid="mylibrary-print-balance-link"
                                        >
                                            <PrintIcon color={'secondary'} className={classes.icons} />
                                            Printing balance
                                        </MenuItem>
                                    </Grid>
                                )}
                                {seePublicationMetrics(account) && (
                                    <Grid item xs={6}>
                                        <MenuItem
                                            onClick={() => _navigateToUrl(UQSiteHeaderLocale.links.pubMetrics)}
                                            data-testid="mylibrary-publication-metrics-link"
                                        >
                                            <AssessmentIcon color={'secondary'} className={classes.icons} />
                                            Publication metrics
                                        </MenuItem>
                                    </Grid>
                                )}
                                {seeRoomBookings(account) && (
                                    <Grid item xs={6}>
                                        <MenuItem
                                            onClick={() => _navigateToUrl(UQSiteHeaderLocale.links.roomBookings)}
                                            data-testid="mylibrary-room-bookings-link"
                                        >
                                            <RoomServiceIcon color={'secondary'} className={classes.icons} />
                                            Room bookings
                                        </MenuItem>
                                    </Grid>
                                )}
                                {seeSavedItems && (
                                    <Grid item xs={6}>
                                        <MenuItem
                                            onClick={() => _navigateToUrl(UQSiteHeaderLocale.links.savedItems)}
                                            data-testid="mylibrary-saved-items-link"
                                        >
                                            <FavoriteIcon color={'secondary'} className={classes.icons} />
                                            Saved items
                                        </MenuItem>
                                    </Grid>
                                )}
                                {seeSavedSearches && (
                                    <Grid item xs={6}>
                                        <MenuItem
                                            onClick={() => _navigateToUrl(UQSiteHeaderLocale.links.savedSearches)}
                                            data-testid="mylibrary-saved-searches-link"
                                        >
                                            <YoutubeSearchedForIcon color={'secondary'} className={classes.icons} />
                                            Saved searches
                                        </MenuItem>
                                    </Grid>
                                )}
                                {seeFeedback && (
                                    <Grid item xs={6}>
                                        <MenuItem
                                            onClick={() => _navigateToUrl(UQSiteHeaderLocale.links.feedback)}
                                            data-testid="mylibrary-feedback-link"
                                        >
                                            <FeedbackIcon color={'secondary'} className={classes.icons} />
                                            Feedback
                                        </MenuItem>
                                    </Grid>
                                )}
                            </Grid>
                        </Menu>
                    </Grid>
                )}
                <Grid item xs={'auto'} className={classes.utility} id="askus" data-testid="askus">
                    <AskUs chatStatus={chatStatus} libHours={libHours} libHoursLoading={libHoursLoading} />
                </Grid>
                <Grid item xs={'auto'} className={classes.utility} id="auth" data-testid="auth">
                    <AuthButton
                        isAuthorizedUser={isAuthorizedUser}
                        onClick={redirectUserToLogin(isAuthorizedUser, true)}
                    />
                </Grid>
                <Grid item xs={'auto'} className={classes.utility} id="mobile-megamenu" data-testid="mobile-megamenu">
                    <Hidden lgUp>
                        <Grid item xs={'auto'} id="mobile-menu" data-testid="mobile-menu">
                            {/* hamburger button */}
                            <Tooltip title={locale.global.mainNavButton.tooltip}>
                                <IconButton
                                    aria-label={locale.global.mainNavButton.aria}
                                    onClick={toggleMenu}
                                    id="main-menu-button"
                                    data-testid="main-menu-button"
                                    classes={{ label: classes.utilityButtonLabel, root: classes.utilityButton }}
                                >
                                    {menuOpen ? <CloseIcon color={'primary'} /> : <MenuIcon color={'primary'} />}
                                    <div>Menu</div>
                                </IconButton>
                            </Tooltip>
                            <Megamenu
                                history={history}
                                menuItems={menuItems}
                                menuOpen={menuOpen}
                                toggleMenu={toggleMenu}
                                isMobile
                            />
                        </Grid>
                    </Hidden>
                </Grid>
            </Grid>
            <Grid
                container
                spacing={0}
                role="region"
                aria-label="Main site navigation"
                className={classes.siteHeaderBottom}
                justify={'flex-start'}
            >
                <Hidden mdDown>
                    <Grid item xs={12} id="desktop-megamenu">
                        <Megamenu menuItems={menuItems} history={history} />
                    </Grid>
                </Hidden>
            </Grid>
        </div>
    );
};

UQSiteHeader.propTypes = {
    isHdrStudent: PropTypes.bool,
    isAuthorizedUser: PropTypes.bool,
    chatStatus: PropTypes.bool,
    account: PropTypes.object,
    author: PropTypes.object,
    authorDetails: PropTypes.object,
    history: PropTypes.object,
    libHours: PropTypes.object,
    libHoursLoading: PropTypes.bool,
};

UQSiteHeader.defaultProps = {};

export default UQSiteHeader;

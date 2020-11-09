import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { PropTypes } from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Megamenu from './Megamenu';
import { APP_URL, AUTH_URL_LOGIN, AUTH_URL_LOGOUT, routes } from '../../../config';
import locale from '../../../locale/global';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import AppsIcon from '@material-ui/icons/Apps';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import ComputerIcon from '@material-ui/icons/Computer';
import SchoolIcon from '@material-ui/icons/School';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
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
    }),
    { withTheme: true },
);

export const UQSiteHeader = ({ isHdrStudent, account, author, authorDetails, history, isAuthorizedUser }) => {
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
    const MasqueradeLink = () => {
        return !!account && !!account.canMasquerade ? (
            <Grid item xs={6}>
                <MenuItem onClick={_navigateToMasquerade}>
                    <SupervisorAccountIcon color={'secondary'} style={{ marginRight: 6 }} />
                    Masquerade
                </MenuItem>
            </Grid>
        ) : null;
    };
    const redirectUserToLogin = (isAuthorizedUser = false, redirectToCurrentLocation = false) => () => {
        const redirectUrl = isAuthorizedUser ? AUTH_URL_LOGOUT : AUTH_URL_LOGIN;
        const returnUrl = redirectToCurrentLocation || !isAuthorizedUser ? window.location.href : APP_URL;
        window.location.assign(`${redirectUrl}?url=${window.btoa(returnUrl)}`);
    };
    return (
        <div className={classes.siteHeader}>
            <Grid container spacing={2} className={classes.siteHeaderTop}>
                <Grid item xs={'auto'}>
                    <a href="#" className={classes.title}>
                        Library
                    </a>
                </Grid>
                <Grid item xs />
                {!!account && (
                    <Grid item xs={'auto'} className={classes.utility} id="my-library">
                        <IconButton
                            onClick={handleClick}
                            classes={{ label: classes.utilityButtonLabel, root: classes.utilityButton }}
                        >
                            <AppsIcon color={'primary'} />
                            <div>My Library</div>
                        </IconButton>
                        <Menu
                            id="simple-menu2"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <Grid container spacing={0} style={{ maxWidth: 400 }}>
                                <Grid item xs={6}>
                                    <MenuItem onClick={handleClose}>
                                        <ImportContactsIcon color={'secondary'} style={{ marginRight: 6 }} />
                                        Borrowing
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={6}>
                                    <MenuItem onClick={handleClose}>
                                        <ComputerIcon color={'secondary'} style={{ marginRight: 6 }} />
                                        Computers
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={6}>
                                    <MenuItem onClick={_navigateToCourseResources}>
                                        <SchoolIcon color={'secondary'} style={{ marginRight: 6 }} />
                                        Course resources
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={6}>
                                    <MenuItem onClick={handleClose}>
                                        <MoveToInboxIcon color={'secondary'} style={{ marginRight: 6 }} />
                                        Document delivery
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={6}>
                                    <MenuItem onClick={handleClose}>
                                        <QueryBuilderIcon color={'secondary'} style={{ marginRight: 6 }} />
                                        Hours
                                    </MenuItem>
                                </Grid>
                                <MasqueradeLink />
                                <Grid item xs={6}>
                                    <MenuItem onClick={handleClose}>
                                        <PrintIcon color={'secondary'} style={{ marginRight: 6 }} />
                                        Printing balance
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={6}>
                                    <MenuItem onClick={handleClose}>
                                        <AssessmentIcon color={'secondary'} style={{ marginRight: 6 }} />
                                        Publication metrics
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={6}>
                                    <MenuItem onClick={handleClose}>
                                        <RoomServiceIcon color={'secondary'} style={{ marginRight: 6 }} />
                                        Room bookings
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={6}>
                                    <MenuItem onClick={handleClose}>
                                        <FavoriteIcon color={'secondary'} style={{ marginRight: 6 }} />
                                        Saved items
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={6}>
                                    <MenuItem onClick={handleClose}>
                                        <YoutubeSearchedForIcon color={'secondary'} style={{ marginRight: 6 }} />
                                        Saved searches
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={6}>
                                    <MenuItem onClick={handleClose}>
                                        <FeedbackIcon color={'secondary'} style={{ marginRight: 6 }} />
                                        Feedback
                                    </MenuItem>
                                </Grid>
                            </Grid>
                        </Menu>
                    </Grid>
                )}
                <Grid item xs={'auto'} className={classes.utility} id="ask-us">
                    <AskUs />
                </Grid>
                <Grid item xs={'auto'} className={classes.utility} id="auth-button">
                    <AuthButton
                        isAuthorizedUser={isAuthorizedUser}
                        signInTooltipText={'Login to the UQ Library'}
                        signOutTooltipText={`${(account && account.firstName) || ''} ${(account &&
                            account &&
                            account.lastName) ||
                            ''} - Log out of UQ`}
                        onClick={redirectUserToLogin(isAuthorizedUser, true)}
                    />
                </Grid>
                <Grid item xs={'auto'} className={classes.utility} id="mobile-megamenu">
                    <Hidden mdUp>
                        <Grid item xs={'auto'} id="mobile-menu">
                            <Tooltip title={locale.global.mainNavButton.tooltip}>
                                <IconButton
                                    aria-label={locale.global.mainNavButton.aria}
                                    onClick={toggleMenu}
                                    id={'main-menu-button'}
                                    classes={{ label: classes.utilityButtonLabel, root: classes.utilityButton }}
                                >
                                    <MenuIcon color={'primary'} />
                                    <div>Menu</div>
                                </IconButton>
                            </Tooltip>
                            <Megamenu
                                hasHomePageItem
                                hasCloseItem
                                history={history}
                                menuItems={menuItems}
                                menuOpen={menuOpen}
                                toggleMenu={toggleMenu}
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
                <Hidden smDown>
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
    account: PropTypes.object,
    author: PropTypes.object,
    authorDetails: PropTypes.object,
    history: PropTypes.object,
};

UQSiteHeader.defaultProps = {};

export default UQSiteHeader;

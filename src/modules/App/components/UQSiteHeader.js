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
import { pathConfig } from 'config/routes';
import { AuthButton } from '../../SharedComponents/Toolbox/AuthButton';
import { AskUs } from './AskUs';
import { UQSiteHeaderLocale } from './UQSiteHeader.locale';
import MyLibrary from './MyLibrary';

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
            paddingTop: '0.5rem',
            paddingBottom: 0,
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
            marginTop: -8,
            marginBottom: -16,
            marginLeft: 0,
            marginRight: -8,
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
    const redirectUserToLogin = (isAuthorizedUser = false, redirectToCurrentLocation = false) => () => {
        const redirectUrl = isAuthorizedUser ? AUTH_URL_LOGOUT : AUTH_URL_LOGIN;
        const returnUrl = redirectToCurrentLocation || !isAuthorizedUser ? window.location.href : APP_URL;
        window.location.assign(`${redirectUrl}?url=${window.btoa(returnUrl)}`);
    };
    return (
        <div className={classes.siteHeader} id="uq-site-header" data-testid="uq-site-header">
            <Grid container spacing={0} className={classes.siteHeaderTop}>
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
                <Grid item xs={'auto'} className={classes.utility} id="mylibrary" data-testid="mylibrary">
                    <MyLibrary account={account} history={history} />
                </Grid>
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

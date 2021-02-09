import React, { useState, useRef } from 'react';
import { throttle } from 'throttle-debounce';
import { PropTypes } from 'prop-types';

import { isHdrStudent } from 'helpers/access';
import { loadChatStatus, loadCurrentAccount, loadLibHours } from 'actions';
import { APP_URL, AUTH_URL_LOGIN, AUTH_URL_LOGOUT, routes } from 'config';
import locale from 'locale/global';
import { pathConfig } from 'config/routes';
import { UQSiteHeaderLocale } from './UQSiteHeader.locale';
import { mui1theme } from 'config';

import { AskUs } from 'modules/App/components/AskUs';
import { AuthButton } from 'modules/SharedComponents/Toolbox/AuthButton';
import Megamenu from 'modules/App/components/Megamenu';
import MyLibrary from 'modules/App/components/MyLibrary';

import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(
    theme => ({
        siteHeader: {
            width: '100%',
            backgroundColor: theme.palette.white.main,
            paddingBottom: '1rem',
        },
        siteHeaderTop: {
            maxWidth: 1280,
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingTop: '0.5rem',
            paddingBottom: 0,
            paddingLeft: 46,
            paddingRight: 44,
            [theme.breakpoints.down('xs')]: {
                paddingLeft: 12,
                paddingRight: 12,
            },
            marginTop: 0,
            marginBottom: 0,
        },
        siteHeaderBottom: {
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
    account,
    accountLoading,
    author,
    authorDetails,
    history,
    chatStatus,
    libHours,
    libHoursLoading,
    libHoursError,
    isLibraryWebsiteCall,
}) => {
    const classes = useStyles(mui1theme);
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const throttledAccountLoad = useRef(throttle(3100, () => loadCurrentAccount()));
    const throttledOpeningHoursLoad = useRef(throttle(3100, () => loadLibHours()));
    const throttledChatStatusLoad = useRef(throttle(3100, () => loadChatStatus()));
    if (!isLibraryWebsiteCall) {
        // if the component is not inside our React app then these wont have been passed in
        !accountLoading && (!account || !author || !authorDetails) && throttledAccountLoad.current();
        !libHoursLoading && !libHours && throttledOpeningHoursLoad.current();
        !chatStatus && throttledChatStatusLoad.current();
    }

    const menuItems = routes.getMenuConfig(account, author, authorDetails, !!isHdrStudent(account), false);
    const isAuthorizedUser = !!account && !!account.id;
    const redirectUserToLogin = (isAuthorizedUser = false, redirectToCurrentLocation = false) => () => {
        const redirectUrl = isAuthorizedUser ? AUTH_URL_LOGOUT : AUTH_URL_LOGIN;
        const returnUrl = redirectToCurrentLocation || !isAuthorizedUser ? window.location.href : APP_URL;
        window.location.assign(`${redirectUrl}?url=${window.btoa(returnUrl)}`);
    };

    const visitHomepage = () => {
        const libraryHomepageUrl = 'https://www.library.uq.edu.au/';
        const localhostHomepageUrl = 'http://localhost:2020/';
        const isHomePage =
            window.location.href === libraryHomepageUrl ||
            window.location.href === localhostHomepageUrl ||
            window.location.href.startsWith(`${localhostHomepageUrl}?`);
        const isSubpageOfHomepageReactApp =
            !isHomePage &&
            (window.location.href.startsWith(libraryHomepageUrl) ||
                window.location.href.startsWith(localhostHomepageUrl)) &&
            typeof history === 'object' &&
            history !== null;

        if (isHomePage) {
            // do nothing
            return false;
        } else if (isSubpageOfHomepageReactApp) {
            return !!history && history.push(pathConfig.index);
        } else {
            window.location.href(libraryHomepageUrl);
            return false;
        }
    };

    return (
        <div className={classes.siteHeader} id="uq-site-header" data-testid="uq-site-header">
            <Grid container spacing={0} className={classes.siteHeaderTop}>
                <Grid item xs={'auto'}>
                    <Button
                        onClick={() => visitHomepage()}
                        className={classes.title}
                        id="uq-site-header-home-button"
                        data-testid="uq-site-header-home-button"
                    >
                        {UQSiteHeaderLocale.title}
                    </Button>
                </Grid>
                <Grid item xs />
                {isAuthorizedUser && (
                    <Grid
                        item
                        xs={'auto'}
                        className={classes.utility}
                        id="mylibrary-button-block"
                        data-testid="mylibrary"
                        style={{ display: 'none' }} // for foreign sites - immediate overwrite on homepage
                    >
                        <MyLibrary account={account} author={author} history={history} />
                    </Grid>
                )}
                <Grid
                    item
                    xs={'auto'}
                    className={classes.utility}
                    id="askus-button-block"
                    data-testid="askus"
                    style={{ display: 'none' }}
                >
                    <AskUs
                        chatStatus={chatStatus}
                        libHours={libHours}
                        libHoursLoading={libHoursLoading}
                        libHoursError={libHoursError}
                    />
                </Grid>
                <Grid
                    item
                    xs={'auto'}
                    className={classes.utility}
                    id="auth-button-block"
                    data-testid="auth"
                    style={{ display: 'none' }}
                >
                    <AuthButton
                        isAuthorizedUser={isAuthorizedUser}
                        onClick={redirectUserToLogin(isAuthorizedUser, true)}
                    />
                </Grid>
                <Grid item xs={'auto'} className={classes.utility} data-testid="mobile-megamenu" id="mobile-megamenu">
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
                        </Grid>
                    </Hidden>
                </Grid>
            </Grid>
            <Grid container>
                <Hidden lgUp>
                    <Megamenu
                        history={history}
                        menuItems={menuItems}
                        menuOpen={menuOpen}
                        toggleMenu={toggleMenu}
                        isMobile
                    />
                </Hidden>
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
            <span
                id="after-navigation"
                role="region"
                tabIndex="0"
                aria-label="Start of content"
                style={{ position: 'fixed', top: '-2000px', left: '-2000px' }}
            >
                Start of content
            </span>
        </div>
    );
};

UQSiteHeader.propTypes = {
    account: PropTypes.object,
    accountLoading: PropTypes.bool,
    author: PropTypes.object,
    authorDetails: PropTypes.object,
    chatStatus: PropTypes.bool,
    history: PropTypes.object,
    libHours: PropTypes.object,
    libHoursLoading: PropTypes.bool,
    libHoursError: PropTypes.bool,
    isLibraryWebsiteCall: PropTypes.bool,
};

UQSiteHeader.defaultProps = {
    isLibraryWebsiteCall: false,
};

export default UQSiteHeader;

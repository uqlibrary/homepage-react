import React, { useState } from 'react';
import { PropTypes } from 'prop-types';

import { isHdrStudent } from 'helpers/access';
import { APP_URL, AUTH_URL_LOGIN, AUTH_URL_LOGOUT, routes } from 'config';
import locale from 'locale/global';
import { pathConfig } from 'config/routes';
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
            backgroundColor: theme.palette.white.main,
            paddingBottom: '0.3rem',
            paddingTop: '0.3rem',
        },
        siteHeaderBottom: {
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
        buttonHolder: {
            [theme.breakpoints.down('xs')]: {
                // stop the buttons wrapping on the tiniest screen - they shrink instead
                flexWrap: 'nowrap',
            },
        },
    }),
    { withTheme: true },
);

export const UQSiteHeader = ({
    account,
    author,
    authorDetails,
    history,
    chatStatus,
    libHours,
    libHoursLoading,
    libHoursError,
}) => {
    const classes = useStyles(mui1theme);
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const menuItems = routes.getMenuConfig(account, author, authorDetails, !!isHdrStudent(account), false);
    const isAuthorizedUser = !!account && !!account.id;
    const redirectUserToLogin = (isAuthorizedUser = false, redirectToCurrentLocation = false) => () => {
        const redirectUrl = isAuthorizedUser ? AUTH_URL_LOGOUT : AUTH_URL_LOGIN;
        const returnUrl = redirectToCurrentLocation || !isAuthorizedUser ? window.location.href : APP_URL;
        window.location.assign(`${redirectUrl}?url=${window.btoa(returnUrl)}`);
    };
    return (
        <div className={classes.siteHeader} id="uq-site-header" data-testid="uq-site-header">
            <div className="layout-card">
                <Grid container spacing={0} className={classes.buttonHolder}>
                    <Grid item xs={'auto'}>
                        <Button
                            onClick={() => history.push(pathConfig.index)}
                            className={classes.title}
                            id="uq-site-header-home-button"
                            data-testid="uq-site-header-home-button"
                        >
                            {locale.global.pageTitle}
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
                        >
                            <MyLibrary account={account} author={author} history={history} />
                        </Grid>
                    )}
                    <Grid item xs={'auto'} className={classes.utility} id="askus-button-block" data-testid="askus">
                        <AskUs
                            chatStatus={chatStatus}
                            libHours={libHours}
                            libHoursLoading={libHoursLoading}
                            libHoursError={libHoursError}
                        />
                    </Grid>
                    <Grid item xs={'auto'} className={classes.utility} id="auth-button-block" data-testid="auth">
                        <AuthButton
                            isAuthorizedUser={isAuthorizedUser}
                            onClick={redirectUserToLogin(isAuthorizedUser, true)}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={'auto'}
                        className={classes.utility}
                        data-testid="mobile-megamenu"
                        id="mobile-megamenu"
                    >
                        <Hidden mdUp>
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
                    <Hidden smUp>
                        <Megamenu
                            history={history}
                            menuItems={menuItems}
                            menuOpen={menuOpen}
                            toggleMenu={toggleMenu}
                            isMobile
                        />
                    </Hidden>
                </Grid>
            </div>
            <Grid
                container
                id="desktop-megamenu-block"
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
    author: PropTypes.object,
    authorDetails: PropTypes.object,
    chatStatus: PropTypes.bool,
    history: PropTypes.object,
    libHours: PropTypes.object,
    libHoursLoading: PropTypes.bool,
    libHoursError: PropTypes.bool,
};

UQSiteHeader.defaultProps = {};

export default UQSiteHeader;

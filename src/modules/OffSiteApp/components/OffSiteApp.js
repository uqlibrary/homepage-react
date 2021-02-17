import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import browserUpdate from 'browser-update';
import AppAlertContainer from 'modules/App/containers/AppAlert';
import Grid from '@material-ui/core/Grid';
import UQHeader from 'modules/App/components/UQHeader';
import ChatStatus from 'modules/App/components/ChatStatus';
import UQSiteHeader from 'modules/App/components/UQSiteHeader';
import { makeStyles } from '@material-ui/core/styles';
import { ConnectFooter, MinimalFooter } from 'modules/SharedComponents/Footer';

browserUpdate({
    required: {
        e: -2,
        i: 11,
        f: -2,
        o: -2,
        s: -1,
        c: -2,
        samsung: 7.0,
        vivaldi: 1.2,
    },
    insecure: true,
    style: 'top',
    shift_page_down: true,
});

const useStyles = makeStyles(theme => ({
    appBG: {
        ...theme.palette.primary.main,
    },
    layoutCard: {
        width: '100%',
        padding: 0,
        [theme.breakpoints.down('sm')]: {
            margin: '0 auto 24px auto',
        },
    },
    layoutFill: {
        position: 'relative',
        display: 'flex',
        flexFlow: 'column',
        margin: 0,
        padding: 0,
        maxHeight: '100%',
        height: '100%',
    },
    titleLink: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        color: theme.palette.common.white,
        '& a': {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
    },
    nowrap: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    connectFooter: {
        marginTop: 50,
        backgroundColor: theme.hexToRGBA(theme.palette.secondary.main, 0.15),
    },
    minimalFooter: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.white.main,
        backgroundImage: 'linear-gradient(90deg,#51247a,87%,#962a8b)',
    },
}));

export const OffSiteApp = ({
    account,
    author,
    authorDetails,
    accountLoading,
    actions,
    chatStatus,
    libHours,
    libHoursLoading,
    libHoursError,
    history,
}) => {
    useEffect(() => {
        actions.loadCurrentAccount();
        actions.loadAlerts();
        actions.loadChatStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const classes = useStyles();
    // position static makes the Chat go to the bottom of the screen
    return (
        <Grid container className={classes.layoutFill} style={{ position: 'static' }}>
            {chatStatus && (chatStatus.online === true || chatStatus.online === false) && (
                <ChatStatus status={chatStatus} />
            )}
            <div className="content-container" id="content-container" role="region" aria-label="Site content">
                <div className="content-header" role="region" aria-label="Site header">
                    <UQHeader />
                </div>
                <UQSiteHeader
                    account={account}
                    accountLoading={accountLoading}
                    author={author}
                    authorDetails={authorDetails}
                    history={history}
                    chatStatus={!!chatStatus && chatStatus.online}
                    libHours={libHours}
                    libHoursloading={libHoursLoading}
                    libHoursError={libHoursError}
                />
                <div role="region" aria-label="UQ Library Alerts" id="alert-container">
                    <AppAlertContainer />
                </div>
                <div>
                    <div id="full-footer-block" style={{ display: 'none' }}>
                        <Grid container spacing={0} id="full-footer-block-child">
                            <Grid
                                item
                                xs={12}
                                className={classes.connectFooter}
                                id="connect-footer-block"
                                style={{ display: 'none' }}
                            >
                                <ConnectFooter history={history} />
                            </Grid>
                            <Grid item xs={12} className={classes.minimalFooter}>
                                <MinimalFooter />
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        </Grid>
    );
};

OffSiteApp.propTypes = {
    account: PropTypes.object,
    accountLoading: PropTypes.bool,
    accountAuthorDetailsLoading: PropTypes.bool,
    author: PropTypes.object,
    authorDetails: PropTypes.object,
    actions: PropTypes.any,
    history: PropTypes.any,
    libHours: PropTypes.object,
    libHoursLoading: PropTypes.bool,
    libHoursError: PropTypes.bool,
    chatStatus: PropTypes.object,
    isSessionExpired: PropTypes.any,
};

export default OffSiteApp;

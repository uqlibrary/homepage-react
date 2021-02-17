import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles(
    theme => ({
        chatStatus: {
            position: 'fixed',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
            backgroundColor: 'rgba(0,0,0,0.75)',
            color: theme.palette.white.main,
            textTransform: 'uppercase',
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 16,
            paddingRight: 16,
            minWidth: 260,
            borderRadius: 4,
        },
        chatAction: {
            bottom: theme.spacing(2),
            right: theme.spacing(2),
            position: 'fixed',
        },
        chatIcon: {
            color: theme.palette.white.main,
        },
        badgeOnline: {
            backgroundColor: theme.palette.success.main,
        },
        badgeOffline: {
            backgroundColor: theme.palette.error.main,
        },
    }),
    { withTheme: true },
);

export const ChatStatus = ({ status }) => {
    const classes = useStyles();
    const isMobile = useMediaQuery('(max-width:600px)');
    const [closeChatState, setCloseChatState] = useState(false);
    useEffect(() => {
        if (isMobile) {
            setCloseChatState(true);
        }
    }, [isMobile]);
    const closeChatStatus = () => {
        setCloseChatState(true);
    };
    const openChatStatus = () => {
        setCloseChatState(false);
    };
    const openContactUs = () => {
        window.location.href = 'https://web.library.uq.edu.au/contact-us';
    };
    const launchChat = () => {
        window.open(
            'https://support.my.uq.edu.au/app/chat/chat_launch_lib/p/45',
            'chat',
            'toolbar=no, location=no, status=no, width=400, height=400',
        );
        return false;
    };
    if (!!status && !!status.online && !closeChatState) {
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                className={classes.chatStatus}
                open
                onClose={closeChatStatus}
                id={`chat-status-snackbar-${status.online ? 'online' : 'offline'}`}
                data-testid={`chat-status-snackbar-${status.online ? 'online' : 'offline'}`}
            >
                <Grid container spacing={2} alignContent="center" alignItems="center" direction="row">
                    <Grid item xs>
                        Chat&nbsp;online&nbsp;now
                    </Grid>
                    <Grid item xs={'auto'}>
                        <Button
                            color="primary"
                            size="small"
                            variant="contained"
                            onClick={launchChat}
                            id={`chat-status-snackbar-${status.online ? 'online' : 'offline'}-launch-button`}
                            data-testid={`chat-status-snackbar-${status.online ? 'online' : 'offline'}-launch-button`}
                        >
                            Launch
                        </Button>
                    </Grid>
                    <Grid item xs={'auto'} style={{ marginLeft: -8, marginRight: -8 }}>
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={closeChatStatus}
                            id={`chat-status-snackbar-${status.online ? 'online' : 'offline'}-close-button`}
                            data-testid={`chat-status-snackbar-${status.online ? 'online' : 'offline'}-close-button`}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Grid>
                </Grid>
            </Snackbar>
        );
    }
    if ((!status || !status.online) && !closeChatState) {
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                className={classes.chatStatus}
                open
                onClose={closeChatStatus}
                id={'chat-status-snackbar-offline'}
                data-testid={'chat-status-snackbar-offline'}
            >
                <Grid container spacing={2} alignContent="center" alignItems="center" direction="row">
                    <Grid item xs>
                        Online&nbsp;chat&nbsp;unavailable
                    </Grid>
                    <Grid item xs={'auto'}>
                        <Button
                            color="primary"
                            size="small"
                            variant="contained"
                            onClick={openContactUs}
                            id={'chat-status-snackbar-offline-launch-button'}
                            data-testid={'chat-status-snackbar-offline-launch-button'}
                        >
                            Contact us
                        </Button>
                    </Grid>
                    <Grid item xs={'auto'} style={{ marginLeft: -8, marginRight: -8 }}>
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={closeChatStatus}
                            id={'chat-status-snackbar-offline-close-button'}
                            data-testid={'chat-status-snackbar-offline-close-button'}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Grid>
                </Grid>
            </Snackbar>
        );
    }
    if (!!closeChatState) {
        return (
            <Tooltip
                title={'Click to open online chat'}
                placement="left"
                TransitionProps={{ timeout: 300 }}
                style={{ zIndex: 999 }}
            >
                <Fab
                    color="secondary"
                    className={`${classes.chatAction} ${
                        !!status && status.online ? classes.badgeOnline : classes.badgeOffline
                    }`}
                    onClick={openChatStatus}
                    size={'small'}
                    id={`chat-status-icon-button-${!!status && status.online ? 'online' : 'offline'}`}
                    data-testid={`chat-status-icon-button-${!!status && status.online ? 'online' : 'offline'}`}
                >
                    <QuestionAnswerIcon
                        className={classes.chatIcon}
                        id={`chat-status-icon-${!!status && status.online ? 'online' : 'offline'}`}
                        data-testid={`chat-status-icon-${!!status && status.online ? 'online' : 'offline'}`}
                    />
                </Fab>
            </Tooltip>
        );
    }
    return null;
};

ChatStatus.propTypes = {
    status: PropTypes.object,
};

export default ChatStatus;

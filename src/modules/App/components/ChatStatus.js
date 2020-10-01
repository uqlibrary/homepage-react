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

const useStyles = makeStyles(
    theme => ({
        chatStatus: {
            position: 'absolute',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
            backgroundColor: 'rgba(0,0,0,0.75)',
            color: theme.palette.white.main,
            textTransform: 'uppercase',
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 16,
            paddingRight: 16,
            // width: 340,
            borderRadius: 4,
        },
        chatAction: {
            position: 'absolute',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
    }),
    { withTheme: true },
);

export const ChatStatus = ({ status }) => {
    const classes = useStyles();
    const [chatState, setChatState] = useState(status);
    const [closeChatState, setCloseChatState] = useState(false);
    useEffect(() => {
        setChatState(status);
    }, [status]);
    const closeChatStatus = () => {
        setCloseChatState(true);
    };
    const openChatStatus = () => {
        setCloseChatState(false);
    };
    const launchChat = () => {
        window.open(
            'https://support.my.uq.edu.au/app/chat/chat_launch_lib/p/45',
            'chat',
            'toolbar=no, location=no, status=no, width=400, height=400',
        );
        return false;
    };
    if (chatState.online && !closeChatState) {
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                className={classes.chatStatus}
                open
                onClose={closeChatStatus}
            >
                <div>
                    <Grid container spacing={2} alignContent={'center'} alignItems={'center'}>
                        <Grid item xs>
                            Online&nbsp;chat&nbsp;available
                        </Grid>
                        <Grid item xs={'auto'}>
                            <Button color="primary" size="small" variant="contained" onClick={launchChat}>
                                Launch
                            </Button>
                        </Grid>
                        <Grid item xs={'auto'} style={{ marginLeft: -8, marginRight: -8 }}>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={closeChatStatus}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Grid>
                    </Grid>
                </div>
            </Snackbar>
        );
    }
    if (chatState.online && closeChatState) {
        return (
            <Tooltip
                id="auth-button"
                title={'Click to open online chat'}
                placement="left"
                TransitionProps={{ timeout: 300 }}
            >
                <Fab color="secondary" className={classes.chatAction} onClick={openChatStatus} size={'small'}>
                    <QuestionAnswerIcon />
                </Fab>
            </Tooltip>
        );
    }
    return null;
};

ChatStatus.propTypes = {
    status: PropTypes.object,
};

ChatStatus.defaultProps = {
    status: { online: false },
};

export default ChatStatus;

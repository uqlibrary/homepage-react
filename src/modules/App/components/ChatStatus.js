import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';

const useStyles = makeStyles(
    theme => ({
        chatStatus: {
            backgroundColor: theme.palette.secondary,
            textTransform: 'uppercase',
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
    const launchChat = () => {
        window.open(
            'https://support.my.uq.edu.au/app/chat/chat_launch_lib/p/45',
            'chat',
            'toolbar=no, location=no, status=no, width=400, height=400',
        );
        return false;
    };
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={chatState.online && !closeChatState}
            onClose={closeChatStatus}
        >
            <SnackbarContent
                className={classes.chatStatus}
                message="Online chat available"
                action={
                    <React.Fragment>
                        <Button color="primary" size="small" variant="contained" onClick={launchChat}>
                            Launch
                        </Button>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={closeChatStatus}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
        </Snackbar>
    );
};

ChatStatus.propTypes = {
    status: PropTypes.object,
};

ChatStatus.defaultProps = {
    status: { online: false },
};

export default ChatStatus;

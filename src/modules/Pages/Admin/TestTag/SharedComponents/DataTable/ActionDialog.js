import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

export const useStyles = makeStyles(theme => ({
    alternateActionButtonClass: {
        color: theme.palette.white.main,
        backgroundColor: theme.palette.warning.main,
        '&:hover': {
            backgroundColor: theme.palette.warning.dark,
        },
    },
    alertPanel: {
        marginTop: 10,
    },
    actionButtons: {
        marginTop: 10,
    },
    dialogPaper: {
        minHeight: '30vh',
        maxHeight: '50vh',
    },
}));

export const ActionDialogue = ({
    confirmationBoxId = 'dialogBox',
    confirmationTitle = '',
    cancelButtonLabel = '',
    confirmButtonLabel = '',
    isOpen,
    actionDialogueBoxId = 'actionDialogBox',
    hideActionButton = false,
    hideCancelButton = false,
    onAction,
    onCancelAction,
    onClose,
    noMinContentWidth,
    children,
} = {}) => {
    const classes = useStyles();

    const _onAction = () => {
        onClose?.();
        onAction?.();
    };

    const _onCancelAction = () => {
        onClose?.();
        onCancelAction?.();
    };

    return (
        <Dialog
            classes={{ paper: classes.dialogPaper }}
            style={{ padding: 6 }}
            open={isOpen}
            id={`dialogbox-${actionDialogueBoxId}`}
            data-testid={`dialogbox-${actionDialogueBoxId}`}
        >
            <DialogTitle data-testid="message-title">{confirmationTitle}</DialogTitle>
            <DialogContent style={{ minWidth: !noMinContentWidth ? 300 : 'auto' }}>{children}</DialogContent>
            {(!hideCancelButton || !hideActionButton) && (
                <DialogActions>
                    <Grid container spacing={1}>
                        {!hideCancelButton && (
                            <Grid item xs={12} sm={6}>
                                <Box justifyContent="flex-start" display={'flex'}>
                                    <Button
                                        variant={'outlined'}
                                        onClick={_onCancelAction}
                                        id="confirm-cancel-action"
                                        data-testid={`cancel-${confirmationBoxId}`}
                                        fullWidth
                                    >
                                        {cancelButtonLabel}
                                    </Button>
                                </Box>
                            </Grid>
                        )}
                        {!hideActionButton && (
                            <Grid item xs={12} sm={6}>
                                <Box justifyContent="flex-end" display={'flex'}>
                                    <Button
                                        variant="contained"
                                        autoFocus
                                        color={'primary'}
                                        onClick={_onAction}
                                        id="confirm-action"
                                        data-testid={`confirm-${confirmationBoxId}`}
                                    >
                                        {confirmButtonLabel}
                                    </Button>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </DialogActions>
            )}
        </Dialog>
    );
};

ActionDialogue.propTypes = {
    confirmationBoxId: PropTypes.string,
    confirmationTitle: PropTypes.string,
    cancelButtonLabel: PropTypes.string,
    confirmButtonLabel: PropTypes.string,
    dialogueContent: PropTypes.any,
    data: PropTypes.array,
    row: PropTypes.object,
    isOpen: PropTypes.bool,
    noMinContentWidth: PropTypes.bool,
    actionDialogueBoxId: PropTypes.string,
    hideActionButton: PropTypes.bool,
    hideCancelButton: PropTypes.bool,
    onAction: PropTypes.bool,
    onCancelAction: PropTypes.bool,
    onClose: PropTypes.bool,
    children: PropTypes.node,
};

export default React.memo(ActionDialogue);

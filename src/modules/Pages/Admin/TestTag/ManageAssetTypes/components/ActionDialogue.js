import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';

export const useStyles = makeStyles(theme => ({
    alternateActionButtonClass: {
        color: theme.palette.white.main,
        backgroundColor: theme.palette.warning.main,
        '&:hover': {
            backgroundColor: theme.palette.warning.dark,
        },
    },
}));

export const ActionDialogue = ({ dialogueContent, row, isOpen, locale, noMinContentWidth, actionDialogueBoxId }) => {
    const classes = useStyles();
    console.log('IS OPEN', isOpen);
    return (
        <Dialog style={{ padding: 6 }} open={isOpen} data-testid={`dialogbox-${actionDialogueBoxId}`}>
            <DialogTitle data-testid="message-title">{locale.confirmationTitle}</DialogTitle>
            <DialogContent style={{ minWidth: !noMinContentWidth ? 400 : 'auto' }}>
                <Typography component={'p'} data-testid="deleteReassign-target-prompt">
                    Delete <b>{row?.asset_type_name ?? 'NONE'}</b> and reassign all assets to:
                </Typography>
                <Select
                    fullWidth
                    className={classes.formSelect}
                    id="actionDialogueTypeSelect"
                    data-testid="actionDialogueTypeSelect"
                    value={'test'}
                    onChange={e => console.log(e.target.value)}
                    required
                />
            </DialogContent>
        </Dialog>
    );
};

ActionDialogue.propTypes = {
    dialogueContent: PropTypes.any,
    row: PropTypes.array,
    isOpen: PropTypes.bool,
    locale: PropTypes.object,
    noMinContentWidth: PropTypes.bool,
    actionDialogueBoxId: PropTypes.string,
};

ActionDialogue.defaultProps = {
    locale: {
        confirmationTitle: 'Delete and Reassign',
        confirmationMessage: 'Are you sure?',
        cancelButtonLabel: 'No',
        confirmButtonLabel: 'Yes',
        alternateActionButtonLabel: 'Cancel',
    },
};

export default React.memo(ActionDialogue);

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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

export const FilterDialog = ({
    id,
    isOpen = false,
    isBusy = false,
    noMinContentWidth = true,
    data,
    row,
    locale,
    onCancel,
    onProceed,
}) => {
    const classes = useStyles();

    return (
        <Dialog
            classes={{ paper: classes.dialogPaper }}
            style={{ padding: 6 }}
            open={isOpen}
            data-testid={`dialogbox-${id}`}
        >
            <DialogTitle data-testid="message-title">{locale?.title}</DialogTitle>
            <DialogContent style={{ minWidth: !noMinContentWidth ? 400 : 'auto' }}>
                <Grid container spacing={4} className={classes.actionButtons}>
                    <Grid item xs={12} sm={6} container justifyContent="flex-start">
                        <Button
                            variant="outlined"
                            onClick={onCancel}
                            id="actionDialog-cancelButton"
                            data-testid="actionDialog-cancelButton"
                            color={'default'}
                            disabled={!!isBusy}
                        >
                            {locale.button.cancel}
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} container justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onProceed}
                            id="actionDialog-proceedButton"
                            data-testid="actionDialog-proceedButton"
                            disabled={!!isBusy}
                        >
                            {locale.button.submit}
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

FilterDialog.propTypes = {
    dialogueContent: PropTypes.any,
    data: PropTypes.array,
    row: PropTypes.object,
    isOpen: PropTypes.bool,
    locale: PropTypes.object,
    noMinContentWidth: PropTypes.bool,
    id: PropTypes.string,
    onCancel: PropTypes.func,
    onProceed: PropTypes.func,
    isBusy: PropTypes.bool,
};

export default React.memo(FilterDialog);

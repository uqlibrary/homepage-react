/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';

const useStyles = makeStyles(theme => ({
    contentBox: {
        minWidth: '90%',
        paddingTop: 20,
        '& img': {
            maxWidth: 800,
            height: 800,
            border: '1px solid grey',
            textAlign: 'center',
        },
        '& li': {
            marginBottom: 10,
            padding: 10,
            '&:hover': {
                backgroundColor: theme.palette.secondary.main,
                transition: 'background-color 1s ease',
            },
            '& p': {
                marginBottom: 0,
                marginTop: 1,
            },
        },
        '& [aria-labelledby="lightboxTitle"]': {
            color: 'blue',
        },
    },
    dialogPaper: {
        // make the block take up more of the page
        width: 500,
    },
    link: {
        marginBottom: 10,
        marginRight: 10,
        cursor: 'pointer',
    },
}));
export const PromoPanelFormConfirmation = ({
    confirmationMode,
    isConfirmOpen,
    confirmSave,
    cancelAction,
    confirmationMessage,
}) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Dialog
                open={isConfirmOpen}
                aria-labelledby="lightboxTitle"
                PaperProps={{ classes: { root: classes.dialogPaper } }}
            >
                <DialogTitle
                    id="lightboxTitle"
                    data-testid="panel-save-or-schedule-title"
                    style={{ position: 'relative', borderBottom: '1px solid #d7d1cc', fontSize: 12 }}
                    children={
                        <p style={{ lineHeight: 1, margin: 0 }}>
                            {confirmationMode === 'save' ? 'Please Confirm' : 'Schedule Conflict'}
                        </p>
                    }
                />
                {confirmationMode === 'save' && (
                    <DialogContent>
                        <Grid container spacing={1}>
                            {confirmationMessage}
                        </Grid>

                        <Grid item xs={12} align="right">
                            <Button
                                style={{ marginTop: 10 }}
                                color="secondary"
                                children="Cancel"
                                data-testid="admin-promopanel-group-button-cancel"
                                variant="contained"
                                onClick={cancelAction}
                            />
                            <Button
                                style={{ marginTop: 10 }}
                                color="primary"
                                children="Confirm"
                                data-testid="admin-promopanel-group-button-save"
                                variant="contained"
                                onClick={confirmSave}
                            />
                        </Grid>
                    </DialogContent>
                )}
                {confirmationMode === 'schedule' && (
                    <DialogContent>
                        <Grid container spacing={1}>
                            {confirmationMessage}
                        </Grid>

                        <Grid item xs={12} align="right">
                            <Button
                                style={{ marginTop: 10 }}
                                color="secondary"
                                children="Cancel"
                                data-testid="admin-promopanel-group-button-cancel"
                                variant="contained"
                                onClick={cancelAction}
                            />
                        </Grid>
                    </DialogContent>
                )}
            </Dialog>
        </React.Fragment>
    );
};

PromoPanelFormConfirmation.propTypes = {
    isConfirmOpen: PropTypes.bool,
    confirmationMode: PropTypes.string,
    confirmSave: PropTypes.func,
    cancelAction: PropTypes.func,
    confirmationMessage: PropTypes.any,
};

PromoPanelFormConfirmation.defaultProps = {};

export default PromoPanelFormConfirmation;

/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

export const PromoPanelFormConfirmation = ({
    confirmationMode,
    isConfirmOpen,
    confirmSave,
    cancelAction,
    confirmationMessage,
}) => {
    return (
        <React.Fragment>
            <Dialog open={isConfirmOpen} aria-labelledby="lightboxTitle" PaperProps={{ sx: { width: 500 } }}>
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

export default PromoPanelFormConfirmation;

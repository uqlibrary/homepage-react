import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText';

export const PromoPanelSaveConfirmation = ({
    isConfirmOpen,
    title,
    content,
    primaryAction,
    secondaryAction,
    primaryText,
    secondaryText,
}) => {
    return (
        <React.Fragment>
            <Dialog open={isConfirmOpen} aria-labelledby="lightboxTitle">
                {title && (
                    <DialogTitle
                        id="lightboxTitle"
                        data-testid="panel-save-or-schedule-title"
                        style={{ position: 'relative', borderBottom: '1px solid #d7d1cc', fontSize: 12 }}
                        children={<p style={{ lineHeight: 1, margin: 0 }}>{title}</p>}
                    />
                )}

                <DialogContent>
                    <Grid container spacing={1}>
                        <DialogContentText>{content}</DialogContentText>
                    </Grid>

                    <Grid item xs={12} align="right">
                        <Button
                            style={{ marginTop: 10 }}
                            color="secondary"
                            children={secondaryText}
                            data-testid="admin-promopanel-group-button-cancel"
                            variant="contained"
                            onClick={secondaryAction}
                        />
                        <Button
                            style={{ marginTop: 10 }}
                            color="primary"
                            children={primaryText}
                            data-testid="admin-promopanel-group-button-save"
                            variant="contained"
                            onClick={primaryAction}
                        />
                    </Grid>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

PromoPanelSaveConfirmation.propTypes = {
    isConfirmOpen: PropTypes.bool,
    title: PropTypes.any,
    content: PropTypes.any,
    primaryAction: PropTypes.func,
    secondaryAction: PropTypes.func,
    primaryText: PropTypes.string,
    secondaryText: PropTypes.string,
};

export default PromoPanelSaveConfirmation;

import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import SimpleBackdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/styles';
import Drawer from '@material-ui/core/Drawer';

const useStyles = makeStyles(
    theme => ({
        drawer: {
            overflowY: 'scroll',
            '& p': {
                marginBlockStart: 0,
                marginBlockEnd: '1em',
            },
            '& li': {
                marginBlockStart: 0,
                marginBlockEnd: '1em',
            },
            '& dt': {
                fontStyle: 'italic',
            },
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(2, 4, 3),
            width: 500,
            [theme.breakpoints.down('sm')]: {
                width: 200,
            },
        },
        actionButtonPlacer: {
            float: 'right',
            marginTop: 16,
            marginRight: 16,
        },
        addButton: {
            backgroundColor: theme.palette.accent.main,
            color: '#fff',
            '&:hover': {
                backgroundColor: theme.palette.accent.dark,
            },
        },
    }),
    { withTheme: true },
);
export const AlertHelpModal = ({ actions, history, helpEntry, helpButtonLabel, showAddButton }) => {
    const classes = useStyles();

    const [lightboxOpen, setLightboxOpen] = useState(false);

    const openHelpLightbox = () => {
        setLightboxOpen(true);
    };

    const closeHelpLightbox = () => {
        setLightboxOpen(false);
    };

    const navigateToAddPage = () => {
        console.log('navigateToAddPage');
        // console.log('navigateToAddPage actions.clearAnAlert() = ', actions.clearAnAlert());
        actions.clearAnAlert();
        // () => dispatch(actions.clearAnAlert());
        history.push('/admin/alerts/add');
    };

    return (
        <Fragment>
            {!!helpEntry && (
                <div className={classes.actionButtonPlacer}>
                    <Button
                        children={helpButtonLabel}
                        color="secondary"
                        data-testid="admin-alerts-help-button"
                        id="admin-alerts-help-button"
                        onClick={openHelpLightbox}
                        variant="contained"
                    />
                </div>
            )}
            {!!showAddButton && (
                <div className={classes.actionButtonPlacer}>
                    <Button
                        children="Add alert"
                        className={classes.addButton}
                        color="primary"
                        data-testid="admin-alerts-help-display-button"
                        onClick={() => navigateToAddPage()}
                        variant="contained"
                    />
                </div>
            )}
            <Drawer
                anchor="right"
                className={classes.drawer}
                open={lightboxOpen}
                onClose={closeHelpLightbox}
                closeAfterTransition
                BackdropComponent={SimpleBackdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={lightboxOpen}>
                    <div className={classes.paper}>
                        <h2>{helpEntry?.title || 'TBA'}</h2>
                        <div>{helpEntry?.text || ''}</div>
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                children={helpEntry?.buttonLabel || 'Close'}
                                onClick={closeHelpLightbox}
                            />
                        </div>
                    </div>
                </Fade>
            </Drawer>
        </Fragment>
    );
};

AlertHelpModal.propTypes = {
    actions: PropTypes.any,
    helpEntry: PropTypes.any,
    helpButtonLabel: PropTypes.string,
    history: PropTypes.object,
    showAddButton: PropTypes.bool,
};

AlertHelpModal.defaultProps = {
    showAddButton: false,
    helpButtonLabel: 'Help',
};

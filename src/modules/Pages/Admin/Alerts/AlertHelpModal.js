import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import SimpleBackdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/styles';
import Modal from '@material-ui/core/Modal';

import { default as locale } from './alertsadmin.locale';

const useStyles = makeStyles(
    theme => ({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflowY: 'scroll',
            maxHeight: '75%',
            paddingTop: '30%',
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
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            maxWidth: '75%',
            marginTop: 1000,
            marginBottom: 64,
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
export const AlertHelpModal = ({ actions, history, showAddButton = false }) => {
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
            <div className={classes.actionButtonPlacer}>
                <Button
                    children="About alerts"
                    color="secondary"
                    data-testid="admin-alerts-help-button"
                    id="admin-alerts-help-button"
                    onClick={openHelpLightbox}
                />
            </div>
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
            <Modal
                className={classes.modal}
                open={lightboxOpen}
                onClose={closeHelpLightbox}
                closeAfterTransition
                BackdropComponent={SimpleBackdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={lightboxOpen}>
                    <div className={classes.paper}>{locale.helpPopupText}</div>
                </Fade>
            </Modal>
        </Fragment>
    );
};

AlertHelpModal.propTypes = {
    actions: PropTypes.any,
    history: PropTypes.object,
    showAddButton: PropTypes.bool,
};

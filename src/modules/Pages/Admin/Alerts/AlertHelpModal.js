import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import Backdrop from '@material-ui/core/Backdrop';
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
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            maxWidth: '75%',
            marginTop: 64,
            marginBottom: 64,
        },
        actionbutton: {
            backgroundColor: theme.palette.accent.main,
            padding: 8,
            color: '#fff',
            textTransform: 'uppercase',
            borderWidth: 0,
        },
        actionButtonPlacer: {
            float: 'right',
            marginTop: 16,
            marginRight: 16,
        },
    }),
    { withTheme: true },
);
export const AlertHelpModal = ({ showAddButton = false, history }) => {
    const classes = useStyles();

    const [lightboxOpen, setLightboxOpen] = useState(false);

    const openHelpLightbox = () => {
        setLightboxOpen(true);
    };

    const closeHelpLightbox = () => {
        setLightboxOpen(false);
    };

    const navigateToAddPage = () => {
        history.push('/admin/alerts/add');
    };

    return (
        <Fragment>
            <div className={classes.actionButtonPlacer}>
                <button
                    className={classes.actionbutton}
                    onClick={openHelpLightbox}
                    data-testid="admin-alerts-help-button"
                >
                    Help / Info
                </button>
            </div>
            {!!showAddButton && (
                <div className={classes.actionButtonPlacer}>
                    <button
                        className={classes.actionbutton}
                        onClick={() => navigateToAddPage()}
                        data-testid="admin-alerts-list-add-button"
                    >
                        Add alert
                    </button>
                </div>
            )}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={lightboxOpen}
                onClose={closeHelpLightbox}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                disableScrollLock
            >
                <Fade in={lightboxOpen}>
                    <div className={classes.paper}>{locale.helpPopupText}</div>
                </Fade>
            </Modal>
        </Fragment>
    );
};

AlertHelpModal.propTypes = {
    history: PropTypes.object,
    showAddButton: PropTypes.bool,
};

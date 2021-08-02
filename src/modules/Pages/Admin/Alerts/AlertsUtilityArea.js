import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import SimpleBackdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/styles';
import Drawer from '@material-ui/core/Drawer';

/**
 * a block that shows:
 * - page heading
 * - utility buttons (help, add alert, clone alert)
 * - the help drawer
 */

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
export const AlertsUtilityArea = ({
    actions,
    helpButtonLabel,
    helpContent,
    history,
    showAddButton,
    showCloneButton,
}) => {
    const classes = useStyles();

    const [lightboxOpen, setLightboxOpen] = useState(false);

    const { alertid } = useParams();

    const openHelpLightbox = () => {
        setLightboxOpen(true);
    };

    const closeHelpLightbox = () => {
        setLightboxOpen(false);
    };

    const navigateToAddPage = () => {
        actions.clearAnAlert();
        history.push('/admin/alerts/add');
    };

    const navigateToCloneForm = () => {
        history.push(`/admin/alerts/clone/${alertid}`);

        const topOfPage = document.getElementById('StandardPage');
        !!topOfPage && topOfPage.scrollIntoView();
    };

    return (
        <Fragment>
            {!!helpContent && (
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
            {!!showCloneButton && (
                <div className={classes.actionButtonPlacer}>
                    <Button
                        children="Clone alert"
                        className={classes.addButton}
                        color="primary"
                        data-testid="admin-alerts-modal-clone-button"
                        onClick={() => navigateToCloneForm()}
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
                        <h2>{helpContent?.title || 'TBA'}</h2>
                        <div>{helpContent?.text || ''}</div>
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                children={helpContent?.buttonLabel || 'Close'}
                                onClick={closeHelpLightbox}
                            />
                        </div>
                    </div>
                </Fade>
            </Drawer>
        </Fragment>
    );
};

AlertsUtilityArea.propTypes = {
    actions: PropTypes.any,
    // cloneAnAlert: PropTypes.any,
    helpContent: PropTypes.any,
    helpButtonLabel: PropTypes.string,
    history: PropTypes.object,
    showAddButton: PropTypes.bool,
    showCloneButton: PropTypes.bool,
};

AlertsUtilityArea.defaultProps = {
    // cloneAnAlert: null,
    helpButtonLabel: 'Help',
    showAddButton: false,
    showCloneButton: false,
};

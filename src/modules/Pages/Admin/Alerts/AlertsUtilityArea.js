import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import SimpleBackdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import { makeStyles } from '@mui/styles';
import Drawer from '@mui/material/Drawer';

/**
 * a block that shows:
 * - page heading
 * - utility buttons (help, add alert, anything else we want to put up here)
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
            [theme.breakpoints.down('md')]: {
                width: 200,
            },
        },
        actionButtonPlacer: {
            float: 'right',
            marginTop: 16,
            marginRight: 16,
        },
    }),
    { withTheme: true },
);
export const AlertsUtilityArea = ({ actions, helpButtonLabel, helpContent, history, showAddButton }) => {
    const classes = useStyles();

    const [lightboxOpen, setLightboxOpen] = useState(false);

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
                        <h2>{helpContent?.title || /* istanbul ignore next */ 'TBA'}</h2>
                        <div>{helpContent?.text || /* istanbul ignore next */ ''}</div>
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
    helpContent: PropTypes.any,
    helpButtonLabel: PropTypes.string,
    history: PropTypes.object,
    showAddButton: PropTypes.bool,
};

AlertsUtilityArea.defaultProps = {
    helpButtonLabel: 'Help',
    showAddButton: false,
};

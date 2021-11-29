import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import SimpleBackdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/styles';
import Drawer from '@material-ui/core/Drawer';

/**
 * a block that shows:
 * - page heading
 * - utility buttons (help, add spotlight, anything else we want to put up here)
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
    }),
    { withTheme: true },
);
export const SpotlightsUtilityArea = ({ actions, helpButtonLabel, helpContent, history, showAddButton }) => {
    const classes = useStyles();

    const [lightboxOpen, setLightboxOpen] = useState(false);

    const openHelpLightbox = () => {
        setLightboxOpen(true);
    };

    const closeHelpLightbox = () => {
        setLightboxOpen(false);
    };

    const navigateToAddPage = () => {
        actions.clearASpotlight();
        history.push('/admin/spotlights/add');
    };

    return (
        <Fragment>
            {!!helpContent && (
                <div className={classes.actionButtonPlacer}>
                    <Button
                        children={helpButtonLabel}
                        color="secondary"
                        data-testid="admin-spotlights-help-button"
                        id="admin-spotlights-help-button"
                        onClick={openHelpLightbox}
                        variant="contained"
                    />
                </div>
            )}
            {!!showAddButton && (
                <div className={classes.actionButtonPlacer}>
                    <Button
                        children="Add spotlight"
                        color="primary"
                        data-testid="admin-spotlights-help-display-button"
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

SpotlightsUtilityArea.propTypes = {
    actions: PropTypes.any,
    helpContent: PropTypes.any,
    helpButtonLabel: PropTypes.string,
    history: PropTypes.object,
    showAddButton: PropTypes.bool,
};

SpotlightsUtilityArea.defaultProps = {
    helpButtonLabel: 'Help',
    showAddButton: false,
};

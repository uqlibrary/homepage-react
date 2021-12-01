import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import { SpotlightsHelpDrawer } from './SpotlightsHelpDrawer';

/**
 * a block that shows:
 * - page heading
 * - utility buttons (help, add spotlight, anything else we want to put up here)
 * - the help drawer
 */

const useStyles = makeStyles(() => ({
    actionButtonPlacer: {
        float: 'right',
        marginTop: 16,
        marginRight: 16,
    },
}));
export const SpotlightsUtilityArea = ({ actions, helpButtonLabel, helpContent, history, showAddButton }) => {
    const classes = useStyles();

    const [helpLightboxOpen, setHelpLightboxOpen] = useState(false);

    const openHelpLightbox = () => {
        setHelpLightboxOpen(true);
    };

    const closeHelpLightbox = () => {
        setHelpLightboxOpen(false);
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
            <SpotlightsHelpDrawer
                helpContent={helpContent}
                closeHelpLightbox={closeHelpLightbox}
                open={helpLightboxOpen}
            />
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

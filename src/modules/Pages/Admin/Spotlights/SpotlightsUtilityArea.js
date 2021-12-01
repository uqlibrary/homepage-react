import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import { SpotlightsHelpDrawer } from './SpotlightsHelpDrawer';
import { SpotlightsViewByImage } from './List/components/SpotlightsViewByImage';

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
export const SpotlightsUtilityArea = ({
    actions,
    helpButtonLabel,
    helpContent,
    history,
    showAddButton,
    showViewByImageButton,
    spotlights,
}) => {
    const classes = useStyles();

    const [helpLightboxOpen, setHelpLightboxOpen] = useState(false);
    const [isViewByImageLightboxOpen, setViewByImageLightboxOpen] = React.useState(false);
    const handleViewByImageLightboxOpen = () => setViewByImageLightboxOpen(true);
    const handleViewByImageLightboxClose = () => setViewByImageLightboxOpen(false);
    // const [viewByImageLightBoxFocus, setViewByImageLightBoxFocus] = React.useState('');
    // const [viewByImageLightBoxRows, setViewByImageLightBoxEntries] = React.useState([]);

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

    const showViewByImageLightbox = () => {
        // const filteredRows = [...allSpotlights].filter(r => r.img_url === spotlightImageUrl);
        /* istanbul ignore else */
        if (spotlights.length > 0) {
            // setViewByImageLightBoxFocus(spotlightImageUrl);
            // setViewByImageLightBoxEntries(spotlights);
            handleViewByImageLightboxOpen();
        }
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
            {!!showViewByImageButton && (
                <div className={classes.actionButtonPlacer}>
                    <Button
                        children="View by Image"
                        color="primary"
                        data-testid="admin-spotlights-help-display-button"
                        onClick={() => showViewByImageLightbox()}
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
            {!!showViewByImageButton && (
                <SpotlightsViewByImage
                    // spotlightImageUrl={viewByImageLightBoxFocus}
                    spotlights={spotlights}
                    isLightboxOpen={isViewByImageLightboxOpen}
                    handleLightboxClose={handleViewByImageLightboxClose}
                    // navigateToCloneForm={navigateToCloneForm}
                />
            )}
        </Fragment>
    );
};

SpotlightsUtilityArea.propTypes = {
    actions: PropTypes.any,
    helpContent: PropTypes.any,
    helpButtonLabel: PropTypes.string,
    history: PropTypes.object,
    showAddButton: PropTypes.bool,
    showViewByImageButton: PropTypes.bool,
    spotlights: PropTypes.any,
};

SpotlightsUtilityArea.defaultProps = {
    helpButtonLabel: 'Help',
    showAddButton: false,
    showViewByImageButton: false,
};

import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import { SpotlightsHelpDrawer } from './SpotlightsHelpDrawer';
import { SpotlightsViewByImage } from './SpotlightsViewByImage';
import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';
import { styled } from '@mui/material/styles';

/**
 * a block that shows:
 * - page heading
 * - utility buttons (help, add spotlight, anything else we want to put up here)
 * - the help drawer
 */

const StyledActionButtonPlacer = styled('div')(() => ({
    float: 'right',
    marginTop: 16,
    marginRight: 16,
}));
export const SpotlightsUtilityArea = ({
    actions,
    helpButtonLabel = 'Help',
    helpContent,
    history,
    showAddButton = false,
    showViewByImageButton = false,
    spotlights,
    showViewByHistoryLightbox,
}) => {
    const [isViewByImageLightboxOpen, setViewByImageLightboxOpen] = React.useState(false);
    const handleViewByImageLightboxOpen = () => setViewByImageLightboxOpen(true);
    const handleViewByImageLightboxClose = () => setViewByImageLightboxOpen(false);

    const [helpLightboxOpen, setHelpLightboxOpen] = useState(false);
    const openHelpLightbox = () => setHelpLightboxOpen(true);
    const closeHelpLightbox = () => setHelpLightboxOpen(false);

    const navigateToAddPage = () => {
        actions.clearASpotlight();
        history.push('/admin/spotlights/add');
    };

    return (
        <Fragment>
            {!!helpContent && (
                <StyledActionButtonPlacer>
                    <Button
                        children={helpButtonLabel}
                        color="secondary"
                        data-testid="admin-spotlights-help-button"
                        id="admin-spotlights-help-button"
                        onClick={openHelpLightbox}
                        variant="contained"
                    />
                </StyledActionButtonPlacer>
            )}
            {!!showViewByImageButton && (
                <StyledActionButtonPlacer>
                    <Button
                        children={locale.viewByImage.title}
                        color="primary"
                        data-testid="admin-spotlights-view-by-image-button"
                        onClick={() => handleViewByImageLightboxOpen()}
                        variant="contained"
                    />
                </StyledActionButtonPlacer>
            )}
            {!!showAddButton && (
                <StyledActionButtonPlacer>
                    <Button
                        children="Add spotlight"
                        color="primary"
                        data-testid="admin-spotlights-add-display-button"
                        onClick={() => navigateToAddPage()}
                        variant="contained"
                    />
                </StyledActionButtonPlacer>
            )}
            <SpotlightsHelpDrawer
                helpContent={helpContent}
                closeHelpLightbox={closeHelpLightbox}
                open={helpLightboxOpen}
            />
            {!!showViewByImageButton && (
                <SpotlightsViewByImage
                    spotlights={spotlights}
                    isLightboxOpen={isViewByImageLightboxOpen}
                    handleLightboxClose={handleViewByImageLightboxClose}
                    showViewByHistoryLightbox={showViewByHistoryLightbox}
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
    showViewByHistoryLightbox: PropTypes.any,
};

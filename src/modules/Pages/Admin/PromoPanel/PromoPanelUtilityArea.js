import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import { PromoPanelHelpDrawer } from './PromoPanelHelpDrawer';
import { styled } from '@mui/material/styles';

const StyledActionButtonPlacer = styled('div')(() => ({
    float: 'right',
    marginTop: 16,
    marginRight: 16,
}));

export const navigateToAddPage = history => {
    history.push('/admin/promopanel/add');
};

export const PromoPanelUtilityArea = ({
    helpButtonLabel = /* istanbul ignore next */ 'Help',
    helpContent,
    history,
    showAddButton = false,
}) => {
    const [helpLightboxOpen, setHelpLightboxOpen] = useState(false);

    const openHelpLightbox = () => setHelpLightboxOpen(true);
    const closeHelpLightbox = () => setHelpLightboxOpen(false);

    return (
        <Fragment>
            {!!helpContent && (
                <StyledActionButtonPlacer>
                    <Button
                        children={helpButtonLabel}
                        color="secondary"
                        data-testid="admin-promopanel-help-button"
                        id="admin-promopanel-help-button"
                        onClick={openHelpLightbox}
                        variant="contained"
                    />
                </StyledActionButtonPlacer>
            )}
            {!!showAddButton && (
                <StyledActionButtonPlacer>
                    <Button
                        children="Add panel"
                        color="primary"
                        data-testid="admin-promopanel-add-display-button"
                        id="admin-promopanel-add-display-button"
                        onClick={() => navigateToAddPage(history)}
                        variant="contained"
                    />
                </StyledActionButtonPlacer>
            )}

            <PromoPanelHelpDrawer
                helpContent={helpContent}
                closeHelpLightbox={closeHelpLightbox}
                open={helpLightboxOpen}
            />
        </Fragment>
    );
};

PromoPanelUtilityArea.propTypes = {
    helpContent: PropTypes.any,
    helpButtonLabel: PropTypes.string,
    history: PropTypes.object,
    showAddButton: PropTypes.bool,
};

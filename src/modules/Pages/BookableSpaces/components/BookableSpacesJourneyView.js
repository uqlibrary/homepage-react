import React from 'react';
import PropTypes from 'prop-types';

import JourneyBreadcrumbs from 'modules/Pages/BookableSpaces/JourneyBreadcrumbs';
import { StyledJourneyContentShell } from './journeyViewStyles';

export const BookableSpacesJourneyView = ({
    view,
    selectedIntent,
    selectedIntentId,
    selectedSpace,
    navigateToView,
    setSelectedIntentId,
    setSelectedSpace,
    journeyTopRef,
    renderLandingView,
    renderResultsView,
    renderDetailsView,
}) => {
    return (
        <StyledJourneyContentShell data-testid="bookable-spaces-journey-results-view-shell" ref={journeyTopRef}>
            <JourneyBreadcrumbs
                view={view}
                selectedIntent={selectedIntent}
                selectedIntentId={selectedIntentId}
                navigateToView={navigateToView}
                setSelectedIntentId={setSelectedIntentId}
                setSelectedSpace={setSelectedSpace}
            />
            {view === 'landing' && renderLandingView?.()}
            {view === 'results' && renderResultsView?.()}
            {view === 'details' && !!selectedSpace && renderDetailsView?.()}
        </StyledJourneyContentShell>
    );
};

BookableSpacesJourneyView.propTypes = {
    view: PropTypes.oneOf(['landing', 'results', 'details']).isRequired,
    selectedIntent: PropTypes.object,
    selectedIntentId: PropTypes.any,
    selectedSpace: PropTypes.object,
    navigateToView: PropTypes.func.isRequired,
    setSelectedIntentId: PropTypes.func.isRequired,
    setSelectedSpace: PropTypes.func.isRequired,
    journeyTopRef: PropTypes.object,
    renderLandingView: PropTypes.func,
    renderResultsView: PropTypes.func,
    renderDetailsView: PropTypes.func,
};

export default BookableSpacesJourneyView;

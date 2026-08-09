import React from 'react';
import PropTypes from 'prop-types';

import JourneySpaceDetailsView from 'modules/Pages/BookableSpaces/SpacesListPage/MapListPage/components/JourneySpaceDetailsView';

import { StyledJourneyPanelSection } from 'modules/Pages/BookableSpaces/SpacesListPage/SimpleListPage/components/journeyViewStyles';

export const JourneyDetailsView = props => {
    return (
        <StyledJourneyPanelSection hasTopSpacing>
            <JourneySpaceDetailsView
                {...props}
                showBackButton={false}
                narrowView={false}
                verticalView={false}
                showFavouriteControls
                showMap
            />
        </StyledJourneyPanelSection>
    );
};

JourneyDetailsView.propTypes = {
    selectedSpace: PropTypes.object,
    isLoggedIn: PropTypes.bool,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
    isSelectedSpaceFavourite: PropTypes.bool,
    isFavouriteActionInProgress: PropTypes.bool,
    onFavouriteToggle: PropTypes.func,
};

export default JourneyDetailsView;

import React from 'react';
import PropTypes from 'prop-types';
import JourneySpaceDetailsView from 'modules/Pages/BookableSpaces/JourneySpaceDetailsView';
import { StyledJourneyPanel } from './journeyViewStyles';

export const JourneyDetailsView = props => {
    return (
        <StyledJourneyPanel hasTopSpacing>
            <JourneySpaceDetailsView
                {...props}
                showBackButton={false}
                narrowView={false}
                showFavouriteControls
                showMap
            />
        </StyledJourneyPanel>
    );
};

JourneyDetailsView.propTypes = {
    selectedSpace: PropTypes.object,
    isLoggedIn: PropTypes.bool,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
    isSelectedSpaceFavourite: PropTypes.bool,
    favouriteButtonLabel: PropTypes.string,
    isFavouriteActionInProgress: PropTypes.bool,
    onFavouriteToggle: PropTypes.func,
};

export default JourneyDetailsView;

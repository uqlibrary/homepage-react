import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import OpenSpaceNewWindowButton from 'modules/Pages/BookableSpaces/SpacesListPage/MapListPage/components/OpenSpaceNewWindowButton';
import MapSpaceDetails from 'modules/Pages/BookableSpaces/SpacesListPage/MapListPage/components/MapSpaceDetails';

import SpacesFavouriteIcon from 'modules/Pages/BookableSpaces/Shared/SpacesFavouriteIcon';
import { StyledSkipLinkAnchor } from 'helpers/general';

const StyledHeadingWrapperSpan = styled(Grid)(() => ({
    display: 'inline-flex',
    alignItems: 'center',
    paddingRight: '1rem',
    span: {
        paddingLeft: '6px',
    },
    '&:has(.openNewWrapper)': {
        paddingRight: '2rem',
    },
}));
const StyledBookableSpaceGridItem = styled(Grid)(() => ({
    marginTop: '12px',
    '&:last-child': {
        marginBottom: '1rem',
    },
}));
const StyledSpaceGridWrapperDiv = styled('div')(() => ({
    backgroundColor: 'white',
    overflowY: 'auto',
    maxHeight: '99vh',
    paddingTop: '0.5rem',
    paddingLeft: '1rem',
}));

const SidebarSpacesList = ({
    filteredSpaceLocations,
    totalSpaceCount,
    activeFilterCount,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
    StyledStandardCard,
    suppliedClassName = null,
    spacesFavouritesList = null,
    onFavouriteToggle = null,
    isFavouriteActionInProgress = false,
    onSpaceSelect = null,
    onSpaceToggle = null,
    expandedSpaceId = null,
}) => {
    // const markerRefs = React.useRef({});
    //
    // const handleMapOpenButtonClick = id => {
    //     if (markerRefs.current[id]) {
    //         markerRefs.current[id].openPopup();
    //     }
    // };

    return (
        <StyledSpaceGridWrapperDiv id="space-wrapper" data-testid="space-wrapper" className={suppliedClassName}>
            <StyledSkipLinkAnchor href="#topOfSidebar">Skip back to list of filters</StyledSkipLinkAnchor>
            {filteredSpaceLocations?.length === 0 && (
                <p data-testid="no-spaces-visible">
                    No Spaces match these filters - change your selection in the sidebar to show some spaces.
                </p>
            )}
            {filteredSpaceLocations?.length > 0 && (
                <Typography
                    component={'h2'}
                    variant={'h6'}
                    data-testid={
                        !!activeFilterCount && filteredSpaceLocations?.length < totalSpaceCount
                            ? 'space-space-count'
                            : undefined
                    }
                >
                    Available Spaces
                    {!!activeFilterCount && filteredSpaceLocations?.length < totalSpaceCount && (
                        <span> ({filteredSpaceLocations.length})</span>
                    )}
                </Typography>
            )}
            {filteredSpaceLocations?.length > 0 &&
                filteredSpaceLocations?.map(bookableSpace => {
                    const isExpanded = expandedSpaceId === bookableSpace?.space_id;
                    return (
                        <StyledBookableSpaceGridItem
                            item
                            xs={12}
                            key={`space-${bookableSpace?.space_id}`}
                            id={`space-${bookableSpace?.space_id}`}
                            data-testid={`space-${bookableSpace?.space_id}`}
                            // style={{ display: 'block' }}
                        >
                            <StyledStandardCard
                                fullHeight
                                title={
                                    <StyledHeadingWrapperSpan>
                                        <SpacesFavouriteIcon
                                            bookableSpace={bookableSpace}
                                            isFavourite={spacesFavouritesList?.some(
                                                fav => fav.space_id === bookableSpace?.space_id,
                                            )}
                                            onFavouriteToggle={onFavouriteToggle}
                                            isFavouriteActionInProgress={isFavouriteActionInProgress}
                                        />
                                        <span
                                            onClick={() => onSpaceSelect?.(bookableSpace)}
                                            onKeyDown={() => onSpaceSelect?.(bookableSpace)}
                                            style={onSpaceSelect ? { cursor: 'pointer' } : undefined}
                                            title="Show on map"
                                            data-testid={`space-${bookableSpace.space_id}-name`}
                                        >
                                            {bookableSpace?.space_type_details?.space_type_name}{' '}
                                            {bookableSpace?.space_name}
                                        </span>
                                        {isExpanded && (
                                            <span className="openNewWrapper" style={{ paddingBlock: '0.2rem' }}>
                                                <OpenSpaceNewWindowButton spaceDetails={bookableSpace} />
                                            </span>
                                        )}
                                    </StyledHeadingWrapperSpan>
                                }
                                style={{ marginRight: '0.5rem' }}
                                squareTop
                                subCard
                            >
                                <MapSpaceDetails
                                    weeklyHours={weeklyHours}
                                    weeklyHoursLoading={weeklyHoursLoading}
                                    weeklyHoursError={weeklyHoursError}
                                    bookableSpace={bookableSpace}
                                    collapsed
                                    isExpanded={isExpanded}
                                    onToggle={onSpaceToggle}
                                    isFavouriteActionInProgress={isFavouriteActionInProgress}
                                    isFavourite={spacesFavouritesList?.some(
                                        fav => fav.space_id === bookableSpace?.space_id,
                                    )}
                                />
                            </StyledStandardCard>
                        </StyledBookableSpaceGridItem>
                    );
                })}
        </StyledSpaceGridWrapperDiv>
    );
};

SidebarSpacesList.propTypes = {
    filteredSpaceLocations: PropTypes.any,
    totalSpaceCount: PropTypes.number,
    activeFilterCount: PropTypes.number,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
    StyledStandardCard: PropTypes.any,
    suppliedClassName: PropTypes.string,
    spacesFavouritesList: PropTypes.any,
    onFavouriteToggle: PropTypes.func,
    isFavouriteActionInProgress: PropTypes.any,
    onSpaceSelect: PropTypes.func,
    onSpaceToggle: PropTypes.func,
    expandedSpaceId: PropTypes.number,
};

export default React.memo(SidebarSpacesList);

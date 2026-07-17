import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material';

import SpaceDetails from 'modules/Pages/BookableSpaces/SpaceDetails';
import RenderFavouriteIcon from 'modules/Pages/BookableSpaces/RenderFavouriteIcon';

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
    '& .showsOnlyOnFocus': {
        position: 'absolute',
        left: '-999px',
        top: '-999px',
        '&:focus': {
            position: 'relative',
            top: 'inherit',
            left: 'inherit',
        },
    },
}));

const SidebarSpacesList = ({
    filteredSpaceLocations,
    totalSpaceCount,
    activeFilterCount,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
    StyledStandardCard,
    showAllData = false,
    suppliedClassName = null,
    spacesFavouritesList = null,
    isLoggedIn = false,
    onFavouriteToggle = null,
    isFavouriteActionInProgress = false,
    onSpaceSelect = null,
    onSpaceToggle = null,
    expandedSpaceId = null,
}) => {
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm')) || false;
    const _isTabletViewJust = useMediaQuery(theme.breakpoints.down('lg')) || false;
    const isTabletView = isMobileView ? false : _isTabletViewJust;
    const isDesktopView = !isTabletView && !isMobileView;

    // const markerRefs = React.useRef({});
    //
    // const handleMapOpenButtonClick = id => {
    //     if (markerRefs.current[id]) {
    //         markerRefs.current[id].openPopup();
    //     }
    // };

    return (
        <StyledSpaceGridWrapperDiv id="space-wrapper" data-testid="space-wrapper" className={suppliedClassName}>
            <a className="showsOnlyOnFocus" href="#topOfSidebar">
                Skip back to list of filters
            </a>
            {filteredSpaceLocations?.length === 0 && (
                <p data-testid="no-spaces-visible">
                    No Spaces match these filters - change your selection in the sidebar to show some spaces.
                </p>
            )}
            {filteredSpaceLocations?.length > 0 && (
                <Typography
                    component={'h2'}
                    variant={'h6'}
                    // className="showsOnlyOnFocus"
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
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <RenderFavouriteIcon
                                            bookableSpace={bookableSpace}
                                            isFavourite={spacesFavouritesList?.some(
                                                fav => fav.space_id === bookableSpace?.space_id,
                                            )}
                                            onFavouriteToggle={onFavouriteToggle}
                                            isFavouriteActionInProgress={isFavouriteActionInProgress}
                                        />
                                        <span
                                            onClick={() => onSpaceSelect?.(bookableSpace)}
                                            style={onSpaceSelect ? { cursor: 'pointer' } : undefined}
                                            title="Show on map"
                                            data-testid={`space-${bookableSpace.space_id}-name`}
                                        >
                                            {bookableSpace?.space_type_details?.space_type_name}
                                        </span>
                                    </span>
                                }
                                style={{ marginRight: '0.5rem' }}
                                squareTop
                                subCard
                            >
                                <SpaceDetails
                                    weeklyHours={weeklyHours}
                                    weeklyHoursLoading={weeklyHoursLoading}
                                    weeklyHoursError={weeklyHoursError}
                                    bookableSpace={bookableSpace}
                                    collapsed
                                    showAllData
                                    isExpanded={expandedSpaceId === bookableSpace?.space_id}
                                    onToggle={onSpaceToggle}
                                    isFavouriteActionInProgress={isFavouriteActionInProgress}
                                    spacesFavouritesList={spacesFavouritesList}
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
    showAllData: PropTypes.bool,
    suppliedClassName: PropTypes.string,
    spacesFavouritesList: PropTypes.any,
    isLoggedIn: PropTypes.bool,
    onFavouriteToggle: PropTypes.func,
    isFavouriteActionInProgress: PropTypes.bool,
    onSpaceSelect: PropTypes.func,
    onSpaceToggle: PropTypes.func,
    expandedSpaceId: PropTypes.number,
};

export default React.memo(SidebarSpacesList);

import React from 'react';
import PropTypes from 'prop-types';

import { Button, Grid, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

import SpaceDetails from 'modules/Pages/BookableSpaces/SpaceDetails';

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
    onSpaceExpand = null,
    activeNavigationSpaceId = null,
    onNavigate = null,
}) => {
    // const markerRefs = React.useRef({});
    //
    // const handleMapOpenButtonClick = id => {
    //     if (markerRefs.current[id]) {
    //         markerRefs.current[id].openPopup();
    //     }
    // };

    const renderFavouriteIcon = bookableSpace => {
        if (!isLoggedIn || !onFavouriteToggle) {
            return null;
        }

        const isFavourite = spacesFavouritesList?.some(fav => fav.space_id === bookableSpace?.space_id);

        if (isFavourite) {
            return (
                <Tooltip title="Remove from Favourites" arrow>
                    <StarIcon
                        onClick={() => onFavouriteToggle('removeSpaceFavourite', bookableSpace?.space_id)}
                        sx={{
                            fill: '#FFD700',
                            cursor: isFavouriteActionInProgress ? 'not-allowed' : 'pointer',
                            fontSize: '1.5rem',
                            flexShrink: 0,
                        }}
                        data-testid={`favourite-star-${bookableSpace?.space_id}`}
                    />
                </Tooltip>
            );
        }

        return (
            <Tooltip title="Add to Favourites" arrow>
                <StarBorderIcon
                    onClick={() => onFavouriteToggle('addSpaceFavourite', bookableSpace?.space_id)}
                    sx={{
                        fill: '#666',
                        cursor: isFavouriteActionInProgress ? 'not-allowed' : 'pointer',
                        fontSize: '1.5rem',
                        flexShrink: 0,
                    }}
                    data-testid={`favourite-star-outline-${bookableSpace?.space_id}`}
                />
            </Tooltip>
        );
    };

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
                                        {renderFavouriteIcon(bookableSpace)}
                                        <button
                                            type="button"
                                            onClick={() => onSpaceExpand?.(bookableSpace)}
                                            style={{
                                                background: 'none',
                                                border: 0,
                                                cursor: onSpaceExpand ? 'pointer' : 'default',
                                                font: 'inherit',
                                                padding: 0,
                                                textAlign: 'left',
                                            }}
                                            title="Show on map"
                                        >
                                            {bookableSpace?.space_type_details?.space_type_name}
                                        </button>
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
                                    showAllData={showAllData}
                                    onExpand={onSpaceExpand}
                                />
                                {onNavigate && (
                                    <Button
                                        variant={
                                            activeNavigationSpaceId === bookableSpace?.space_id
                                                ? 'contained'
                                                : 'outlined'
                                        }
                                        size="small"
                                        onClick={() => onNavigate(bookableSpace)}
                                        sx={{ mt: 2 }}
                                        data-testid={`space-navigate-${bookableSpace?.space_id}`}
                                    >
                                        {activeNavigationSpaceId === bookableSpace?.space_id
                                            ? 'Navigation active'
                                            : 'Navigate to'}
                                    </Button>
                                )}
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
    onSpaceExpand: PropTypes.func,
    activeNavigationSpaceId: PropTypes.number,
    onNavigate: PropTypes.func,
};

export default React.memo(SidebarSpacesList);

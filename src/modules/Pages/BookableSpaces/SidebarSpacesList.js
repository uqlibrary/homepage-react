import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

import SpaceDetails from 'modules/Pages/BookableSpaces/SpaceDetails';

const StyledBookableSpaceGridItem = styled(Grid)(() => ({
    marginTop: '12px',
}));
const StyledBodyGrid = styled(Grid)(() => ({
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
// const StyledMobileSpaceDiv = styled('div')(() => ({
//     '& .descriptionBlock': {
//         height: '3.5rem',
//         overflow: 'hidden',
//         '& p ': {
//             marginTop: 0,
//         },
//     },
// }));
const StyledSpaceGridWrapperDiv = styled('div')(() => ({
    position: 'sticky',
    top: 0,
    overflowY: 'auto',
    height: '100%',

    backgroundColor: 'white',
    flexDirection: 'row',
    flexGrow: 0,
    paddingTop: '3.5rem',
    paddingLeft: '1rem',
    marginTop: '2px',
    flexBasis: '25%',
    // '&.desktop': {
    //     maxWidth: '16.6667%',
    //     flexBasis: '16.6667%',
    // },
    '&.mobile': {
        // position: 'absolute',
    },
}));

const SidebarSpacesList = ({
    filteredSpaceLocations,
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
        <StyledSpaceGridWrapperDiv id="StyledSpaceGridWrapperDivTemp" className={suppliedClassName}>
            <StyledBodyGrid container id="space-wrapper" data-testid="space-wrapper">
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
                    >
                        Available Spaces
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
                                            {!!isLoggedIn && !!onFavouriteToggle ? (
                                                spacesFavouritesList?.some(
                                                    fav => fav.space_id === bookableSpace?.space_id,
                                                ) ? (
                                                    <Tooltip title="Remove from Favourites" arrow>
                                                        <StarIcon
                                                            onClick={() =>
                                                                onFavouriteToggle(
                                                                    'removeSpaceFavourite',
                                                                    bookableSpace?.space_id,
                                                                )
                                                            }
                                                            sx={{
                                                                fill: '#FFD700',
                                                                cursor: isFavouriteActionInProgress
                                                                    ? 'not-allowed'
                                                                    : 'pointer',
                                                                fontSize: '1.5rem',
                                                                flexShrink: 0,
                                                            }}
                                                            data-testid={`favourite-star-${bookableSpace?.space_id}`}
                                                        />
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="Add to Favourites" arrow>
                                                        <StarBorderIcon
                                                            onClick={() =>
                                                                onFavouriteToggle(
                                                                    'addSpaceFavourite',
                                                                    bookableSpace?.space_id,
                                                                )
                                                            }
                                                            sx={{
                                                                fill: '#666',
                                                                cursor: isFavouriteActionInProgress
                                                                    ? 'not-allowed'
                                                                    : 'pointer',
                                                                fontSize: '1.5rem',
                                                                flexShrink: 0,
                                                            }}
                                                            data-testid={`favourite-star-outline-${bookableSpace?.space_id}`}
                                                        />
                                                    </Tooltip>
                                                )
                                            ) : null}
                                            <span
                                                onClick={() => onSpaceExpand?.(bookableSpace)}
                                                style={onSpaceExpand ? { cursor: 'pointer' } : undefined}
                                                title="Show on map"
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
                                        onExpand={onSpaceExpand}
                                    />
                                </StyledStandardCard>
                            </StyledBookableSpaceGridItem>
                        );
                    })}
            </StyledBodyGrid>
        </StyledSpaceGridWrapperDiv>
    );
};

SidebarSpacesList.propTypes = {
    filteredSpaceLocations: PropTypes.any,
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
};

export default React.memo(SidebarSpacesList);

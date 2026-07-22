import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import SingleLinkCard from 'modules/HomePage/publicComponents/HelpNavigation/SingleLinkCard';
import SpaceFavouriteIcon from 'modules/Pages/BookableSpaces/Shared/SpaceFavouriteIcon';

import { serialiseJourneyUrl } from '../journeyHelpers';
import { StyledHeaderWithLinkToAllGridItem } from 'modules/Pages/BookableSpaces/SpacesHomepage/SpacesHomepageStyles';

const StyledFavouritesContainerGrid = styled(Grid)(() => ({
    marginTop: '-24px',
    paddingLeft: 0,
    '& a': {
        boxSizing: 'border-box',
        minWidth: { xs: '100%', sm: '100%' },
    },
    '& li': {
        // position the favourite star at the top left
        position: 'relative',
        '& .topLeft': {
            top: '3rem',
            left: '3rem',
        },
        '& h3': {
            paddingLeft: '2rem',
        },
    },
}));
export const FavouritesList = ({
    favouriteIntentDefinition,
    setSelectedIntentId,
    navigateToView,
    activateFavouritesResults,
    allSpaceLocations,
    filteredSpaceLocations,
    highlightedSpace,
    spacesFavouritesList,
    selectedIntentId,
    setSelectedSpace,
    handleJourneyFavouriteToggle,
    isFavouriteActionInProgress,
    findSpaceById,
    getSpaceIdentifier,
}) => {
    return (
        <Box className="spaces-journey-favourites" sx={{ mb: 3 }}>
            <StyledHeaderWithLinkToAllGridItem item xs={12}>
                <Typography component={'h2'}>Your favourite spaces</Typography>
                <Link
                    data-testid="spaces-homepage-favourites-all-link"
                    to={serialiseJourneyUrl({
                        view: 'results',
                        intentId: favouriteIntentDefinition.id,
                    })}
                    onClick={e => {
                        e.preventDefault();
                        setSelectedIntentId(favouriteIntentDefinition.id);
                        activateFavouritesResults();
                    }}
                >
                    See all favourites
                </Link>
            </StyledHeaderWithLinkToAllGridItem>
            <StyledFavouritesContainerGrid
                component={'ul'}
                container
                spacing={3}
                data-testid="spaces-homepage-favourites-block"
            >
                {(() => {
                    const fullSpaceLookup = [
                        ...(Array.isArray(allSpaceLocations) ? allSpaceLocations : []),
                        ...(Array.isArray(filteredSpaceLocations) ? filteredSpaceLocations : []),
                        ...(highlightedSpace ? [highlightedSpace] : []),
                    ];
                    const uniq = new Map();
                    (spacesFavouritesList || []).forEach(f => {
                        const candidateId = f?.space_id || f?.favourite_id || null;
                        if (!candidateId) {
                            return;
                        }
                        const resolved = findSpaceById(fullSpaceLookup, candidateId);
                        if (!resolved) {
                            return;
                        }
                        if (!uniq.has(String(resolved.space_id))) {
                            uniq.set(String(resolved.space_id), f);
                        }
                    });
                    const favouritesToShow = Array.from(uniq.values()).slice(0, 3);
                    return favouritesToShow.map((fav, idx) => {
                        const space = findSpaceById(fullSpaceLookup, fav?.space_id) || null;
                        const landingSpaceId = space?.space_id || fav?.space_id;
                        const landingUrl = serialiseJourneyUrl({
                            view: 'details',
                            intentId: selectedIntentId,
                            spaceId: getSpaceIdentifier(space) || landingSpaceId,
                        });
                        return (
                            <>
                                <SingleLinkCard
                                    key={fav?.space_id || `fav-${idx}`}
                                    testId={`spaces-journey-favourite-card-${idx + 1}`}
                                    cardHeading={space?.space_name || fav?.label || String(fav?.space_id)}
                                    sx={{
                                        marginBottom: '0px !important',
                                        pr: { xs: '10px' },
                                        pl: { xs: 0 },
                                    }}
                                    landingUrl={landingUrl}
                                    shortParagraph={space?.space_library_name || ''}
                                    fillContainer
                                    ariaLabel={`View details for Space ${space?.space_name} in ${space?.space_library_name}`}
                                    showH3
                                    onClick={() => {
                                        if (space) {
                                            setSelectedSpace(space);
                                            navigateToView('details', {
                                                intentId: selectedIntentId,
                                                spaceId: getSpaceIdentifier(space),
                                            });
                                        } else {
                                            const nextSpaceId = space?.space_id || fav?.space_id;
                                            const nextUrl = serialiseJourneyUrl({
                                                view: 'details',
                                                intentId: selectedIntentId,
                                                spaceId: getSpaceIdentifier(space) || nextSpaceId,
                                            });
                                            window.history.pushState(
                                                {
                                                    journeyView: 'details',
                                                    journeyIntentId: selectedIntentId,
                                                    journeySpaceId: String(getSpaceIdentifier(space) || nextSpaceId),
                                                },
                                                '',
                                                nextUrl,
                                            );
                                        }
                                    }}
                                    followingElement={
                                        <SpaceFavouriteIcon
                                            bookableSpace={space}
                                            isFavourite
                                            onFavouriteToggle={() => handleJourneyFavouriteToggle?.(fav)}
                                            isFavouriteActionInProgress={isFavouriteActionInProgress}
                                            iconPosition="topLeft"
                                            ariaLabel={`Unfavourite Space ${space?.space_name} in ${space?.space_library_name}`}
                                        />
                                    }
                                />
                            </>
                        );
                    });
                })()}
            </StyledFavouritesContainerGrid>
        </Box>
    );
};
FavouritesList.propTypes = {
    favouriteIntentDefinition: PropTypes.any,
    setSelectedIntentId: PropTypes.any,
    navigateToView: PropTypes.any,
    allSpaceLocations: PropTypes.any,
    filteredSpaceLocations: PropTypes.any,
    highlightedSpace: PropTypes.any,
    spacesFavouritesList: PropTypes.any,
    selectedIntentId: PropTypes.any,
    setSelectedSpace: PropTypes.any,
    activateFavouritesResults: PropTypes.func,
    handleJourneyFavouriteToggle: PropTypes.any,
    isFavouriteActionInProgress: PropTypes.any,
    findSpaceById: PropTypes.any,
    getSpaceIdentifier: PropTypes.any,
};

export default FavouritesList;

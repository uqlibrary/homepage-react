import React from 'react';
import PropTypes from 'prop-types';

import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import FavouritesList from 'modules/Pages/BookableSpaces/SpacesHomepage/components/FavouritesList';
import SpacesQuickLinks from 'modules/Pages/BookableSpaces/SpacesHomepage/components/SpacesQuickLinks';
import { getSpaceIdentifier, findSpaceById } from 'modules/Pages/BookableSpaces/spacesHelpers';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

const journeyFallbackImage = require('../../../../../public/images/spaces/hero-jk-murray-library-gatton-students-outdoor-study.jpg');

const StyledLandingHeroShell = styled('section')(({ theme }) => ({
    background: 'linear-gradient(135deg, #4b2271 0%, #5e2c8d 58%, #6f369f 100%)',
    overflow: 'hidden',
    boxShadow: '0 16px 40px rgba(45, 19, 74, 0.16)',
    [theme.breakpoints.down('sm')]: {
        boxShadow: '0 12px 28px rgba(45, 19, 74, 0.14)',
    },
}));

const StyledLandingHeroLayout = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr',
    alignItems: 'stretch',
    minHeight: '420px',
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'minmax(0, 0.95fr) minmax(320px, 1.05fr)',
        minHeight: '390px',
    },
}));

const StyledLandingHeroVisual = styled('div')(({ theme }) => ({
    position: 'relative',
    minHeight: '220px',
    background:
        'linear-gradient(180deg, rgba(20, 8, 34, 0.18) 0%, rgba(20, 8, 34, 0.5) 100%), url(' +
        journeyFallbackImage +
        ')',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    order: 1,
    [theme.breakpoints.up('md')]: {
        order: 2,
        minHeight: '100%',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background:
            'linear-gradient(135deg, rgba(81, 36, 122, 0.18) 0%, rgba(81, 36, 122, 0.04) 42%, rgba(16, 8, 31, 0.38) 100%)',
    },
}));

const StyledLandingHeroContentColumn = styled('div')(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    padding: '1.25rem',
    order: 2,
    [theme.breakpoints.up('md')]: {
        order: 1,
        padding: '2rem 0 2rem 2rem',
    },
}));

const StyledLandingHeroCard = styled('div')(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '640px',
    backgroundColor: '#5a2b87',
    color: '#fff',
    padding: '1.6rem',
    boxShadow: '0 20px 40px rgba(26, 10, 43, 0.28)',
    [theme.breakpoints.up('md')]: {
        marginRight: '-5.5rem',
        padding: '2.25rem 2.5rem',
    },
}));

const StyledLandingHeroInner = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    [theme.breakpoints.down('md')]: {
        maxWidth: '100%',
    },
}));

export const SpacesHomePage = ({
    isLoggedIn,
    spacesFavouritesList,
    isFavouriteActionInProgress = false,
    handleJourneyFavouriteToggle,
    allSpaceLocations,
    filteredSpaceLocations,
    highlightedSpace,
    availableIntentDefinitions,
    favouriteIntentDefinition,
    selectedIntentId,
    handleIntentSelect,
    navigateToView,
    activateFavouritesResults,
    setSelectedSpace,
    setSelectedIntentId,
}) => {
    const hasFavourites = isLoggedIn && (spacesFavouritesList?.length || 0) > 0;
    const availableIntentDefinitionsForLanding = React.useMemo(
        () => (hasFavourites ? [favouriteIntentDefinition, ...availableIntentDefinitions] : availableIntentDefinitions),
        [availableIntentDefinitions, favouriteIntentDefinition, hasFavourites],
    );

    return (
        <>
            <StyledLandingHeroShell>
                <StyledLandingHeroInner data-testid="spaces-journey-landing-hero-inner">
                    <StyledLandingHeroLayout data-testid="spaces-journey-landing-hero-layout">
                        <StyledLandingHeroContentColumn data-testid="spaces-journey-landing-hero-content-column">
                            <StyledLandingHeroCard data-testid="spaces-journey-landing-hero-card">
                                <Typography
                                    component="h1"
                                    sx={{
                                        margin: 0,
                                        fontWeight: 400,
                                        lineHeight: 1.12,
                                        fontSize: { xs: '2.05rem', md: '2.8rem' },
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    Find study spaces
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        mt: 2,
                                        maxWidth: '30rem',
                                        color: 'rgba(255, 255, 255, 0.88)',
                                        lineHeight: 1.7,
                                        fontSize: { xs: '1rem', md: '1.08rem' },
                                    }}
                                >
                                    Discover study space options across UQ libraries.
                                </Typography>
                            </StyledLandingHeroCard>
                        </StyledLandingHeroContentColumn>
                        <StyledLandingHeroVisual data-testid="spaces-journey-landing-hero-visual" aria-hidden="true" />
                    </StyledLandingHeroLayout>
                </StyledLandingHeroInner>
            </StyledLandingHeroShell>
            <div style={{ paddingTop: '64px' }}>
                <StandardPage standardPageId="spaces-journey-content-standard-page">
                    {isLoggedIn && (spacesFavouritesList || []).length > 0 && (
                        <FavouritesList
                            favouriteIntentDefinition={favouriteIntentDefinition}
                            setSelectedIntentId={setSelectedIntentId}
                            navigateToView={navigateToView}
                            activateFavouritesResults={activateFavouritesResults}
                            allSpaceLocations={allSpaceLocations}
                            filteredSpaceLocations={filteredSpaceLocations}
                            highlightedSpace={highlightedSpace}
                            spacesFavouritesList={spacesFavouritesList}
                            selectedIntentId={selectedIntentId}
                            setSelectedSpace={setSelectedSpace}
                            handleJourneyFavouriteToggle={handleJourneyFavouriteToggle}
                            isFavouriteActionInProgress={isFavouriteActionInProgress}
                            findSpaceById={findSpaceById}
                            getSpaceIdentifier={getSpaceIdentifier}
                        />
                    )}
                    <SpacesQuickLinks
                        navigateToView={navigateToView}
                        availableIntentDefinitionsForLanding={availableIntentDefinitionsForLanding}
                        favouriteIntentDefinition={favouriteIntentDefinition}
                        handleIntentSelect={handleIntentSelect}
                    />
                </StandardPage>
            </div>
        </>
    );
};

SpacesHomePage.propTypes = {
    isLoggedIn: PropTypes.bool,
    spacesFavouritesList: PropTypes.array,
    isFavourite: PropTypes.bool,
    handleJourneyFavouriteToggle: PropTypes.func,
    allSpaceLocations: PropTypes.array,
    filteredSpaceLocations: PropTypes.array,
    highlightedSpace: PropTypes.object,
    landingHighlights: PropTypes.array,
    highlightSpaceDescription: PropTypes.string,
    availableIntentDefinitions: PropTypes.array,
    favouriteIntentDefinition: PropTypes.object,
    selectedIntentId: PropTypes.any,
    handleIntentSelect: PropTypes.func,
    navigateToView: PropTypes.func,
    setSelectedSpace: PropTypes.func,
    setSelectedIntentId: PropTypes.func,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
    isFavouriteActionInProgress: PropTypes.bool,
    activateFavouritesResults: PropTypes.func,
};

export default SpacesHomePage;

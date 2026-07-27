import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import SingleLinkCard from 'modules/HomePage/publicComponents/HelpNavigation/SingleLinkCard';

import { StyledHeaderWithLinkToAllGridItem } from 'modules/Pages/BookableSpaces/SpacesHomepage/SpacesHomepageStyles';
import { serialiseJourneyUrl } from 'modules/Pages/BookableSpaces/journeyHelpers';

const browseAllSpacesIcon =
    'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg fill=%27none%27 stroke=%27%2351247A%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%27.75%27%3e%3cpath d=%27M14.29 7.57V3.89c0-.35-.2-.66-.52-.78L10.4 1.77a.83.83 0 0 0-.63 0L6.2 3.2a.8.8 0 0 1-.63 0L2.29 1.89a.41.41 0 0 0-.55.22c-.03.06-.03.12-.03.15v8.03c0 .34.2.65.52.77l3.34 1.34c.2.08.43.08.63 0m-.29-9.14v4.31m4.18-5.86v3.77%27%3e%3c/path%3e%3cpath d=%27M10.52 7.57a2.94 2.94 0 1 1 0 5.88 2.94 2.94 0 0 1 0-5.88zm3.77 6.72L12.6 12.6%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")';

const StyledBrowseAllSpacesCard = styled('section')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '0.5rem',
    marginTop: '2rem',
    backgroundColor: '#f3f3f5',
    borderRadius: '4px',
    padding: '1.5rem',
    [theme.breakpoints.down('sm')]: {
        marginTop: '1.5rem',
        padding: '1.25rem',
    },
    '& h3': {
        margin: '0.25rem 0 0',
        lineHeight: 1.2,
        fontWeight: 500,
        color: '#19191c',
    },
    '& p': {
        marginTop: 1,
        marginBottom: 0,
        lineHeight: 1.5,
        color: '#35353a',
    },
    '& div': {
        marginTop: '0.75rem',
        '& a': {
            border: 0,
            padding: 0,
            background: 'transparent',
            color: theme.palette.primary.main,
            fontSize: '1.25rem',
            lineHeight: 1.3,
            fontWeight: 500,
            textAlign: 'left',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
            transition: 'color 200ms ease-out, text-decoration 200ms ease-out, background-color 200ms ease-out',
            '&:hover, &:focus': {
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                textDecoration: 'underline',
            },
            '&:focus-visible': {
                outline: `3px solid ${theme.palette.primary.main}`,
                outlineOffset: '2px',
            },
            [theme.breakpoints.down('sm')]: {
                fontSize: '1.1rem',
            },
        },
    },
}));

const StyledBrowseAllSpacesIcon = styled('span')(() => ({
    display: 'block',
    width: '56px',
    height: '56px',
    backgroundImage: browseAllSpacesIcon,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
}));

export const SpacesQuickLinks = ({
    navigateToView,
    availableIntentDefinitionsForLanding,
    favouriteIntentDefinition,
    handleIntentSelect,
}) => {
    return (
        <Box className="spaces-list" sx={{ mb: 3 }}>
            <StyledHeaderWithLinkToAllGridItem item xs={12}>
                <Typography component={'h2'} sx={{ fontSize: '32px', fontWeight: 500, marginBottom: '16px' }}>
                    Find a study space
                </Typography>
                <Link
                    to={serialiseJourneyUrl({ view: 'results' })}
                    onClick={e => {
                        e.preventDefault();
                        navigateToView('results');
                    }}
                    data-testid="spaces-journey-showall"
                >
                    See all spaces
                </Link>
            </StyledHeaderWithLinkToAllGridItem>
            <Grid
                container
                spacing={3}
                sx={{
                    mt: '-24px',
                    '& li.MuiGrid-item': { pt: 0 },
                    '& a': { boxSizing: 'border-box', width: '100%', minWidth: { xs: 0, sm: 'auto' } },
                }}
            >
                {(() => {
                    const intentsToShow = (availableIntentDefinitionsForLanding || []).filter(
                        intent => intent && intent.id !== favouriteIntentDefinition.id,
                    );
                    return intentsToShow.map((intent, idx) => {
                        const landingUrl = serialiseJourneyUrl({ view: 'results', intentId: intent.id });
                        return (
                            <SingleLinkCard
                                key={intent.id || `intent-${idx}`}
                                testId={`spaces-journey-intent-card-${intent.id || idx}`}
                                iconBackgroundImage={intent.IconSvg || null}
                                cardHeading={intent.label}
                                landingUrl={landingUrl}
                                shortParagraph={intent.description || ''}
                                fillContainer
                                sx={{ pr: { xs: '10px' }, pl: { xs: 0 } }}
                                onClick={() => handleIntentSelect(intent)}
                                showH3
                            />
                        );
                    });
                })()}
            </Grid>
            <StyledBrowseAllSpacesCard>
                <StyledBrowseAllSpacesIcon aria-hidden="true" />
                <Typography component="h3" sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
                    Browse all spaces
                </Typography>
                <Typography component="p" sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}>
                    Explore all library study spaces on the map!
                </Typography>
                <div>
                    <Link data-testid="spaces-journey-landing-browse-all" to="/spaces/mapresults">
                        Browse all library study spaces
                    </Link>
                </div>
            </StyledBrowseAllSpacesCard>
        </Box>
    );
};
SpacesQuickLinks.propTypes = {
    navigateToView: PropTypes.any,
    availableIntentDefinitionsForLanding: PropTypes.any,
    favouriteIntentDefinition: PropTypes.any,
    handleIntentSelect: PropTypes.any,
};

export default SpacesQuickLinks;
